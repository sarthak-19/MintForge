// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './ERC721Connector.sol';

contract NftMarketplace is ERC721Connector
{
    string[] public digitalTokens;
    mapping(string=>bool) _digitalTokenExists;
    constructor () ERC721Connector("NftMarketPlace","NFTOP")
    {

    }

    function mint(string memory _digitalToken) public
    {
        require(_digitalTokenExists[_digitalToken]==false,"Kryptobird already exists");
        digitalTokens.push(_digitalToken);
        uint _id = uint(digitalTokens.length - 1);
        _mint(msg.sender,_id);
        _digitalTokenExists[_digitalToken] = true;
    }
} 