const secp = require("ethereum-cryptography/secp256k1");
const { keccak256 } = require("ethereum-cryptography/keccak");
const { toHex, utf8ToBytes } = require("ethereum-cryptography/utils");

/**
 * Hashes message
 * @param {string} message 
 * @returns {Uint8Array} hash
 */
function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

function recoverKeyFromSig(message, signature, recoveryBit) {
    return toHex(secp.recoverPublicKey(hashMessage(message), signature, recoveryBit));
}

module.exports = { recoverKeyFromSig };
// Recover key:
/*

async function recoverKey(message, signature, recoveryBit) {
    return secp.recoverPublicKey(hashMessage(message), signature, recoveryBit);
}

function getAddress(publicKey) {
    const compressed = publicKey.slice(0, 1);
    return keccak256(publicKey.slice(1)).slice(-20);
}
 */