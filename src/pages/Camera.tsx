import { useState, useRef, useEffect } from 'react'
import { Camera as CameraIcon, Upload, Check, X, ExternalLink } from 'lucide-react'
import { farcasterSDK } from '../utils/farcaster'
import { blockchainService } from '../utils/blockchain'
import { useAccount } from 'wagmi'
import { useEcoHuntCore } from '../hooks/useContracts'

export function Camera() {
  const { address, isConnected } = useAccount()
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const [selectedActivity, setSelectedActivity] = useState('')
  const [isValidating, setIsValidating] = useState(false)
  const [validationResult, setValidationResult] = useState<any>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const {
    completeEcoAction,
    hash,
    isPending,
    isConfirming,
    isConfirmed,
    error: contractError
  } = useEcoHuntCore()

  const activities = [
    '🚴 Bike Ride',
    '♻️ Recycling',
    '🌳 Tree Planting',
    '🧹 Cleanup',
    '🥬 Gardening',
    '🌞 Solar Energy',
  ]

  const actionTypeMapping: { [key: string]: string } = {
    '🚴 Bike Ride': 'bike_ride',
    '♻️ Recycling': 'recycling',
    '🌳 Tree Planting': 'tree_planting',
    '🧹 Cleanup': 'cleanup',
    '🥬 Gardening': 'gardening',
    '🌞 Solar Energy': 'solar_energy',
  }

  // Handle successful transaction
  useEffect(() => {
    if (isConfirmed && hash) {
      // Share to Farcaster
      farcasterSDK.shareEcoAction(selectedActivity, validationResult?.tokensToEarn || 0)

      alert(`🎉 Eco Action Verified! +${validationResult?.tokensToEarn || 0} $GREEN tokens earned!
      \nTransaction: ${hash}`)

      // Reset form after success
      setTimeout(() => {
        setCapturedImage(null)
        setSelectedActivity('')
        setValidationResult(null)
      }, 2000)
    }
  }, [isConfirmed, hash, selectedActivity, validationResult])

  // Handle contract errors
  useEffect(() => {
    if (contractError) {
      console.error('Contract error:', contractError)
      alert(`❌ Transaction failed: ${contractError.message}`)
    }
  }, [contractError])

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
    setValidationResult(null)
    
    try {
      const result = await blockchainService.validateEcoAction(capturedImage, selectedActivity)
      setValidationResult(result)
      setIsValidating(false)
    } catch (error) {
      setIsValidating(false)
      alert('❌ Validation failed. Please try again.')
    }
  }

  const handleSubmitToBlockchain = async () => {
    if (!validationResult || !capturedImage) return

    if (!isConnected || !address) {
      alert('❌ Please connect your wallet first!')
      return
    }

    try {
      const imageHash = 'ipfs_hash_' + Date.now() // In production, upload to IPFS
      const contractActionType = actionTypeMapping[selectedActivity] || 'recycling'

      await completeEcoAction(address, contractActionType, imageHash)

      // Transaction handling is done in useEffect
    } catch (error) {
      console.error('Blockchain submission error:', error)
      alert('❌ Blockchain submission failed. Make sure you have ETH for gas fees and try again.')
    }
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
            
            {!validationResult ? (
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
            ) : (
              <div className="space-y-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h3 className="font-semibold text-green-800 mb-2">✅ Validation Successful!</h3>
                  <div className="space-y-2 text-sm">
                    <p><strong>Activity:</strong> {validationResult.actionType}</p>
                    <p><strong>Confidence:</strong> {Math.round(validationResult.confidence * 100)}%</p>
                    <p><strong>Tokens to Earn:</strong> {validationResult.tokensToEarn} $GREEN</p>
                    <p><strong>Carbon Offset:</strong> {validationResult.estimatedCarbonOffset}g CO₂</p>
                  </div>
                </div>
                
                <button
                  onClick={handleSubmitToBlockchain}
                  disabled={!isConnected || isPending || isConfirming}
                  className="w-full btn-eco flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isPending || isConfirming ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>
                        {isPending ? 'Confirm in Wallet...' : 'Confirming Transaction...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>{isConnected ? 'Claim Rewards' : 'Connect Wallet to Claim'}</span>
                    </>
                  )}
                </button>

                {hash && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-blue-800">
                        Transaction Hash:
                      </span>
                      <a
                        href={`https://explorer.zora.energy/tx/${hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-blue-600 hover:text-blue-800"
                      >
                        <span className="text-sm font-mono">{hash.slice(0, 10)}...{hash.slice(-8)}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="mt-2 text-xs text-blue-600">
                      {isConfirming ? '⏳ Confirming...' : isConfirmed ? '✅ Confirmed!' : '📤 Pending...'}
                    </div>
                  </div>
                )}
              </div>
            )}
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