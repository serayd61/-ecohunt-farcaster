import { Coins, Award, TreePine, Recycle, Car, ExternalLink } from 'lucide-react'
import { farcasterSDK } from '../utils/farcaster'
import { useAccount } from 'wagmi'
import { useUserProfile, useTokenBalance, useUserNFTs } from '../hooks/useContracts'
import { WalletConnection } from '../components/WalletConnection'

export function Profile() {
  const user = farcasterSDK.getUser()
  const { address, isConnected } = useAccount()

  // Contract data hooks
  const { profile, isLoading: profileLoading } = useUserProfile(address)
  const { balanceFormatted, isLoading: balanceLoading } = useTokenBalance(address)
  const { nftCount, carbonOffsetFormatted, isLoading: nftLoading } = useUserNFTs(address)

  // Calculate level and progress
  const currentLevel = profile ? Number(profile.level) : 0
  const totalActions = profile ? Number(profile.totalActions) : 0
  const progressToNextLevel = totalActions > 0 ? ((totalActions % 10) / 10) * 100 : 0

  const userStats = {
    totalTokens: Math.round(balanceFormatted),
    totalActions,
    joinDate: 'March 2024',
    carbonSaved: `${(carbonOffsetFormatted / 1000).toFixed(1)} kg`,
    level: currentLevel === 0 ? 'Eco Starter' :
           currentLevel === 1 ? 'Eco Warrior' :
           currentLevel === 2 ? 'Green Guardian' :
           currentLevel >= 3 ? 'Planet Hero' : 'Eco Starter',
    nextLevel: currentLevel === 0 ? 'Eco Warrior' :
               currentLevel === 1 ? 'Green Guardian' :
               currentLevel === 2 ? 'Planet Hero' :
               'Planet Savior',
    progress: Math.round(progressToNextLevel)
  }

  const badges = [
    { emoji: '🚴', name: 'Bike Champion', description: '10 bike rides completed' },
    { emoji: '♻️', name: 'Recycle Hero', description: '5 recycling actions' },
    { emoji: '🌱', name: 'Green Starter', description: 'First eco action completed' },
    { emoji: '📸', name: 'Snapshot Ace', description: '20 photos validated' },
  ]

  const recentActions = [
    { date: '2 hours ago', action: '🚴 Bike to work', tokens: 50 },
    { date: 'Yesterday', action: '♻️ Plastic recycling', tokens: 30 },
    { date: '2 days ago', action: '🧹 Beach cleanup', tokens: 80 },
    { date: '3 days ago', action: '🌳 Tree planting', tokens: 100 },
  ]

  const impactStats = [
    { icon: TreePine, label: 'Trees Equivalent', value: Math.round(carbonOffsetFormatted / 22000).toString(), color: 'text-green-600' },
    { icon: Recycle, label: 'NFTs Earned', value: nftCount.toString(), color: 'text-blue-600' },
    { icon: Car, label: 'CO₂ Saved (g)', value: carbonOffsetFormatted.toString(), color: 'text-purple-600' },
  ]

  // Show loading state
  if (profileLoading || balanceLoading || nftLoading) {
    return (
      <div className="space-y-6">
        <div className="card">
          <div className="animate-pulse">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-16 h-16 bg-gray-300 rounded-full"></div>
              <div className="space-y-2">
                <div className="h-6 bg-gray-300 rounded w-32"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your profile...</p>
        </div>
      </div>
    )
  }

  // Show connect wallet message
  if (!isConnected) {
    return (
      <div className="space-y-6">
        <WalletConnection />
        <div className="card text-center py-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Connect Your Wallet</h2>
          <p className="text-gray-600 mb-4">
            Connect your wallet to view your EcoHunt profile and statistics.
          </p>
          <div className="text-4xl mb-4">🔒</div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="card">
        <div className="flex items-center space-x-4 mb-6">
          <div className="w-16 h-16 bg-eco rounded-full flex items-center justify-center overflow-hidden">
            {user?.pfpUrl ? (
              <img 
                src={user.pfpUrl} 
                alt={user.displayName}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-2xl text-white font-bold">🌱</span>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {user?.displayName || 'EcoWarrior'}
            </h1>
            <p className="text-gray-600">@{user?.username || 'eco_user'}</p>
            <p className="text-gray-600">{userStats.level}</p>
            <p className="text-sm text-gray-500">FID: {user?.fid || '12345'}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Progress to {userStats.nextLevel}</span>
              <span className="text-eco font-medium">{userStats.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-eco h-2 rounded-full transition-all duration-300"
                style={{ width: `${userStats.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <WalletConnection />

      <div className="grid grid-cols-2 gap-4">
        <div className="card text-center">
          <Coins className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <p className="text-2xl font-bold text-gray-900">{userStats.totalTokens}</p>
          <p className="text-sm text-gray-600">$GREEN Tokens</p>
        </div>
        <div className="card text-center">
          <Award className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <p className="text-2xl font-bold text-gray-900">{userStats.totalActions}</p>
          <p className="text-sm text-gray-600">Eco Actions</p>
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Environmental Impact</h2>
        <div className="grid grid-cols-3 gap-4">
          {impactStats.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="text-center">
              <Icon className={`w-6 h-6 mx-auto mb-2 ${color}`} />
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-600">{label}</p>
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg text-center">
          <p className="text-sm text-green-800">
            🌍 You've saved <strong>{userStats.carbonSaved}</strong> of CO₂ emissions!
          </p>
          {address && (
            <div className="mt-2 flex items-center justify-center space-x-2">
              <span className="text-xs text-gray-600">Wallet:</span>
              <a
                href={`https://explorer.zora.energy/address/${address}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-1 text-xs text-blue-600 hover:text-blue-800"
              >
                <span className="font-mono">{address.slice(0, 6)}...{address.slice(-4)}</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          )}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Earned Badges</h2>
        <div className="grid grid-cols-2 gap-3">
          {badges.map((badge) => (
            <div key={badge.name} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <span className="text-2xl">{badge.emoji}</span>
              <div>
                <p className="font-medium text-gray-900">{badge.name}</p>
                <p className="text-xs text-gray-600">{badge.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Recent Actions</h2>
        <div className="space-y-3">
          {recentActions.map((action, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">{action.action}</p>
                <p className="text-sm text-gray-600">{action.date}</p>
              </div>
              <div className="text-right">
                <p className="font-semibold text-eco">+{action.tokens}</p>
                <p className="text-xs text-gray-600">$GREEN</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}