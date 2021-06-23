// for deploy:
// > truffle migrate --network rinkeby

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ERC1155Rarible = artifacts.require('ERC1155Rarible');

const name = 'Rarible';
const symbol = 'RARI';

module.exports = async function (deployer, network) {
    await deployProxy(ERC1155Rarible, [name, symbol, "ipfs:/", ""], { deployer, initializer: '__ERC1155Rarible_init' });
};