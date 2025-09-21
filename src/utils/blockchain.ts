import { NETWORK_CONFIG, getContractAddress } from '../contracts/addresses'

interface EcoAction {
  type: string
  imageHash: string
  timestamp: number
  location?: {
    lat: number
    lng: number
  }
}

interface ValidationResult {
  isValid: boolean
  confidence: number
  actionType: string
  estimatedCarbonOffset: number
  tokensToEarn: number
}

export class BlockchainService {
  private isTestnet: boolean

  constructor(isTestnet = false) {
    this.isTestnet = isTestnet
  }

  async validateEcoAction(_imageData: string, selectedAction: string): Promise<ValidationResult> {
    // Simulate AI validation process
    console.log('Validating eco action with AI...', { selectedAction })
    
    // In production, this would call OpenAI Vision API
    const mockValidation = await this.mockAIValidation(_imageData, selectedAction)
    
    return mockValidation
  }

  private async mockAIValidation(_imageData: string, actionType: string): Promise<ValidationResult> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    const actionRewards = {
      '🚴 Bike Ride': { tokens: 50, carbon: 2000 },
      '♻️ Recycling': { tokens: 30, carbon: 1000 },
      '🌳 Tree Planting': { tokens: 100, carbon: 5000 },
      '🧹 Cleanup': { tokens: 80, carbon: 3000 },
      '🥬 Gardening': { tokens: 40, carbon: 1500 },
      '🌞 Solar Energy': { tokens: 60, carbon: 2500 },
    }
    
    const reward = actionRewards[actionType as keyof typeof actionRewards] || actionRewards['♻️ Recycling']
    
    // Simulate high confidence for demo
    return {
      isValid: true,
      confidence: 0.92,
      actionType,
      estimatedCarbonOffset: reward.carbon,
      tokensToEarn: reward.tokens
    }
  }

  async submitEcoAction(action: EcoAction, userAddress: string): Promise<{ success: boolean; txHash?: string; error?: string }> {
    try {
      console.log('Submitting eco action to blockchain...', action)

      // Create action hash for uniqueness
      const actionHash = this.createActionHash(action, userAddress)

      // Get contract address
      const coreAddress = getContractAddress('ECO_HUNT_CORE', this.isTestnet)

      console.log('📝 Transaction details:', {
        contract: coreAddress,
        action: this.mapActionTypeToContract(action.type),
        user: userAddress,
        hash: actionHash
      })

      // For now, simulate successful transaction
      // TODO: Implement actual contract call with useWriteContract hook
      const mockTxHash = '0x' + Math.random().toString(16).substr(2, 64)

      return {
        success: true,
        txHash: mockTxHash
      }
    } catch (error) {
      console.error('❌ Blockchain submission failed:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  private createActionHash(action: EcoAction, userAddress: string): `0x${string}` {
    const hashString = `${userAddress}-${action.type}-${action.timestamp}-${action.imageHash}`
    // Simple hash function for browser compatibility
    let hash = 0;
    for (let i = 0; i < hashString.length; i++) {
      const char = hashString.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    const hashHex = Math.abs(hash).toString(16).padStart(64, '0');
    return `0x${hashHex}` as `0x${string}`
  }

  private mapActionTypeToContract(displayType: string): string {
    const mapping: { [key: string]: string } = {
      '🚴 Bike Ride': 'bike_ride',
      '♻️ Recycling': 'recycling',
      '🌳 Tree Planting': 'tree_planting',
      '🧹 Cleanup': 'cleanup',
      '🥬 Gardening': 'gardening',
      '🌞 Solar Energy': 'solar_energy',
    }
    return mapping[displayType] || 'recycling'
  }

  async getUserStats(userAddress: string) {
    try {
      console.log('📊 Fetching user stats for:', userAddress)

      // For now, return mock data
      // TODO: Implement actual contract reads with useReadContract hooks
      return {
        totalTokens: 0,
        totalActions: 0,
        carbonSaved: 0,
        level: 0,
        nftCount: 0
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      return {
        totalTokens: 0,
        totalActions: 0,
        carbonSaved: 0,
        level: 0,
        nftCount: 0
      }
    }
  }

  async getTokenBalance(userAddress: string): Promise<number> {
    try {
      console.log('💰 Fetching token balance for:', userAddress)

      // For now, return mock balance
      // TODO: Implement actual balance read with useReadContract hook
      return 0
    } catch (error) {
      console.error('Error fetching token balance:', error)
      return 0
    }
  }


  getExplorerUrl(txHash: string): string {
    const config = this.isTestnet ? NETWORK_CONFIG.ZORA_TESTNET : NETWORK_CONFIG.ZORA_MAINNET
    return `${config.blockExplorer}/tx/${txHash}`
  }

  getNetworkConfig() {
    return this.isTestnet ? NETWORK_CONFIG.ZORA_TESTNET : NETWORK_CONFIG.ZORA_MAINNET
  }
}

export const blockchainService = new BlockchainService(false) // Default to mainnet