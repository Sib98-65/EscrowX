import EscrowXABI from './abi.json';

export const ESCROWX_CONTRACT_ADDRESS = '0x1234567890123456789012345678901234567890'; // Replace with deployed address

export const escrowXContractConfig = {
    address: ESCROWX_CONTRACT_ADDRESS as `0x${string}`,
    abi: EscrowXABI,
} as const;
