// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract GreenToken is ERC20, Ownable, Pausable {
    
    mapping(address => bool) public ecoValidators;
    mapping(address => uint256) public userEcoActions;
    mapping(bytes32 => bool) public processedActions;
    
    event EcoActionReward(address indexed user, string actionType, uint256 reward, bytes32 actionHash);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    
    modifier onlyValidator() {
        require(ecoValidators[msg.sender] || msg.sender == owner(), "Not authorized validator");
        _;
    }
    
    constructor(address initialOwner) 
        ERC20("GreenToken", "GREEN") 
        Ownable(initialOwner) 
    {
        ecoValidators[initialOwner] = true;
        _mint(initialOwner, 1000000 * 10**decimals()); // Initial supply: 1M GREEN
    }
    
    function addValidator(address validator) external onlyOwner {
        ecoValidators[validator] = true;
        emit ValidatorAdded(validator);
    }
    
    function removeValidator(address validator) external onlyOwner {
        ecoValidators[validator] = false;
        emit ValidatorRemoved(validator);
    }
    
    function rewardEcoAction(
        address user,
        string memory actionType,
        uint256 reward,
        bytes32 actionHash
    ) external onlyValidator whenNotPaused {
        require(!processedActions[actionHash], "Action already processed");
        require(reward > 0, "Reward must be positive");
        require(reward <= 1000 * 10**decimals(), "Reward too high");
        
        processedActions[actionHash] = true;
        userEcoActions[user]++;
        
        _mint(user, reward);
        
        emit EcoActionReward(user, actionType, reward, actionHash);
    }
    
    function getUserEcoActions(address user) external view returns (uint256) {
        return userEcoActions[user];
    }
    
    function pause() external onlyOwner {
        _pause();
    }
    
    function unpause() external onlyOwner {
        _unpause();
    }
    
    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }
}