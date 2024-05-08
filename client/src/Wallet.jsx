import server from './server';
import * as secp from 'ethereum-cryptography/secp256k1';
import { toHex } from 'ethereum-cryptography/utils';
import { useState } from "react";

function Wallet({ address, setAddress, balance, setBalance, privateKey, setPrivateKey }) {
  const [errorMessage, setErrorMessage] = useState('');

  async function onChange(evt) {
    const inputPrivateKey = evt.target.value;
    setPrivateKey(inputPrivateKey);
    setErrorMessage('');
    let calculatedAddress = '';
    try {
      calculatedAddress = toHex(secp.getPublicKey(inputPrivateKey));
    } catch (e) {
      setErrorMessage(e.toString());
      calculatedAddress = '';
    }
    if (calculatedAddress) {
      try {
        const { data: { balance: newBalance } } = await server.get(`balance/${calculatedAddress}`);
        setAddress(calculatedAddress);
        setBalance(newBalance);
      } catch (error) {
        setErrorMessage('Error fetching balance'); // Set a meaningful error message
        setAddress('');
        setBalance(0);
      }
    } else {
      setAddress('');
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type in a Private Key" value={privateKey} onChange={onChange}></input>
      </label>
      <br/>
      <div className="address">
        Address: { address.slice(0,20) }...
      </div>
      {errorMessage && <div className="error"> {errorMessage} </div>}
      <br/>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
