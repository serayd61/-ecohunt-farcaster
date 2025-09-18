// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./GreenToken.sol";
import "./EcoNFT.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract EcoHuntCore is Ownable, ReentrancyGuard {
    
    GreenToken public greenToken;
    EcoNFT public ecoNFT;
    
    struct EcoAction {
        string actionType;
        uint256 baseReward;
        uint256 carbonOffset;
        bool active;
    }
    
    struct UserProfile {
        uint256 totalActions;
        uint256 totalTokensEarned;
        uint256 level;
        uint256 carbonSaved;
        string username;
    }
    
    mapping(string => EcoAction) public ecoActions;
    mapping(address => UserProfile) public userProfiles;
    mapping(address => mapping(string => uint256)) public userActionCounts;
    
    string[] public actionTypes;
    
    event ActionCompleted(
        address indexed user, 
        string actionType, 
        uint256 tokensEarned, 
        uint256 carbonOffset
    );
    event LevelUp(address indexed user, uint256 newLevel);
    event NFTMilestone(address indexed user, uint256 tokenId);
    
    constructor(
        address _greenToken,
        address _ecoNFT,
        address initialOwner
    ) Ownable(initialOwner) {
        greenToken = GreenToken(_greenToken);
        ecoNFT = EcoNFT(_ecoNFT);
        
        // Initialize eco actions
        _addEcoAction("bike_ride", 50 * 10**18, 2000); // 50 GREEN, 2kg CO2
        _addEcoAction("recycling", 30 * 10**18, 1000); // 30 GREEN, 1kg CO2  
        _addEcoAction("tree_planting", 100 * 10**18, 5000); // 100 GREEN, 5kg CO2
        _addEcoAction("cleanup", 80 * 10**18, 3000); // 80 GREEN, 3kg CO2
        _addEcoAction("gardening", 40 * 10**18, 1500); // 40 GREEN, 1.5kg CO2
        _addEcoAction("solar_energy", 60 * 10**18, 2500); // 60 GREEN, 2.5kg CO2
    }
    
    function _addEcoAction(
        string memory actionType,
        uint256 baseReward,
        uint256 carbonOffset
    ) internal {
        ecoActions[actionType] = EcoAction({
            actionType: actionType,
            baseReward: baseReward,
            carbonOffset: carbonOffset,
            active: true
        });
        actionTypes.push(actionType);
    }
    
    function completeEcoAction(
        address user,
        string memory actionType,
        bytes32 actionHash,
        string memory imageHash
    ) external onlyOwner nonReentrant {
        require(ecoActions[actionType].active, "Action type not active");
        
        EcoAction memory action = ecoActions[actionType];
        UserProfile storage profile = userProfiles[user];
        
        // Calculate bonus based on user level
        uint256 levelBonus = (profile.level * 5 * action.baseReward) / 100;
        uint256 totalReward = action.baseReward + levelBonus;
        
        // Reward GREEN tokens
        greenToken.rewardEcoAction(user, actionType, totalReward, actionHash);
        
        // Update user profile
        profile.totalActions++;
        profile.totalTokensEarned += totalReward;
        profile.carbonSaved += action.carbonOffset;
        userActionCounts[user][actionType]++;
        
        // Check for level up (every 10 actions)
        uint256 newLevel = profile.totalActions / 10;
        if (newLevel > profile.level) {
            profile.level = newLevel;
            emit LevelUp(user, newLevel);
        }
        
        // Check for NFT milestone (every 10 actions)
        if (profile.totalActions % 10 == 0) {
            uint256 tokenId = ecoNFT.mintEcoNFT(
                user,
                actionType,
                action.carbonOffset,
                imageHash,
                _generateNFTMetadata(user, actionType, profile.totalActions)
            );
            emit NFTMilestone(user, tokenId);
        }
        
        emit ActionCompleted(user, actionType, totalReward, action.carbonOffset);
    }
    
    function _generateNFTMetadata(
        address user,
        string memory actionType,
        uint256 actionCount
    ) internal pure returns (string memory) {
        // In production, this would generate proper IPFS metadata
        return string(abi.encodePacked(
            "https://ecohunt.vercel.app/nft/",
            _addressToString(user),
            "/",
            actionType,
            "/",
            _uint256ToString(actionCount)
        ));
    }
    
    function getUserProfile(address user) external view returns (UserProfile memory) {
        return userProfiles[user];
    }
    
    function getUserActionCount(address user, string memory actionType) external view returns (uint256) {
        return userActionCounts[user][actionType];
    }
    
    function getAllActionTypes() external view returns (string[] memory) {
        return actionTypes;
    }
    
    function updateUsername(address user, string memory username) external onlyOwner {
        userProfiles[user].username = username;
    }
    
    // Utility functions
    function _addressToString(address _addr) internal pure returns (string memory) {
        bytes32 value = bytes32(uint256(uint160(_addr)));
        bytes memory alphabet = "0123456789abcdef";
        bytes memory str = new bytes(42);
        str[0] = '0';
        str[1] = 'x';
        for (uint256 i = 0; i < 20; i++) {
            str[2+i*2] = alphabet[uint8(value[i + 12] >> 4)];
            str[3+i*2] = alphabet[uint8(value[i + 12] & 0x0f)];
        }
        return string(str);
    }
    
    function _uint256ToString(uint256 value) internal pure returns (string memory) {
        if (value == 0) return "0";
        uint256 temp = value;
        uint256 digits;
        while (temp != 0) {
            digits++;
            temp /= 10;
        }
        bytes memory buffer = new bytes(digits);
        while (value != 0) {
            digits -= 1;
            buffer[digits] = bytes1(uint8(48 + uint256(value % 10)));
            value /= 10;
        }
        return string(buffer);
    }
}