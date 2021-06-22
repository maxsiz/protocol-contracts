const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const RoyaltiesRegistry = artifacts.require("RoyaltiesRegistry.sol");
const ExchangeV2 = artifacts.require('ExchangeV2');
const ERC721LazyMintTransferProxy = artifacts.require('ERC721LazyMintTransferProxy');
const ERC1155LazyMintTransferProxy = artifacts.require('ERC1155LazyMintTransferProxy');
const ERC721Rarible = artifacts.require('ERC721Rarible');
const ERC1155Rarible = artifacts.require('ERC1155Rarible');

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

    await deployProxy(ERC1155Rarible, [name, symbol, "ipfs:/", ""], { deployer, initializer: '__ERC1155Rarible_init' });
    await deployProxy(ERC721Rarible, [name, symbol, "ipfs:/", ""], { deployer, initializer: '__ERC721Rarible_init' });

    //@Todo add transferProxy
    let  transferProxy = '0x0';
    //@Todo add erc20TransferProxy
    let erc20TransferProxy = '0x0';

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