import { sdk } from '@farcaster/miniapp-sdk'

interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl?: string
}

export const farcasterSDK = {
  isReady: false,
  user: null as FarcasterUser | null,

  async initialize() {
    try {
      // Get user context from SDK (ready() is called in main.tsx)
      const context = await sdk.context
      this.isReady = true
      
      if (context?.user) {
        this.user = {
          fid: context.user.fid,
          username: context.user.username || 'eco_user',
          displayName: context.user.displayName || 'Eco Warrior',
          pfpUrl: context.user.pfpUrl
        }
      } else {
        // Mock user for development
        this.user = {
          fid: 12345,
          username: 'ecowarrior_23',
          displayName: 'Eco Warrior',
          pfpUrl: undefined
        }
      }
      
      console.log('✅ Farcaster context loaded', { 
        user: this.user,
        context 
      })
    } catch (error) {
      console.error('❌ Failed to get Farcaster context:', error)
      // Fallback for development
      this.isReady = true
      this.user = {
        fid: 12345,
        username: 'ecowarrior_23',
        displayName: 'Eco Warrior',
        pfpUrl: undefined
      }
    }
  },

  isAuthenticated(): boolean {
    return this.isReady && this.user !== null
  },

  getUser(): FarcasterUser | null {
    return this.user
  },

  async shareEcoAction(activityType: string, tokensEarned: number) {
    const text = `🌱 Just completed "${activityType}" on EcoHunt and earned ${tokensEarned} $GREEN tokens! Join me in making the world greener! 🌍`
    
    try {
      // Use official SDK cast composition method
      await sdk.actions.composeCast({
        text,
        embeds: ['https://ecohunt-farcaster.vercel.app']
      })
    } catch (error) {
      console.log('Sharing via SDK failed, using fallback:', error)
      // Fallback for web
      if (navigator.share) {
        navigator.share({
          title: 'EcoHunt Action Completed!',
          text,
          url: 'https://ecohunt-farcaster.vercel.app'
        })
      }
    }
  },

  async sendNotification(message: string) {
    // Notifications are handled server-side in Farcaster Mini Apps
    console.log('Notification would be sent server-side:', message)
    // In production, this would trigger a server-side notification
  },

  async openUrl(url: string) {
    try {
      await sdk.actions.openUrl(url)
    } catch (error) {
      console.log('Open URL failed, using fallback:', error)
      window.open(url, '_blank')
    }
  },

  async close() {
    try {
      await sdk.actions.close()
    } catch (error) {
      console.log('Close failed:', error)
    }
  }
}

export type { FarcasterUser }