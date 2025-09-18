interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl?: string
}

interface FarcasterSDK {
  user?: FarcasterUser
  isAuthenticated: boolean
  actions: {
    openUrl: (url: string) => void
    share: (text: string, embeds?: string[]) => void
    sendNotification: (message: string) => void
    close: () => void
  }
  ready: () => Promise<void>
}

declare global {
  interface Window {
    fc?: FarcasterSDK
  }
}

export const farcasterSDK = {
  isReady: false,
  user: null as FarcasterUser | null,

  async initialize() {
    if (typeof window === 'undefined') return
    
    try {
      if (window.fc) {
        await window.fc.ready()
        this.isReady = true
        this.user = window.fc.user || null
        console.log('Farcaster SDK initialized', { user: this.user })
      } else {
        console.log('Running outside Farcaster client - mock mode')
        this.isReady = true
        this.user = {
          fid: 12345,
          username: 'ecowarrior_23',
          displayName: 'Eco Warrior',
          pfpUrl: undefined
        }
      }
    } catch (error) {
      console.error('Failed to initialize Farcaster SDK:', error)
    }
  },

  isAuthenticated(): boolean {
    return this.isReady && this.user !== null
  },

  getUser(): FarcasterUser | null {
    return this.user
  },

  shareEcoAction(activityType: string, tokensEarned: number) {
    const text = `🌱 Just completed "${activityType}" on EcoHunt and earned ${tokensEarned} $GREEN tokens! Join me in making the world greener! 🌍`
    
    if (window.fc?.actions.share) {
      window.fc.actions.share(text, ['https://ecohunt.vercel.app'])
    } else {
      // Fallback for web
      if (navigator.share) {
        navigator.share({
          title: 'EcoHunt Action Completed!',
          text,
          url: 'https://ecohunt.vercel.app'
        })
      }
    }
  },

  sendNotification(message: string) {
    if (window.fc?.actions.sendNotification) {
      window.fc.actions.sendNotification(message)
    }
  },

  openUrl(url: string) {
    if (window.fc?.actions.openUrl) {
      window.fc.actions.openUrl(url)
    } else {
      window.open(url, '_blank')
    }
  },

  close() {
    if (window.fc?.actions.close) {
      window.fc.actions.close()
    }
  }
}

export type { FarcasterUser }