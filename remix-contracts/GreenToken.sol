// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IERC20 {
    function totalSupply() external view returns (uint256);
    function balanceOf(address account) external view returns (uint256);
    function transfer(address to, uint256 amount) external returns (bool);
    function allowance(address owner, address spender) external view returns (uint256);
    function approve(address spender, uint256 amount) external returns (bool);
    function transferFrom(address from, address to, uint256 amount) external returns (bool);
    
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

contract GreenToken is IERC20 {
    mapping(address => uint256) private _balances;
    mapping(address => mapping(address => uint256)) private _allowances;
    mapping(address => bool) public ecoValidators;
    mapping(address => uint256) public userEcoActions;
    mapping(bytes32 => bool) public processedActions;
    
    uint256 private _totalSupply;
    string public name = "GreenToken";
    string public symbol = "GREEN";
    uint8 public decimals = 18;
    address public owner;
    bool public paused = false;
    
    event EcoActionReward(address indexed user, string actionType, uint256 reward, bytes32 actionHash);
    event ValidatorAdded(address indexed validator);
    event ValidatorRemoved(address indexed validator);
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }
    
    modifier onlyValidator() {
        require(ecoValidators[msg.sender] || msg.sender == owner, "Not authorized validator");
        _;
    }
    
    modifier whenNotPaused() {
        require(!paused, "Contract is paused");
        _;
    }
    
    constructor() {
        owner = msg.sender;
        ecoValidators[msg.sender] = true;
        _totalSupply = 1000000 * 10**decimals; // 1M GREEN
        _balances[msg.sender] = _totalSupply;
        emit Transfer(address(0), msg.sender, _totalSupply);
    }
    
    // ERC20 Functions
    function totalSupply() public view override returns (uint256) {
        return _totalSupply;
    }
    
    function balanceOf(address account) public view override returns (uint256) {
        return _balances[account];
    }
    
    function transfer(address to, uint256 amount) public override whenNotPaused returns (bool) {
        address ownerAddr = msg.sender;
        _transfer(ownerAddr, to, amount);
        return true;
    }
    
    function allowance(address ownerAddr, address spender) public view override returns (uint256) {
        return _allowances[ownerAddr][spender];
    }
    
    function approve(address spender, uint256 amount) public override returns (bool) {
        address ownerAddr = msg.sender;
        _approve(ownerAddr, spender, amount);
        return true;
    }
    
    function transferFrom(address from, address to, uint256 amount) public override whenNotPaused returns (bool) {
        address spender = msg.sender;
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }
    
    // Internal Functions
    function _transfer(address from, address to, uint256 amount) internal {
        require(from != address(0), "ERC20: transfer from the zero address");
        require(to != address(0), "ERC20: transfer to the zero address");
        
        uint256 fromBalance = _balances[from];
        require(fromBalance >= amount, "ERC20: transfer amount exceeds balance");
        unchecked {
            _balances[from] = fromBalance - amount;
            _balances[to] += amount;
        }
        
        emit Transfer(from, to, amount);
    }
    
    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "ERC20: mint to the zero address");
        
        _totalSupply += amount;
        unchecked {
            _balances[to] += amount;
        }
        emit Transfer(address(0), to, amount);
    }
    
    function _approve(address ownerAddr, address spender, uint256 amount) internal {
        require(ownerAddr != address(0), "ERC20: approve from the zero address");
        require(spender != address(0), "ERC20: approve to the zero address");
        
        _allowances[ownerAddr][spender] = amount;
        emit Approval(ownerAddr, spender, amount);
    }
    
    function _spendAllowance(address ownerAddr, address spender, uint256 amount) internal {
        uint256 currentAllowance = allowance(ownerAddr, spender);
        if (currentAllowance != type(uint256).max) {
            require(currentAllowance >= amount, "ERC20: insufficient allowance");
            unchecked {
                _approve(ownerAddr, spender, currentAllowance - amount);
            }
        }
    }
    
    // Eco Functions
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
        require(reward <= 1000 * 10**decimals, "Reward too high");
        
        processedActions[actionHash] = true;
        userEcoActions[user]++;
        
        _mint(user, reward);
        
        emit EcoActionReward(user, actionType, reward, actionHash);
    }
    
    function getUserEcoActions(address user) external view returns (uint256) {
        return userEcoActions[user];
    }
    
    function pause() external onlyOwner {
        paused = true;
    }
    
    function unpause() external onlyOwner {
        paused = false;
    }
    
    function transferOwnership(address newOwner) external onlyOwner {
        require(newOwner != address(0), "New owner is the zero address");
        emit OwnershipTransferred(owner, newOwner);
        owner = newOwner;
    }
}