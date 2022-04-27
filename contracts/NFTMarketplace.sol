// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4; 

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

  // MarketItem - # of Items bought, created, currently not sold 
contract NFTMarket is ReentrancyGuard {
    using Counters for Counters.Counter;
    Counters.Counter private _itemIds;
    Counters.Counter private _itemsSold;

  

    address payable owner; 
    uint256 listingPrice = 0.025 ether;

    constructor() {
        owner = payable(msg.sender);
    }

    struct MarketItem {
        uint itemId;
        address nftContract;
        uint256 tokenId;
        address payable seller;
        address payable owner; 
        uint256 price; 
        bool sold;
    }

    mapping(uint256 => MarketItem) private idToMarketItem; 

    event MarketItemCreated {
        uint indexed itemId;
        address indexed nftContract; 
        uint256 indexed tokenId;
        address seller;
        address owner; 
        uint256 price;
        bool sold; 
    }

    function getListingPrice() public view returns (uint256) {
        return listingPrice; 
    }

    // Function createMarket Item: 
    // Increments itemId, transfers ownership, emits event creation
    function createMarketItem(
        address nftContract, 
        uint256 tokenId, 
        uint256 price
        ) public payable nonReentrant {
            require(price > 0, 'Price must be at least 1 wei.');
            require(msg.value == listingPrice, 'Price must be equal to listing price';)
        
            _itemIds.incement(); 
            uint256 itemId = _itemIds.current(); 

            idToMarketItem[itemId] = MarketItem(
                itemId,
                nftContract,
                tokenId,
                payable(msg.sender),
                payable(address(0)),
                price,
                false
            );

            IERC721(nftContract).transferFrom(msg.sender, addres(this), tokenId); 

            emit MarketItemCreated (
                itemId,
                nftContract,
                tokenId,
                msg.sender,
                adress(0) 
                price,
                false
            ); 
        }
    
    function createMarketSale(
        address nftContract,
        uint256 itemId
        ) public payable nonReentrant {
            uint price = idToMarketItem[itemid].price;
            uint tokenId = idToMarketItem[itemId].tokenId;
            require(msg.value == price, 'Please submit the asking price in order to complete the purchase');

            idToMarketItem[itemId].seller.transfer(msg.value); 
            IERC721(nftContract).transferFrom(address(this), msg.sender, tokenId);
            idToMarketItem[itemId].sold = true;
            _itemsSold.increment();
            payable(owner).transfer(listingPrice);

        }
    )

    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint itemCount = _itemIds.curent();
        uint unsoldItemCount = _itemIds.current() - _itemsSold.current(); 
        uint currentIndex = 0; 
    }



    
}