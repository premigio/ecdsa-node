const secp = require('ethereum-cryptography/secp256k1');
const { toHex } = require('ethereum-cryptography/utils');



function generateBalanceKeys(amount = 3) {
    let balances = {};
    let privatePublic = {};
    for (let i = 0; i < amount; i++) {
        const privateKey = secp.utils.randomPrivateKey();
        const publicKey = toHex(secp.getPublicKey(privateKey));
        balances[publicKey] = 100;
        privatePublic[toHex(privateKey)] = publicKey;
    }
    console.info(`Private & Public: ${
        JSON.stringify(privatePublic)
            .replaceAll(',', '\n\n')
            .replaceAll('{', '\n')
            .replaceAll('}', '\n')
    }`);
    console.info(`Balances: ${
        JSON.stringify(balances)
            .replaceAll(',', '\n\n')
            .replaceAll('{', '\n')
            .replaceAll('}', '\n')
    }`);
    return balances;
}

module.exports = {
    generateBalanceKeys
};
