// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import './ERC721.sol';

contract ERC721Enumerable is ERC721
{
    uint256[] private _allTokens;

    //mapping from tokenId to index in _allTokens array
    mapping(uint256 => uint256) private _allTokensIndex;

    //mapping of owner to list of all owner token ids
    mapping(address => uint256[]) private _ownedTokens;

    //mapping from token Id to index of owner token list
    mapping(uint256 => uint256) private _ownedTokensIndex;

    function totalSupply() public view returns(uint256)
    {
        return _allTokens.length;
    }

    function _mint(address to, uint256 tokenId) internal override(ERC721)
    {
        super._mint(to,tokenId);
        _addTokensToTotalSupply(tokenId);
        _addTokensToOwnerEnumeration(to,tokenId);
    }

    function _addTokensToTotalSupply(uint tokenId) private
    {
        _allTokensIndex[tokenId]=_allTokens.length;
        _allTokens.push(tokenId);
    }

    function _addTokensToOwnerEnumeration(address to, uint256 tokenId) private 
    {
        _ownedTokensIndex[tokenId]=_ownedTokens[to]. length;
        _ownedTokens[to].push(tokenId);
    }

    function tokenByIndex(uint256 index) public view returns(uint256)
    {
        require(index<totalSupply(),"Specified global Index Does not Exist");
        return _allTokens[index];
    }

    function tokenOfOwnerByIndex(address owner, uint256 index) public view returns(uint256)
    {
        require(index<balanceOf(owner),"Specified owner Index Does not Exist");
        return _ownedTokens[owner][index];
    }
}