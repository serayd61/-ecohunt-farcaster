import { Crown, Medal, Trophy, TrendingUp } from 'lucide-react'

export function Leaderboard() {
  const leaderboardData = [
    { rank: 1, username: 'EcoMaster_99', tokens: 3247, actions: 89, avatar: '🏆' },
    { rank: 2, username: 'GreenHero_42', tokens: 2981, actions: 76, avatar: '🥈' },
    { rank: 3, username: 'NatureLover', tokens: 2654, actions: 71, avatar: '🥉' },
    { rank: 4, username: 'CleanEarth', tokens: 2103, actions: 58, avatar: '🌱' },
    { rank: 5, username: 'EcoWarrior', tokens: 1876, actions: 52, avatar: '♻️' },
    { rank: 6, username: 'BikeChamp', tokens: 1654, actions: 45, avatar: '🚴' },
    { rank: 7, username: 'TreeHugger', tokens: 1432, actions: 39, avatar: '🌳' },
    { rank: 8, username: 'You', tokens: 1247, actions: 23, avatar: '🌱', isCurrentUser: true },
  ]

  const challenges = [
    { title: 'Weekly Bike Challenge', description: 'Bike 50 miles this week', reward: '200 $GREEN', participants: 847, timeLeft: '3 days' },
    { title: 'Plastic-Free Monday', description: 'No plastic usage for a day', reward: '150 $GREEN', participants: 1203, timeLeft: '2 days' },
    { title: 'Community Cleanup', description: 'Join local cleanup event', reward: '300 $GREEN', participants: 234, timeLeft: '5 days' },
  ]

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1: return <Crown className="w-5 h-5 text-yellow-500" />
      case 2: return <Medal className="w-5 h-5 text-gray-400" />
      case 3: return <Trophy className="w-5 h-5 text-amber-600" />
      default: return <span className="text-sm font-bold text-gray-600">#{rank}</span>
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">🏆 Global Leaderboard</h1>
        <p className="text-gray-600">Compete with eco-warriors worldwide!</p>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 flex items-center space-x-2">
          <TrendingUp className="w-5 h-5 text-eco" />
          <span>Top Eco Warriors</span>
        </h2>
        
        <div className="space-y-2">
          {leaderboardData.map((user) => (
            <div 
              key={user.rank} 
              className={`flex items-center justify-between p-3 rounded-lg transition-colors ${
                user.isCurrentUser 
                  ? 'bg-eco-light border-2 border-eco' 
                  : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8">
                  {getRankIcon(user.rank)}
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{user.avatar}</span>
                  <div>
                    <p className={`font-medium ${user.isCurrentUser ? 'text-eco-dark' : 'text-gray-900'}`}>
                      {user.username}
                      {user.isCurrentUser && <span className="ml-2 text-xs bg-eco text-white px-2 py-1 rounded-full">You</span>}
                    </p>
                    <p className="text-sm text-gray-600">{user.actions} eco actions</p>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-eco text-lg">{user.tokens.toLocaleString()}</p>
                <p className="text-xs text-gray-600">$GREEN</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4 text-gray-900">🎯 Active Challenges</h2>
        <div className="space-y-4">
          {challenges.map((challenge, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                  <p className="text-sm text-gray-600 mt-1">{challenge.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-eco">{challenge.reward}</p>
                  <p className="text-xs text-gray-600">reward</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between text-sm text-gray-600 mt-3">
                <span>{challenge.participants.toLocaleString()} participants</span>
                <span>{challenge.timeLeft} left</span>
              </div>
              
              <button className="w-full mt-3 btn-eco text-sm">
                Join Challenge
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="card bg-gradient-to-r from-green-400 to-emerald-500 text-white">
        <div className="text-center">
          <h3 className="text-xl font-bold mb-2">🌟 Your Rank: #156</h3>
          <p className="text-green-100 mb-4">
            You're in the top 5% of eco-warriors globally!
          </p>
          <p className="text-sm text-green-100">
            Complete 5 more actions to reach the top 100!
          </p>
        </div>
      </div>
    </div>
  )
}