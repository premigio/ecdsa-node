import { useState } from 'react';
import server from './server';
import { signMessage } from './util/transfer';

function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [errorMessage, setErrorMessage] = useState('');

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();
    setErrorMessage('');
    try {
      const [signature, recoveryBit] = await signMessage({ amount: parseInt(sendAmount), recipient }, privateKey);
      const sendObject = {
        sender: address,
        amount: parseInt(sendAmount),
        signature: Array.from(signature),
        recoveryBit,
        recipient,
      };
      const {
        data: { balance },
      } = await server.post(`send`, sendObject);
      setBalance(balance);
    } catch (ex) {
      console.error(ex);
      setErrorMessage(JSON.stringify(ex));
    }
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Recipient
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
      {errorMessage && <div className="error"> {errorMessage} </div>}
    </form>
  );
}

export default Transfer;
