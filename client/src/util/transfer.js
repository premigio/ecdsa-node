import * as secp from 'ethereum-cryptography/secp256k1';
import { keccak256 } from 'ethereum-cryptography/keccak';
import { utf8ToBytes } from 'ethereum-cryptography/utils';

/**
 * Hashes message
 * @param {string} message 
 * @returns {Uint8Array} hash
 */
export function hashMessage(message) {
    return keccak256(utf8ToBytes(message));
}

export async function signMessage(msg, privateKey) {
    return await secp.sign(hashMessage(JSON.stringify(msg)), privateKey, { recovered: true });
}
