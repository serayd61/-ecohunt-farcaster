# 🚀 EcoHunt Smart Contract Deployment Guide

## 📋 Remix Deployment Adımları

### 1️⃣ **Remix'te Dosyaları Hazırla**
```
1. remix.ethereum.org'a git
2. File Explorer'da yeni klasör oluştur: "EcoHunt"
3. Bu 3 dosyayı kopyala:
   - remix-contracts/GreenToken.sol
   - remix-contracts/EcoNFT.sol  
   - remix-contracts/EcoHuntCore.sol
```

### 2️⃣ **Zora Network Ayarları**
```
Network Name: Zora
RPC URL: https://rpc.zora.energy
Chain ID: 7777777
Currency Symbol: ETH
Block Explorer: https://explorer.zora.energy
```

### 3️⃣ **Deploy Sırası (ÖNEMLİ!)**

#### **A) GreenToken Deploy Et**
```solidity
Constructor: (parametre yok)
```
✅ Deploy sonrası contract address'ini kaydet!

#### **B) EcoNFT Deploy Et**  
```solidity
Constructor: (parametre yok)
```
✅ Deploy sonrası contract address'ini kaydet!

#### **C) EcoHuntCore Deploy Et**
```solidity
Constructor Parameters:
- _greenToken: [GreenToken contract address]
- _ecoNFT: [EcoNFT contract address]
```

### 4️⃣ **Permissions Ayarla**

#### **GreenToken'da:**
```solidity
// EcoHuntCore'u validator yap
addValidator("[EcoHuntCore contract address]")
```

#### **EcoNFT'de:**
```solidity
// EcoHuntCore'a ownership ver
transferOwnership("[EcoHuntCore contract address]")
```

### 5️⃣ **Frontend'e Adresleri Ekle**

`src/contracts/addresses.ts` dosyasında güncelle:
```typescript
ZORA_MAINNET: {
  GREEN_TOKEN: '0x[GreenToken address]',
  ECO_NFT: '0x[EcoNFT address]',
  ECO_HUNT_CORE: '0x[EcoHuntCore address]',
}
```

## 🎯 **Test Fonksiyonları**

### **Token Test:**
```solidity
greenToken.balanceOf(userAddress)
greenToken.getUserEcoActions(userAddress)
```

### **NFT Test:**
```solidity
ecoNFT.getUserNFTs(userAddress)
ecoNFT.getUserCarbonOffset(userAddress)
```

### **Core Test:**
```solidity
ecoHuntCore.getUserProfile(userAddress)
ecoHuntCore.completeEcoAction(user, "bike_ride", hash, "image123")
```

## 💰 **Ödül Sistemi**

| Aktivite | Reward | Carbon Offset |
|----------|--------|---------------|
| 🚴 Bike Ride | 50 GREEN | 2kg CO₂ |
| ♻️ Recycling | 30 GREEN | 1kg CO₂ |
| 🌳 Tree Planting | 100 GREEN | 5kg CO₂ |
| 🧹 Cleanup | 80 GREEN | 3kg CO₂ |
| 🥬 Gardening | 40 GREEN | 1.5kg CO₂ |
| 🌞 Solar Energy | 60 GREEN | 2.5kg CO₂ |

## 🔗 **Entegrasyon**

Deploy sonrası:
1. Contract adreslerini frontend'e ekle
2. Blockchain service'i gerçek contract'larla güncelle
3. MetaMask'ta Zora network ekle
4. Test kullanıcılarla ödül sistemi dene

## 🎉 **Sonuç**

Tüm kontratlar deploy edilince EcoHunt:
- ✅ Gerçek $GREEN token ekonomisi
- ✅ NFT carbon offset sertifikaları  
- ✅ Level-up ve milestone sistemi
- ✅ Farcaster sosyal entegrasyonu

**Toplam 3 contract deploy et, permission'ları ayarla, frontend'e entegre et!**