// for deploy:
// > truffle migrate --network rinkeby

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const TransferProxy = artifacts.require('TransferProxy');
const ERC20TransferProxy = artifacts.require('ERC20TransferProxy');

const ExchangeV2 = artifacts.require('ExchangeV2');

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

    await deployer.deploy(TransferProxy, { gas: 1500000 });
    const transferProxy = await TransferProxy.deployed();
    await transferProxy.__TransferProxy_init({ gas: 200000 });

    await deployer.deploy(ERC20TransferProxy, { gas: 1500000 });
    const erc20TransferProxy = await ERC20TransferProxy.deployed();
    await erc20TransferProxy.__ERC20TransferProxy_init({ gas: 200000 });

    await deployProxy(
        ExchangeV2,
        [transferProxy.address, erc20TransferProxy.address, 0, communityWallet, "0x0"],
        { deployer, initializer: '__ExchangeV2_init' }
    );
};