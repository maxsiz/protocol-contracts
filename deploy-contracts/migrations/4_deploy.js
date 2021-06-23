// for deploy:
// > truffle migrate --network rinkeby

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ERC721Rarible = artifacts.require('ERC721Rarible');

const TransferProxy = artifacts.require('TransferProxy');
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');

const RoyaltiesRegistry = artifacts.require("RoyaltiesRegistry.sol");
const ExchangeV2 = artifacts.require('ExchangeV2');

const ERC721LazyMintTransferProxy = artifacts.require('ERC721LazyMintTransferProxy');
const ERC1155LazyMintTransferProxy = artifacts.require('ERC1155LazyMintTransferProxy');

const name = 'Rarible';
const symbol = 'RARI';

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

    await deployProxy(ERC721Rarible, [name, symbol, "ipfs:/", ""], { deployer, initializer: '__ERC721Rarible_init' });

    await deployer.deploy(TransferProxy, { gas: 1500000 });
    const transferProxy = await TransferProxy.deployed();
    await transferProxy.__TransferProxy_init({ gas: 200000 });

    await deployer.deploy(ERC20TransferProxy, { gas: 1500000 });
    const erc20TransferProxy = await ERC20TransferProxy.deployed();
    await erc20TransferProxy.__ERC20TransferProxy_init({ gas: 200000 });

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