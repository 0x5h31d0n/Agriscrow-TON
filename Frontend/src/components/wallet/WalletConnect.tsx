import React, { useState, useEffect } from 'react';
import { Wallet, RefreshCw, DollarSign, Coins } from 'lucide-react';
import { useTonWallet } from './useTonWallet';
import { getTonPrice } from './ton';

export function WalletConnect() {
  const { connect, disconnect, isConnected, walletAddress, getBalance } = useTonWallet();
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUSD, setShowUSD] = useState(false);
  const [tonPrice, setTonPrice] = useState<number>(0);

  const fetchBalance = async () => {
    if (!isConnected) return;
    setIsLoading(true);
    try {
      const newBalance = await getBalance();
      setBalance(newBalance);
      const price = await getTonPrice();
      setTonPrice(price);
    } catch (error) {
      console.error('Error fetching balance:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isConnected) {
      fetchBalance();
    } else {
      setBalance(null);
    }
  }, [isConnected]);

  const formatAddress = (address: string | undefined) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const toggleCurrency = () => {
    setShowUSD(!showUSD);
  };

  const formatBalance = () => {
    if (balance === null) return '0.00';
    if (showUSD) {
      const usdValue = balance * tonPrice;
      return `$${usdValue.toFixed(2)}`;
    }
    return `${balance.toFixed(2)} TON`;
  };

  const handleConnect = async () => {
    try {
      await connect();
    } catch (error) {
      console.error('Failed to connect wallet:', error);
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {isConnected ? (
        <div className="flex items-center space-x-2">
          <div className="bg-green-800 rounded-lg px-3 py-1.5 text-sm flex items-center space-x-2">
            {balance !== null && (
              <div className="flex items-center space-x-1 border-r border-green-600 pr-2">
                <button
                  onClick={toggleCurrency}
                  className="flex items-center space-x-1 hover:bg-green-700 px-2 py-1 rounded transition-colors"
                >
                  {showUSD ? (
                    <DollarSign className="h-3 w-3" />
                  ) : (
                    <Coins className="h-3 w-3" />
                  )}
                  <span>{formatBalance()}</span>
                </button>
                <button 
                  onClick={fetchBalance}
                  disabled={isLoading}
                  className="hover:bg-green-700 p-1 rounded"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            )}
            <span className="text-green-100">{walletAddress ? formatAddress(walletAddress) : ''}</span>
          </div>
          <button
            onClick={disconnect}
            className="text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1"
          >
            <Wallet className="h-4 w-4" />
            <span>Disconnect</span>
          </button>
        </div>
      ) : (
        <button
          onClick={handleConnect}
          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg flex items-center space-x-1"
        >
          <Wallet className="h-4 w-4" />
          <span>Connect Wallet</span>
        </button>
      )}
    </div>
  );
}
