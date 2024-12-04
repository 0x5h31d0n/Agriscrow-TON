import React, { useState, useEffect } from 'react';
import { ShoppingCart, Package, Clock, Heart, Send } from 'lucide-react';
import { useTonWallet } from '../wallet/useTonWallet';
import { getTonPrice } from '../wallet/ton';

interface BuyerDashboardProps {
  userInfo: {
    name: string;
    email: string;
  };
}

export function BuyerDashboard({ userInfo }: BuyerDashboardProps) {
  const { connect, isConnected, sendTransaction, isPending } = useTonWallet();
  const [amountTON, setAmountTON] = useState<string>('');
  const [amountUSD, setAmountUSD] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [tonPrice, setTonPrice] = useState<number>(0);

  useEffect(() => {
    const fetchTonPrice = async () => {
      const price = await getTonPrice();
      setTonPrice(price);
    };
    fetchTonPrice();
  }, []);

  const handleTransaction = async () => {
    if (!isConnected) {
      await connect();
      return;
    }

    try {
      setError('');
      if (!amountTON || !recipientAddress) {
        setError('Please fill in all fields');
        return;
      }

      const numAmount = parseFloat(amountTON);
      if (isNaN(numAmount) || numAmount <= 0) {
        setError('Please enter a valid amount');
        return;
      }

      await sendTransaction(recipientAddress, numAmount);
      // Reset form after successful transaction
      setAmountTON('');
      setAmountUSD('');
      setRecipientAddress('');
      setShowTransactionForm(false);
      alert('Transaction successful!');
    } catch (error) {
      console.error('Transaction failed:', error);
      setError('Transaction failed. Please try again.');
    }
  };

  const handleTONChange = (value: string) => {
    setAmountTON(value);
    const tonValue = parseFloat(value);
    if (!isNaN(tonValue) && tonPrice > 0) {
      setAmountUSD((tonValue * tonPrice).toFixed(2));
    } else {
      setAmountUSD('');
    }
  };

  const handleUSDChange = (value: string) => {
    setAmountUSD(value);
    const usdValue = parseFloat(value);
    if (!isNaN(usdValue) && tonPrice > 0) {
      setAmountTON((usdValue / tonPrice).toFixed(2));
    } else {
      setAmountTON('');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-2">Welcome, {userInfo.name}</h1>
        <p className="text-gray-600">{userInfo.email}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <ShoppingCart className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Orders</h2>
          </div>
          <p className="text-3xl font-bold">5</p>
          <p className="text-gray-600">Active Orders</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Package className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Delivered</h2>
          </div>
          <p className="text-3xl font-bold">28</p>
          <p className="text-gray-600">Total Deliveries</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Pending</h2>
          </div>
          <p className="text-3xl font-bold">2</p>
          <p className="text-gray-600">Awaiting Delivery</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center space-x-3 mb-4">
            <Heart className="h-6 w-6 text-green-600" />
            <h2 className="text-lg font-semibold">Wishlist</h2>
          </div>
          <p className="text-3xl font-bold">15</p>
          <p className="text-gray-600">Saved Items</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Recent Orders</h2>
          {/* Add recent orders list here */}
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {showTransactionForm ? (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-medium">Send TON</h3>
                {error && (
                  <div className="text-red-500 text-sm">{error}</div>
                )}
                <input
                  type="text"
                  placeholder="Recipient Address"
                  value={recipientAddress}
                  onChange={(e) => setRecipientAddress(e.target.value)}
                  className="w-full p-2 border rounded"
                />
                <div className="flex space-x-2">
                  <input
                    type="number"
                    placeholder="Amount in TON"
                    value={amountTON}
                    onChange={(e) => handleTONChange(e.target.value)}
                    className="w-full p-2 border rounded"
                    step="0.1"
                    min="0"
                  />
                  <input
                    type="number"
                    placeholder="Amount in USD"
                    value={amountUSD}
                    onChange={(e) => handleUSDChange(e.target.value)}
                    className="w-full p-2 border rounded"
                    step="0.1"
                    min="0"
                  />
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={handleTransaction}
                    disabled={isPending}
                    className="flex-1 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 disabled:bg-green-300 flex items-center justify-center space-x-2"
                  >
                    {isPending ? (
                      <span>Processing...</span>
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        <span>Send TON</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => setShowTransactionForm(false)}
                    className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowTransactionForm(true)}
                className="w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center justify-center space-x-2"
              >
                <Send className="h-4 w-4" />
                <span>Send TON</span>
              </button>
            )}
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              Browse Products
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              Track Orders
            </button>
            <button className="w-full bg-green-100 text-green-700 py-2 px-4 rounded hover:bg-green-200">
              View Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 