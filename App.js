import React, { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [address, setAddress] = useState('');
  const [accountInfo, setAccountInfo] = useState(null);
  const [usdtBalance, setUsdtBalance] = useState(null);
  const [txs, setTxs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/account/${address}`);
      setAccountInfo(res.data.accountInfo);
      setUsdtBalance(res.data.usdtBalance);
      setTxs(res.data.transactions);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch data");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">TRON Explorer Lite</h1>
      <input
        className="border rounded p-2 w-full mb-2"
        placeholder="Enter TRON Address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded"
        onClick={fetchData}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Search'}
      </button>

      {accountInfo && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <p><strong>Address:</strong> {accountInfo.address}</p>
          <p><strong>TRX Balance:</strong> {accountInfo.balance} TRX</p>
          <p><strong>USDT Balance:</strong> {usdtBalance} USDT</p>
        </div>
      )}

      {txs.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold">Transactions:</h2>
          <ul className="space-y-2 mt-2">
            {txs.map((tx) => (
              <li key={tx.txID} className="p-2 border rounded">
                <p><strong>TXID:</strong> {tx.txID}</p>
                <p><strong>Type:</strong> {tx.type}</p>
                <p><strong>Timestamp:</strong> {new Date(tx.timestamp).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
