// for deploy:
// > truffle migrate --network rinkeby

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const RoyaltiesRegistry = artifacts.require("RoyaltiesRegistry.sol");
const ExchangeV2 = artifacts.require('ExchangeV2');

const ERC721LazyMintTransferProxy = artifacts.require('ERC721LazyMintTransferProxy');
const ERC1155LazyMintTransferProxy = artifacts.require('ERC1155LazyMintTransferProxy');

const rinkeby = {
    communityWallet: "0xe627243104a101ca59a2c629adbcd63a782e837f"
};

let settings = {
    "default": rinkeby,
    "rinkeby": rinkeby
};

function getSettings(network) {
    if (settings[network] !== undefined) {
        return settings[network];
    } else {
        return settings["default"];
    }
}

module.exports = async function (deployer, network) {
    const { communityWallet } = getSettings(network);

    const royaltiesRegistry = await deployProxy(RoyaltiesRegistry, [], { deployer, initializer: '__RoyaltiesRegistry_init' });

    await deployProxy(
        ExchangeV2,
        [transferProxy.address, erc20TransferProxy.address, 0, communityWallet, royaltiesRegistry.address],
        { deployer, initializer: '__ExchangeV2_init' }
    );

    await deployer.deploy(ERC721LazyMintTransferProxy, { gas: 1500000 });
    const erc721Proxy = await ERC721LazyMintTransferProxy.deployed();
    await erc721Proxy.__OperatorRole_init({ gas: 200000 });

    await deployer.deploy(ERC1155LazyMintTransferProxy, { gas: 1500000 });
    const erc1155Proxy = await ERC1155LazyMintTransferProxy.deployed();
    await erc1155Proxy.__OperatorRole_init({ gas: 200000 });
};