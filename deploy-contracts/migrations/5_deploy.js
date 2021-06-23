// for deploy:
// > truffle migrate --network rinkeby

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ERC721LazyMintTransferProxy = artifacts.require('ERC721LazyMintTransferProxy');
const ERC1155LazyMintTransferProxy = artifacts.require('ERC1155LazyMintTransferProxy');
const RoyaltiesRegistry = artifacts.require("RoyaltiesRegistry.sol");

module.exports = async function (deployer, network) {
    const royaltiesRegistry = await deployProxy(RoyaltiesRegistry, [], { deployer, initializer: '__RoyaltiesRegistry_init' });

    await deployer.deploy(ERC721LazyMintTransferProxy, { gas: 1500000 });
    const erc721Proxy = await ERC721LazyMintTransferProxy.deployed();
    await erc721Proxy.__OperatorRole_init({ gas: 200000 });

    await deployer.deploy(ERC1155LazyMintTransferProxy, { gas: 1500000 });
    const erc1155Proxy = await ERC1155LazyMintTransferProxy.deployed();
    await erc1155Proxy.__OperatorRole_init({ gas: 200000 });
};