// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract CryptoScholar {
    string public name = "Crypto Scholar Diploma";
    string public symbol = "CSD";
    address public owner;
    
    uint256 private _nextTokenId;
    
    // mapping from token ID to owner address
    mapping(uint256 => address) private _owners;
    // mapping from token ID to URI
    mapping(uint256 => string) private _tokenURIs;
    // mapping from token ID to OG Tx Hash
    mapping(uint256 => string) public ogVerifications;
    
    event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
    event DiplomaMinted(address indexed student, uint256 tokenId, string topic, string ogTxHash);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    function mintDiploma(address student, string memory metadataURI, string memory topic, string memory ogTxHash) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        
        _owners[tokenId] = student;
        _tokenURIs[tokenId] = metadataURI;
        ogVerifications[tokenId] = ogTxHash;
        
        emit Transfer(address(0), student, tokenId);
        emit DiplomaMinted(student, tokenId, topic, ogTxHash);
    }
    
    function ownerOf(uint256 tokenId) public view returns (address) {
        address tokenOwner = _owners[tokenId];
        require(tokenOwner != address(0), "Invalid token");
        return tokenOwner;
    }
    
    function tokenURI(uint256 tokenId) public view returns (string memory) {
        require(_owners[tokenId] != address(0), "Invalid token");
        return _tokenURIs[tokenId];
    }
}
