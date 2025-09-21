import { useWriteContract, useReadContract, useWaitForTransactionReceipt } from 'wagmi'
import { ECO_HUNT_CORE_ABI, GREEN_TOKEN_ABI, ECO_NFT_ABI } from '../contracts/abis'
import { getContractAddress } from '../contracts/addresses'
import { useState } from 'react'

const isTestnet = false // Using mainnet

// Contract addresses
const ECO_HUNT_CORE_ADDRESS = getContractAddress('ECO_HUNT_CORE', isTestnet) as `0x${string}`
const GREEN_TOKEN_ADDRESS = getContractAddress('GREEN_TOKEN', isTestnet) as `0x${string}`
const ECO_NFT_ADDRESS = getContractAddress('ECO_NFT', isTestnet) as `0x${string}`

export function useEcoHuntCore() {
  const { writeContract, data: hash, isPending, error } = useWriteContract()
  const [actionHash, setActionHash] = useState<`0x${string}` | null>(null)

  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    })

  const completeEcoAction = async (
    userAddress: string,
    actionType: string,
    imageHash: string
  ) => {
    // Create unique action hash
    const hashString = `${userAddress}-${actionType}-${Date.now()}-${imageHash}`
    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
      const char = hashString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    const generatedHash = `0x${Math.abs(hash).toString(16).padStart(64, '0')}` as `0x${string}`
    setActionHash(generatedHash)

    writeContract({
      address: ECO_HUNT_CORE_ADDRESS,
      abi: ECO_HUNT_CORE_ABI,
      functionName: 'completeEcoAction',
      args: [
        userAddress as `0x${string}`,
        actionType,
        generatedHash,
        imageHash
      ]
    })
  }

  return {
    completeEcoAction,
    hash,
    actionHash,
    isPending,
    isConfirming,
    isConfirmed,
    error
  }
}

export function useUserProfile(userAddress?: string) {
  const { data: profile, isLoading, error } = useReadContract({
    address: ECO_HUNT_CORE_ADDRESS,
    abi: ECO_HUNT_CORE_ABI,
    functionName: 'getUserProfile',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && ECO_HUNT_CORE_ADDRESS !== '0x...',
    }
  })

  // Return mock data if contract not available
  const mockProfile = {
    totalActions: BigInt(8),
    totalTokensEarned: BigInt(340),
    level: BigInt(1),
    carbonSaved: BigInt(2400),
    username: 'eco_warrior'
  }

  return {
    profile: (profile || (userAddress ? mockProfile : undefined)) as {
      totalActions: bigint
      totalTokensEarned: bigint
      level: bigint
      carbonSaved: bigint
      username: string
    } | undefined,
    isLoading: ECO_HUNT_CORE_ADDRESS === '0x...' ? false : isLoading,
    error: ECO_HUNT_CORE_ADDRESS === '0x...' ? null : error
  }
}

export function useTokenBalance(userAddress?: string) {
  const { data: balance, isLoading, error } = useReadContract({
    address: GREEN_TOKEN_ADDRESS,
    abi: GREEN_TOKEN_ABI,
    functionName: 'balanceOf',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && GREEN_TOKEN_ADDRESS !== '0x...',
    }
  })

  // Mock balance if contract not available
  const mockBalance = BigInt(Math.floor(Math.random() * 500 + 50) * 1e18)

  return {
    balance: (balance || (userAddress ? mockBalance : undefined)) as bigint | undefined,
    balanceFormatted: balance ? Number(balance) / 1e18 : (userAddress ? Number(mockBalance) / 1e18 : 0),
    isLoading: GREEN_TOKEN_ADDRESS === '0x...' ? false : isLoading,
    error: GREEN_TOKEN_ADDRESS === '0x...' ? null : error
  }
}

export function useUserNFTs(userAddress?: string) {
  const { data: nfts, isLoading, error } = useReadContract({
    address: ECO_NFT_ADDRESS,
    abi: ECO_NFT_ABI,
    functionName: 'getUserNFTs',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && ECO_NFT_ADDRESS !== '0x...',
    }
  })

  const { data: carbonOffset, isLoading: carbonLoading } = useReadContract({
    address: ECO_NFT_ADDRESS,
    abi: ECO_NFT_ABI,
    functionName: 'getUserCarbonOffset',
    args: userAddress ? [userAddress as `0x${string}`] : undefined,
    query: {
      enabled: !!userAddress && ECO_NFT_ADDRESS !== '0x...',
    }
  })

  // Mock data if contracts not available
  const mockNfts = userAddress ? [BigInt(1), BigInt(2), BigInt(3)] : []
  const mockCarbonOffset = BigInt(Math.floor(Math.random() * 5000 + 1000))

  return {
    nfts: (nfts || mockNfts) as bigint[] | undefined,
    nftCount: nfts ? nfts.length : (userAddress ? mockNfts.length : 0),
    carbonOffset: (carbonOffset || (userAddress ? mockCarbonOffset : undefined)) as bigint | undefined,
    carbonOffsetFormatted: carbonOffset ? Number(carbonOffset) : (userAddress ? Number(mockCarbonOffset) : 0),
    isLoading: ECO_NFT_ADDRESS === '0x...' ? false : (isLoading || carbonLoading),
    error: ECO_NFT_ADDRESS === '0x...' ? null : error
  }
}

export function useActionTypes() {
  const { data: actionTypes, isLoading, error } = useReadContract({
    address: ECO_HUNT_CORE_ADDRESS,
    abi: ECO_HUNT_CORE_ABI,
    functionName: 'getAllActionTypes',
  })

  return {
    actionTypes: actionTypes as string[] | undefined,
    isLoading,
    error
  }
}