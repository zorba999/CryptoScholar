// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CryptoScholar Diploma
 * @dev Mints an NFT diploma ONLY if the user passed the OpenGradient Verifiable LLM quiz.
 */
contract CryptoScholar is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    // Maps TokenID to OpenGradient Verification Transaction Hash
    mapping(uint256 => string) public ogVerifications;

    // Events
    event DiplomaMinted(address indexed student, uint256 tokenId, string topic, string ogTxHash);

    // Pass the deployer address to the Ownable constructor (required in OpenZeppelin v5.0.0+)
    constructor() ERC721("Crypto Scholar Diploma", "CSD") Ownable(msg.sender) {}

    /**
     * @notice Mints the Web3 Diploma NFT.
     * @dev Only the owner (Backend Oracle) can mint this, ensuring the backend verified the user's quiz first.
     * @param student The address of the user who passed the quiz.
     * @param metadataURI The IPFS URI containing the diploma image/metadata.
     * @param topic The topic they passed (e.g., "Rollups").
     * @param ogTxHash The verification transaction hash returned by OpenGradient SDK.
     */
    function mintDiploma(address student, string memory metadataURI, string memory topic, string memory ogTxHash) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        
        _safeMint(student, tokenId);
        _setTokenURI(tokenId, metadataURI);
        
        // Store the fact that an AI verified this!
        ogVerifications[tokenId] = ogTxHash;
        
        emit DiplomaMinted(student, tokenId, topic, ogTxHash);
    }
}
