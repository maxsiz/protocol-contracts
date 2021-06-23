// for deploy:
// > truffle migrate --network rinkeby

const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const ERC721Rarible = artifacts.require('ERC721Rarible');

const name = 'Rarible';
const symbol = 'RARI';

module.exports = async function (deployer, network) {
    await deployProxy(ERC721Rarible, [name, symbol, "ipfs:/", ""], { deployer, initializer: '__ERC721Rarible_init' });
};