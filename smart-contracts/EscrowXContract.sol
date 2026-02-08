// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title EscrowXContract
 * @dev A fully decentralized freelancing marketplace escrow contract.
 *      Supports service listing (via IPFS hash), trustless payments, and basic dispute flags.
 */
contract EscrowXContract {
    // Enum for Escrow State
    enum EscrowState { AWAITING_PAYMENT, AWAITING_DELIVERY, COMPLETED, DISPUTED, REFUNDED }

    struct Service {
        uint256 id;
        address payable seller;
        string title;
        string description; // IPFS hash or short text
        uint256 price;      // In wei (MATIC/ETH)
        uint256 deliveryTime; // In seconds
        bool isActive;
    }

    struct Escrow {
        uint256 id;
        uint256 serviceId;
        address payable buyer;
        address payable seller;
        uint256 amount;
        uint256 createdAt;
        EscrowState state;
        bool buyerConfirmed;
        bool sellerDelivered;
    }

    // Storage
    uint256 public serviceCounter;
    uint256 public escrowCounter;

    mapping(uint256 => Service) public services;
    mapping(uint256 => Escrow) public escrows;
    mapping(address => uint256[]) public userServices; // Services created by a user
    mapping(address => uint256[]) public userEscrows;  // Escrows a user is part of (buyer or seller)

    // Events
    event ServiceCreated(uint256 indexed id, address indexed seller, string title, uint256 price);
    event EscrowCreated(uint256 indexed id, uint256 indexed serviceId, address indexed buyer, address seller, uint256 amount);
    event DeliveryConfirmed(uint256 indexed id, address indexed seller);
    event FundsReleased(uint256 indexed id, address indexed seller, uint256 amount);
    event DisputeRaised(uint256 indexed id, address indexed raisedBy);
    event Refunded(uint256 indexed id, address indexed buyer, uint256 amount);

    // Modifiers
    modifier onlyBuyer(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].buyer, "Only buyer can call this.");
        _;
    }

    modifier onlySeller(uint256 _escrowId) {
        require(msg.sender == escrows[_escrowId].seller, "Only seller can call this.");
        _;
    }

    modifier inState(uint256 _escrowId, EscrowState _state) {
        require(escrows[_escrowId].state == _state, "Invalid state.");
        _;
    }

    /**
     * @dev Create a new service listing.
     * @param _title Title of the service.
     * @param _description Description or IPFS hash.
     * @param _price Price in wei.
     * @param _deliveryTime Time to deliver in seconds.
     */
    function createService(
        string memory _title,
        string memory _description,
        uint256 _price,
        uint256 _deliveryTime
    ) external {
        require(_price > 0, "Price must be greater than 0");
        
        serviceCounter++;
        services[serviceCounter] = Service({
            id: serviceCounter,
            seller: payable(msg.sender),
            title: _title,
            description: _description,
            price: _price,
            deliveryTime: _deliveryTime,
            isActive: true
        });

        userServices[msg.sender].push(serviceCounter);
        emit ServiceCreated(serviceCounter, msg.sender, _title, _price);
    }

    /**
     * @dev Buyer initiates an escrow transaction for a service.
     * @param _serviceId The ID of the service to purchase.
     */
    function createEscrow(uint256 _serviceId) external payable {
        Service memory service = services[_serviceId];
        require(service.isActive, "Service is not active");
        require(msg.value == service.price, "Incorrect payment amount");
        require(msg.sender != service.seller, "Seller cannot buy own service");

        escrowCounter++;
        escrows[escrowCounter] = Escrow({
            id: escrowCounter,
            serviceId: _serviceId,
            buyer: payable(msg.sender),
            seller: service.seller,
            amount: msg.value,
            createdAt: block.timestamp,
            state: EscrowState.AWAITING_DELIVERY,
            buyerConfirmed: false,
            sellerDelivered: false
        });

        userEscrows[msg.sender].push(escrowCounter);
        userEscrows[service.seller].push(escrowCounter);

        emit EscrowCreated(escrowCounter, _serviceId, msg.sender, service.seller, msg.value);
    }

    /**
     * @dev Buyer confirms delivery and releases funds to the seller.
     *      No platform fee is taken (0% commission).
     * @param _escrowId The ID of the escrow.
     */
    function confirmDelivery(uint256 _escrowId) external onlyBuyer(_escrowId) inState(_escrowId, EscrowState.AWAITING_DELIVERY) {
        Escrow storage escrow = escrows[_escrowId];
        
        escrow.buyerConfirmed = true;
        escrow.state = EscrowState.COMPLETED;

        // Transfer funds to seller
        (bool success, ) = escrow.seller.call{value: escrow.amount}("");
        require(success, "Transfer failed.");

        emit FundsReleased(_escrowId, escrow.seller, escrow.amount);
    }

    /**
     * @dev Freelancer marks work as delivered (optional, for tracking).
     * @param _escrowId The ID of the escrow.
     */
    function markDelivered(uint256 _escrowId) external onlySeller(_escrowId) inState(_escrowId, EscrowState.AWAITING_DELIVERY) {
        Escrow storage escrow = escrows[_escrowId];
        escrow.sellerDelivered = true;
        emit DeliveryConfirmed(_escrowId, msg.sender);
    }

    /**
     * @dev Raises a dispute. Freezes funds until resolved (DAO/Admin needed for resolution logic).
     * @param _escrowId The ID of the escrow.
     */
    function raiseDispute(uint256 _escrowId) external inState(_escrowId, EscrowState.AWAITING_DELIVERY) {
        require(msg.sender == escrows[_escrowId].buyer || msg.sender == escrows[_escrowId].seller, "Only participants can dispute.");
        
        escrows[_escrowId].state = EscrowState.DISPUTED;
        emit DisputeRaised(_escrowId, msg.sender);
    }

    /**
     * @dev Refunds the buyer. Can be called by seller (voluntary refund) or via dispute resolution (simplified here).
     * @param _escrowId The ID of the escrow.
     */
    function refundBuyer(uint256 _escrowId) external onlySeller(_escrowId) inState(_escrowId, EscrowState.AWAITING_DELIVERY) {
         Escrow storage escrow = escrows[_escrowId];
         
         escrow.state = EscrowState.REFUNDED;
         
         (bool success, ) = escrow.buyer.call{value: escrow.amount}("");
         require(success, "Refund failed.");

         emit Refunded(_escrowId, escrow.buyer, escrow.amount);
    }
    
    // View Functions
    
    function getService(uint256 _id) external view returns (Service memory) {
        return services[_id];
    }
    
    function getEscrow(uint256 _id) external view returns (Escrow memory) {
        return escrows[_id];
    }
}
