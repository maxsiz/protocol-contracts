const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ERC721LazyMintTransferProxy = artifacts.require('ERC721LazyMintTransferProxy');
const ERC1155LazyMintTransferProxy = artifacts.require('ERC1155LazyMintTransferProxy');

const TransferProxy = artifacts.require('TransferProxy');

const ERC721Rarible = artifacts.require('ERC721Rarible');
const ERC1155Rarible = artifacts.require('ERC1155Rarible');

module.exports = async function (deployer, network) {
	const erc721LazyMintTransferProxy = await ERC721LazyMintTransferProxy.deployed();
	const erc1155LazyMintTransferProxy = await ERC1155LazyMintTransferProxy.deployed();
	const transferProxy = await TransferProxy.deployed();

	const erc721 = await ERC721Rarible.deployed();
	const erc1155 = await ERC1155Rarible.deployed();

	await erc721.setDefaultApproval(erc721LazyMintTransferProxy, true, { gas: 100000 });
	await erc721.setDefaultApproval(transferProxy, true, { gas: 100000 });
	await erc1155.setDefaultApproval(erc1155LazyMintTransferProxy, true, { gas: 100000 });
	await erc1155.setDefaultApproval(transferProxy, true, { gas: 100000 });
};
