import { Camera, Coins, Award, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useAccount } from 'wagmi'
import { useUserProfile, useTokenBalance, useUserNFTs } from '../hooks/useContracts'

export function Home() {
  const { address, isConnected } = useAccount()
  const { profile, isLoading: profileLoading } = useUserProfile(address)
  const { balanceFormatted, isLoading: balanceLoading } = useTokenBalance(address)
  const { nftCount } = useUserNFTs(address)

  const stats = [
    {
      icon: Coins,
      label: '$GREEN Earned',
      value: isConnected ? (balanceLoading ? '...' : Math.round(balanceFormatted).toLocaleString()) : '0',
      color: 'text-green-600'
    },
    {
      icon: Award,
      label: 'Eco Actions',
      value: isConnected ? (profileLoading ? '...' : (profile ? Number(profile.totalActions) : 0).toString()) : '0',
      color: 'text-blue-600'
    },
    {
      icon: Users,
      label: 'NFTs Earned',
      value: isConnected ? nftCount.toString() : '0',
      color: 'text-purple-600'
    },
  ]

  const activities = [
    { emoji: '🚴', name: 'Bike Ride', reward: '50 $GREEN', difficulty: 'Easy' },
    { emoji: '♻️', name: 'Recycling', reward: '30 $GREEN', difficulty: 'Easy' },
    { emoji: '🌳', name: 'Tree Planting', reward: '100 $GREEN', difficulty: 'Medium' },
    { emoji: '🧹', name: 'Beach Cleanup', reward: '80 $GREEN', difficulty: 'Medium' },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to EcoHunt! 🌱</h1>
        <p className="text-gray-600 max-w-md mx-auto">
          Earn $GREEN tokens by completing eco-friendly activities. Every action counts toward a sustainable future!
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {stats.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card text-center">
            <Icon className={`w-8 h-8 mx-auto mb-2 ${color}`} />
            <p className="text-2xl font-bold text-gray-900">{value}</p>
            <p className="text-sm text-gray-600">{label}</p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">Today's Eco Activities</h2>
        <div className="space-y-3">
          {activities.map((activity) => (
            <div key={activity.name} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="text-2xl">{activity.emoji}</span>
                <div>
                  <p className="font-medium text-gray-900">{activity.name}</p>
                  <p className="text-sm text-gray-600">{activity.difficulty} • {activity.reward}</p>
                </div>
              </div>
              <Link
                to="/camera"
                className="btn-eco text-sm"
              >
                Start
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="text-center">
        <Link
          to="/camera"
          className="inline-flex items-center space-x-2 btn-eco text-lg px-8 py-3"
        >
          <Camera className="w-5 h-5" />
          <span>Start Eco Action</span>
        </Link>
      </div>
    </div>
  )
}