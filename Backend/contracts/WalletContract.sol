// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title Interface for ERC4337 compliant tokens
interface IERC4337 {
    /// @notice Retrieves the balance of a specific token for an owner address
    /// @param owner The address of the token owner
    /// @param token The address of the token contract
    /// @return The token balance of the owner
    function balanceOf(address owner, address token) external view returns (uint256);

    /// @notice Checks if a token contract supports a specific interface
    /// @param interfaceId The ID of the interface to check
    /// @return True if the interface is supported, false otherwise
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

/// @title Wallet Contract for managing Ether and ERC20 token balances
contract WalletContract {
    /// @dev Struct to store token balance information
    struct TokenBalance {
        address tokenAddress;
    }

    address immutable owner;

    /// @notice Emitted when funds are received by the contract
    event FundsReceived(address indexed owner, uint256 amount);

    /// @dev Mapping to track Ether balances
    mapping(address => uint256) public balances;

    /// @dev Nested mapping to track token balances for each address
    mapping(address => mapping(address => TokenBalance)) public tokenBalances;

    /// @notice Modifier to allow only the owner to execute certain functions
    modifier onlyOwner() {
        require(msg.sender == owner, "Caller is not the owner");
        _;
    }

    /// @notice Constructor to set the initial owner of the contract
    /// @param walletOwner The address of the contract owner
    constructor(address walletOwner) {
        require(walletOwner != address(0), "Invalid wallet owner address");
        owner = walletOwner;
    }

    /// @notice Returns the Ether balance of the contract
    /// @return The Ether balance
    function getBalance() external view returns (uint256) {
        return address(this).balance;
    }

    /// @notice Returns the token balance for a specific token and caller address
    /// @param tokenAddress The address of the token contract
    /// @return The token balance of the caller for the specified token
    function getTokenBalance(address tokenAddress) external view returns (uint256) {
        TokenBalance storage tokenBalance = tokenBalances[msg.sender][tokenAddress];
        if (tokenBalance.tokenAddress == address(0)) {
            return 0;
        }
        return _getTokenBalance(tokenAddress);
    }

    /// @notice Transfers Ether or tokens from the contract to a specified address
    /// @param to The recipient address
    /// @param token The token address (use address(0) for Ether)
    /// @param amount The amount to transfer
    function transfer(address to, address token, uint256 amount) external {
        if (token == address(0)) {
            require(balances[msg.sender] >= amount, "Insufficient balance");
            balances[msg.sender] -= amount;
            balances[to] += amount;
            payable(to).transfer(amount);
        } else {
            IERC20 tokenContract = IERC20(token);
            require(tokenContract.balanceOf(address(this)) >= amount, "Insufficient balance");
            TokenBalance storage tokenBalance = tokenBalances[msg.sender][token];
            if (tokenBalance.tokenAddress == address(0)) {
                tokenBalance.tokenAddress = token;
            }
            require(tokenContract.transfer(to, amount), "Token transfer failed");
        }
    }

    /// @notice Receive function to handle incoming Ether transactions
    receive() external payable {
        balances[owner] += msg.value;
        emit FundsReceived(owner, msg.value);
    }

    /// @dev Internal function to get the token balance using the ERC4337 interface
    /// @param tokenAddress The address of the token contract
    /// @return The token balance
    function _getTokenBalance(address tokenAddress) private view returns (uint256) {
        IERC4337 tokenContract = IERC4337(tokenAddress);
        require(tokenContract.supportsInterface(type(IERC4337).interfaceId), "Token does not support EIP-4337");
        return tokenContract.balanceOf(msg.sender, tokenAddress);
    }
}
