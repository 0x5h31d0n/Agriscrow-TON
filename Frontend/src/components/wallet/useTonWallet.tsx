import { useState, useEffect } from 'react';
import TonConnect, { Wallet } from '@tonconnect/sdk';
import { getTonWeb } from './ton';

export function useTonWallet() {
  const [connector, setConnector] = useState<TonConnect | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initConnector = async () => {
      const tonConnect = new TonConnect({
        manifestUrl: 'http://localhost:5173/tonconnect-manifest.json'
      });
      setConnector(tonConnect);

      // Restore connection
      try {
        await tonConnect.restoreConnection();
      } catch (error) {
        console.error('Failed to restore connection:', error);
      }

      // Listen for wallet status changes
      const unsubscribe = tonConnect.onStatusChange((wallet) => {
        if (wallet) {
          handleWalletConnection(wallet);
        } else {
          setIsConnected(false);
          setWalletAddress('');
        }
      });

      return () => {
        unsubscribe();
      };
    };

    initConnector();
  }, []);

  const handleWalletConnection = (wallet: Wallet) => {
    setIsConnected(true);
    const address = wallet.account.address;
    setWalletAddress(address.startsWith('0x') ? address : `0x${address}`);
  };

  const connect = async () => {
    if (!connector) return;

    try {
      if (isConnected) {
        console.warn('Wallet is already connected.');
        return;
      }

      setIsLoading(true);
      const wallets = await connector.getWallets();
      const tonkeeper = wallets.find((w) => w.name.toLowerCase().includes('tonkeeper'));

      if (!tonkeeper) {
        alert('Please install a compatible wallet like Tonkeeper.');
        window.open('https://tonkeeper.com', '_blank');
        return;
      }

      const universalLink = connector.connect(tonkeeper);

      if (universalLink) {
        window.open(universalLink, '_blank');
      }
    } catch (error) {
      console.error('Connection error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = async () => {
    if (!connector) return;
    await connector.disconnect();
    setIsConnected(false);
    setWalletAddress('');
  };

  const getBalance = async () => {
    if (!walletAddress) return null;
    
    try {
      const tonweb = getTonWeb();
      const cleanAddress = walletAddress.startsWith('0x') ? walletAddress.slice(2) : walletAddress;
      const balance = await tonweb.getBalance(cleanAddress);
      return Number(balance) / 1_000_000_000; // Convert from nanotons to TON
    } catch (error) {
      console.error('Balance fetch error:', error);
      throw error;
    }
  };

  const sendTransaction = async (to: string, amount: number) => {
    if (!isConnected) {
      throw new Error('Wallet not connected');
    }

    if (!connector) {
      throw new Error('Connector is not initialized');
    }

    try {
      const result = await connector.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        messages: [
          {
            address: to,
            amount: (amount * 1000000000).toString(), // Convert TON to nanoTON
          },
        ],
      });
      
      // If we get here, the transaction was successful
      return { 
        hash: result.boc, 
        success: true 
      };
    } catch (error) {
      // Just pass through the error, let the component handle it
      throw error;
    }
  };

  return {
    isConnected,
    walletAddress,
    connect,
    disconnect,
    isLoading,
    getBalance,
    sendTransaction,
  };
}
