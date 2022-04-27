// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Token counting utilities 
// Address for marketplace NFT interaction
// Token creation functionality 
contract NFT is ERC721URIStorage {

    using Counters for Counters.counter; 
    
    Counters.Counter private _tokenIds; 

    
    address contractAddress; 

    constructor(address marketplaceAddress) ERC721("Metaverse Tokens", "METT") {
        contractAddress = marketplaceAddress; 
    }

    // add token
    // get value 
    // mint token, 
    // set URI, 
    // set marketplace approval for token transacting in market
    function createToken(string memory tokenURI) public returns (uint) {
        _tokenIds.increment(); 

        uint256 newItemId = _tokenIds.current(); 

        _mint(msg.sender, newItemId);

        _setTokenURI(newItemId, tokenURI); 

        setApprovalForAll(contractAddress, true); 

        return newItemId; 
    }
}

