export const GREEN_TOKEN_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "string", "name": "actionType", "type": "string" },
      { "internalType": "uint256", "name": "reward", "type": "uint256" },
      { "internalType": "bytes32", "name": "actionHash", "type": "bytes32" }
    ],
    "name": "rewardEcoAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserEcoActions",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ECO_NFT_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "to", "type": "address" },
      { "internalType": "string", "name": "actionType", "type": "string" },
      { "internalType": "uint256", "name": "carbonOffset", "type": "uint256" },
      { "internalType": "string", "name": "imageHash", "type": "string" },
      { "internalType": "string", "name": "tokenURI", "type": "string" }
    ],
    "name": "mintEcoNFT",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserNFTs",
    "outputs": [{ "internalType": "uint256[]", "name": "", "type": "uint256[]" }],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserCarbonOffset",
    "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;

export const ECO_HUNT_CORE_ABI = [
  {
    "inputs": [
      { "internalType": "address", "name": "user", "type": "address" },
      { "internalType": "string", "name": "actionType", "type": "string" },
      { "internalType": "bytes32", "name": "actionHash", "type": "bytes32" },
      { "internalType": "string", "name": "imageHash", "type": "string" }
    ],
    "name": "completeEcoAction",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{ "internalType": "address", "name": "user", "type": "address" }],
    "name": "getUserProfile",
    "outputs": [
      {
        "components": [
          { "internalType": "uint256", "name": "totalActions", "type": "uint256" },
          { "internalType": "uint256", "name": "totalTokensEarned", "type": "uint256" },
          { "internalType": "uint256", "name": "level", "type": "uint256" },
          { "internalType": "uint256", "name": "carbonSaved", "type": "uint256" },
          { "internalType": "string", "name": "username", "type": "string" }
        ],
        "internalType": "struct EcoHuntCore.UserProfile",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAllActionTypes",
    "outputs": [{ "internalType": "string[]", "name": "", "type": "string[]" }],
    "stateMutability": "view",
    "type": "function"
  }
] as const;