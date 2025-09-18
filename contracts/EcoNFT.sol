// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract EcoNFT is ERC721, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    
    struct EcoNFTData {
        string actionType;
        uint256 carbonOffset; // in grams
        uint256 timestamp;
        string imageHash;
        address minter;
    }
    
    mapping(uint256 => EcoNFTData) public nftData;
    mapping(address => uint256[]) public userNFTs;
    mapping(address => uint256) public userCarbonOffset;
    
    event EcoNFTMinted(
        uint256 indexed tokenId, 
        address indexed to, 
        string actionType, 
        uint256 carbonOffset
    );
    
    constructor(address initialOwner) 
        ERC721("EcoHunt Carbon NFT", "ECONFT") 
        Ownable(initialOwner) 
    {}
    
    function mintEcoNFT(
        address to,
        string memory actionType,
        uint256 carbonOffset,
        string memory imageHash,
        string memory tokenURI
    ) external onlyOwner returns (uint256) {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        nftData[tokenId] = EcoNFTData({
            actionType: actionType,
            carbonOffset: carbonOffset,
            timestamp: block.timestamp,
            imageHash: imageHash,
            minter: to
        });
        
        userNFTs[to].push(tokenId);
        userCarbonOffset[to] += carbonOffset;
        
        emit EcoNFTMinted(tokenId, to, actionType, carbonOffset);
        
        return tokenId;
    }
    
    function getUserNFTs(address user) external view returns (uint256[] memory) {
        return userNFTs[user];
    }
    
    function getNFTData(uint256 tokenId) external view returns (EcoNFTData memory) {
        require(_exists(tokenId), "NFT does not exist");
        return nftData[tokenId];
    }
    
    function getUserCarbonOffset(address user) external view returns (uint256) {
        return userCarbonOffset[user];
    }
    
    function totalSupply() external view returns (uint256) {
        return _tokenIdCounter.current();
    }
    
    // Override required functions
    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}