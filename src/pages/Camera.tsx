import { useState, useRef } from 'react'
import { Camera as CameraIcon, Upload, Check, X, Share2 } from 'lucide-react'
import { farcasterSDK } from '../utils/farcaster'

export function Camera() {
  const [isCapturing, setIsCapturing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const activities = [
    '🚴 Bike Ride',
    '♻️ Recycling',
    '🌳 Tree Planting',
    '🧹 Cleanup',
    '🥬 Gardening',
    '🌞 Solar Energy',
  ]

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleValidation = async () => {
    if (!capturedImage || !selectedActivity) return
    
    setIsValidating(true)
    
    setTimeout(() => {
      setIsValidating(false)
      const tokensEarned = 50
      
      // Share to Farcaster if available
      farcasterSDK.shareEcoAction(selectedActivity, tokensEarned)
      
      alert('🎉 Eco Action Verified! +50 $GREEN tokens earned!')
      setCapturedImage(null)
      setSelectedActivity('')
    }, 2000)
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-gray-900">Capture Eco Action 📸</h1>
        <p className="text-gray-600">
          Take a photo of your eco-friendly activity to earn $GREEN tokens!
        </p>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Select Activity Type</h3>
        <div className="grid grid-cols-2 gap-2">
          {activities.map((activity) => (
            <button
              key={activity}
              onClick={() => setSelectedActivity(activity)}
              className={`p-3 rounded-lg border-2 transition-colors ${
                selectedActivity === activity
                  ? 'border-eco bg-green-50 text-eco-dark'
                  : 'border-gray-200 hover:border-eco'
              }`}
            >
              {activity}
            </button>
          ))}
        </div>
      </div>

      <div className="card">
        <h3 className="text-lg font-semibold mb-3 text-gray-900">Capture Photo</h3>
        
        {!capturedImage ? (
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <CameraIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 mb-4">Take a photo of your eco action</p>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileUpload}
                className="hidden"
              />
              
              <button
                onClick={() => fileInputRef.current?.click()}
                className="btn-eco inline-flex items-center space-x-2"
              >
                <Upload className="w-4 h-4" />
                <span>Upload Photo</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative">
              <img
                src={capturedImage}
                alt="Captured eco action"
                className="w-full rounded-lg"
              />
              <button
                onClick={() => setCapturedImage(null)}
                className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            {selectedActivity && (
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Selected Activity:</p>
                <p className="font-semibold text-eco-dark">{selectedActivity}</p>
              </div>
            )}
            
            <button
              onClick={handleValidation}
              disabled={!selectedActivity || isValidating}
              className="w-full btn-eco disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isValidating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Validating with AI...</span>
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  <span>Validate & Earn $GREEN</span>
                </>
              )}
            </button>
          </div>
        )}
      </div>

      <div className="card bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold mb-2 text-blue-900">Pro Tips 💡</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Make sure your activity is clearly visible in the photo</li>
          <li>• Good lighting helps AI validation</li>
          <li>• Include yourself in the photo when possible</li>
          <li>• Authentic actions earn more tokens</li>
        </ul>
      </div>
    </div>
  )
}