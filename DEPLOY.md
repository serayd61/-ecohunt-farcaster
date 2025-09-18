# 🚀 EcoHunt Deployment Guide

## 📱 Frontend Deploy (Vercel)

### 1. Manual Vercel Deploy
- Git: https://vercel.com/new
- Select: `serayd61/-ecohunt-farcaster`
- Framework: Vite (auto-detect)
- Deploy!

### 2. Environment Variables (Vercel Dashboard)
```env
VITE_APP_URL=https://ecohunt-farcaster.vercel.app
VITE_FARCASTER_APP_ID=ecohunt-miniapp
VITE_NETWORK_NAME=zora
VITE_CHAIN_ID=7777777
VITE_IS_TESTNET=false
```

## ⛓️ Smart Contract Deploy (Later)

### Prerequisites
1. Get Zora ETH from bridge or faucet
2. Add private key to `.env`:
```env
PRIVATE_KEY=your_wallet_private_key_here
```

### Deploy Commands
```bash
# Compile contracts
npm run compile

# Deploy to Zora mainnet
npm run deploy:zora

# Or deploy to testnet first
npm run deploy:testnet
```

## 📲 Farcaster Mini App Setup

### 1. Test Your App
- Deploy URL: `https://ecohunt-farcaster.vercel.app`
- Open in Farcaster client
- Test mini app functionality

### 2. Submit to Farcaster Directory
- Go to: https://warpcast.com/developers
- Submit mini app for review
- Provide:
  - App URL
  - Description: "Gamified environmental action platform"
  - Category: Lifestyle/Utilities

### 3. Features Working
✅ Photo capture and validation
✅ Mock blockchain integration  
✅ Farcaster social sharing
✅ Token rewards system
✅ Leaderboard and profiles
✅ Responsive mobile design

## 🔗 Integration Checklist

- [ ] Vercel deploy successful
- [ ] Farcaster meta tags working
- [ ] Mini app loads in Farcaster
- [ ] Photo upload functional
- [ ] Social sharing works
- [ ] Deploy smart contracts (optional for MVP)
- [ ] Connect real blockchain (future)
- [ ] Submit to Farcaster directory

## 🌱 MVP vs Full Version

**MVP (Current)**: Mock blockchain, full UI, Farcaster integration
**Full**: Real contracts, AI validation, token trading

Start with MVP deploy, then add blockchain later!