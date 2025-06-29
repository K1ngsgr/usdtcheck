const express = require('express');
const axios = require('axios');
const TronWeb = require('tronweb');
const cors = require('cors');

const app = express();
const PORT = 5000;
app.use(cors());

const tronWeb = new TronWeb({
  fullHost: 'https://api.trongrid.io'
});
const USDT_CONTRACT = 'TXLAQ63Xg1NAzckPwKHvzw7CSEmLMEqcdj';

app.get('/api/account/:address', async (req, res) => {
  try {
    const { address } = req.params;

    const { data: account } = await axios.post('https://api.trongrid.io/wallet/getaccount', {
      address: tronWeb.address.toHex(address)
    });

    const balance = (account.balance || 0) / 1e6;

    const contract = await tronWeb.contract().at(USDT_CONTRACT);
    const usdtRaw = await contract.balanceOf(address).call();
    const usdtBalance = parseFloat(usdtRaw) / 1e6;

    const txs = await axios.get(`https://api.trongrid.io/v1/accounts/${address}/transactions`);
    const transactions = txs.data.data.map(tx => ({
      txID: tx.txID,
      type: tx.raw_data.contract[0].type,
      timestamp: tx.block_timestamp
    }));

    res.json({
      accountInfo: { address, balance },
      usdtBalance,
      transactions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch data' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
