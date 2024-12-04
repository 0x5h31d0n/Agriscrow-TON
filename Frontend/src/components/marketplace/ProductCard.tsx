import React, { useState } from 'react';
import { MapPin, DollarSign, Package, User, Check, X } from 'lucide-react';
import { useTonWallet } from '../wallet/useTonWallet';

interface ProductCardProps {
  id: number;
  title: string;
  price: number;
  location: string;
  image_url?: string;
  category: string;
  quantity: number;
  unit: string;
  description: string;
  seller_name: string;
  seller_id: number;
  seller_wallet?: string;
  userRole?: string;
  userWallet?: string;
}

// Add new interface for transaction receipt
interface TransactionReceipt {
  id: number;
  transaction_hash: string;
  status: string;
  amount: number;
  created_at: string;
  product_title: string;
  seller_name: string;
  buyer_name: string;
}

export function ProductCard({ 
  id,
  title, 
  price, 
  location, 
  image_url, 
  category,
  quantity,
  unit,
  description,
  seller_name,
  seller_id,
  seller_wallet,
  userRole,
  userWallet
}: ProductCardProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [receipt, setReceipt] = useState<TransactionReceipt | null>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const { sendTransaction, isConnected, connect } = useTonWallet();
  const defaultImage = "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&q=80";

  const handlePurchase = async () => {
    if (!isConnected) {
      try {
        const connected = await connect();
        if (!connected) {
          alert('Please connect your wallet to make a purchase');
          return;
        }
      } catch (error) {
        console.error('Failed to connect wallet:', error);
        alert('Failed to connect wallet. Please try again.');
        return;
      }
    }

    if (!seller_wallet) {
      alert("Seller hasn't connected their wallet yet");
      return;
    }

    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (!userInfo.id) {
      alert('Please login to make a purchase');
      return;
    }

    setIsProcessing(true);
    try {
      // Initiate TON transaction
      console.log('Sending transaction:', {
        to: seller_wallet,
        amount: price
      });

      const result = await sendTransaction(seller_wallet, price);
      console.log('Transaction result:', result);

      if (!result.success) {
        throw new Error('Transaction failed');
      }

      // Record transaction in database
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          product_id: id,
          buyer_id: userInfo.id,
          amount: price,
          transaction_hash: result.hash
        }),
      });

      const data = await response.json();
      if (data.success) {
        setReceipt({
          id: data.data.transaction.id,
          transaction_hash: result.hash,
          status: 'completed',
          amount: price,
          created_at: data.data.transaction.created_at,
          product_title: data.data.transaction.product_title,
          seller_name: data.data.transaction.seller_name,
          buyer_name: data.data.transaction.buyer_name
        });
        setShowReceipt(true);
      } else {
        throw new Error(data.error || 'Failed to record transaction');
      }
    } catch (error: any) {
      console.error('Purchase failed:', error);
      alert(error.message || 'Purchase failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const TransactionReceiptModal = () => {
    if (!receipt || !showReceipt) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg p-6 max-w-md w-full">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Transaction Receipt</h3>
            <button onClick={() => setShowReceipt(false)}>
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-center bg-green-100 text-green-800 p-4 rounded-lg">
              <Check className="h-8 w-8 mr-2" />
              <span className="text-lg font-semibold">Purchase Successful!</span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Product:</span>
                <span className="font-semibold">{receipt.product_title}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Amount:</span>
                <span className="font-semibold">{receipt.amount.toFixed(2)} TON</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Seller:</span>
                <span className="font-semibold">{receipt.seller_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Buyer:</span>
                <span className="font-semibold">{receipt.buyer_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction Hash:</span>
                <a 
                  href={`https://testnet.tonscan.org/tx/${receipt.transaction_hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 truncate ml-2 max-w-[200px]"
                >
                  {receipt.transaction_hash.slice(0, 8)}...{receipt.transaction_hash.slice(-8)}
                </a>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Date:</span>
                <span>{new Date(receipt.created_at).toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full bg-green-700 text-white py-2 rounded-lg hover:bg-green-600 mt-4"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderActionButton = () => {
    if (userRole === 'farmer' && seller_id === parseInt(localStorage.getItem('userId') || '0')) {
      return (
        <button className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed">
          Your Listing
        </button>
      );
    }

    if (userRole === 'buyer') {
      if (!isConnected) {
        return (
          <button 
            onClick={connect}
            className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Connect Wallet to Buy
          </button>
        );
      }

      if (!seller_wallet) {
        return (
          <button 
            className="bg-gray-500 text-white px-4 py-2 rounded-lg cursor-not-allowed"
            title="Seller hasn't connected their wallet yet"
          >
            Currently Unavailable
          </button>
        );
      }

      return (
        <button 
          onClick={handlePurchase}
          disabled={isProcessing}
          className={`${
            isProcessing 
              ? 'bg-gray-400 cursor-wait' 
              : 'bg-green-700 hover:bg-green-600'
          } text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2`}
        >
          {isProcessing ? (
            <>
              <span className="animate-spin">⌛</span>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <span>{price.toFixed(2)} TON</span>
              <span>Buy Now</span>
            </>
          )}
        </button>
      );
    }

    return null;
  };

  const renderSellerInfo = () => {
    return (
      <div className="flex items-center justify-between text-gray-600 mb-2">
        <div className="flex items-center">
          <User className="h-4 w-4 mr-1" />
          <span className="text-sm">{seller_name}</span>
        </div>
        {seller_wallet ? (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            Wallet Connected
          </span>
        ) : (
          <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
            Wallet Not Connected
          </span>
        )}
      </div>
    );
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
        <div className="relative h-48">
          <img
            src={image_url || defaultImage}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute top-2 right-2 bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
            {category}
          </div>
        </div>
        
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          
          <div className="flex items-center text-gray-600 mb-2">
            <MapPin className="h-4 w-4 mr-1" />
            <span className="text-sm">{location}</span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <Package className="h-4 w-4 mr-1" />
            <span className="text-sm">{quantity} {unit}</span>
          </div>

          {renderSellerInfo()}

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{description}</p>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-green-700 font-semibold">
              <DollarSign className="h-4 w-4" />
              <span>{price.toFixed(2)} TON</span>
            </div>
            
            {renderActionButton()}
          </div>
        </div>
      </div>
      {TransactionReceiptModal()}
    </>
  );
}