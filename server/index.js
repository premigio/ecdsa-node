const express = require("express");
const { generateBalanceKeys } = require("./scripts/generate"); 
const { recoverKeyFromSig } = require("./scripts/recoverKeyFromSig");
const app = express();
const cors = require("cors");
const port = 3042;

app.use(cors());
app.use(express.json());

const balances = generateBalanceKeys(3);

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  // TODO: get a signature from the client-side application
  // recover the public address from the signature
  const { signature, recoveryBit, recipient, amount } = req.body;
  if (signature == null || recoveryBit == null) {
    return res.status(400).send('The signature and Recovery bit NEED to be sent');
  }

  const sig = new Uint8Array(signature);

  const sender = recoverKeyFromSig(JSON.stringify({ amount, recipient }), sig, recoveryBit);

  setInitialBalance(sender);
  setInitialBalance(recipient);

  if (balances[sender] < amount) {
    return res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[sender] -= amount;
    balances[recipient] += amount;
    return res.send({ balance: balances[sender] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
