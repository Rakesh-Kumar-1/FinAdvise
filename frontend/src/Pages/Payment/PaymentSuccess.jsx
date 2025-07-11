import React from 'react';
import { Check, Download, Share2 } from 'lucide-react';

export const PaymentSuccess = ({ product, paymentDetails, onClose }) => {
  const transactionId = `TXN${Date.now().toString().slice(-8)}`;
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className="text-center space-y-6">
      {/* Success Icon */}
      <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
        <Check className="w-8 h-8 text-green-600" />
      </div>

      {/* Success Message */}
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Successful!</h3>
        <p className="text-gray-600">
          Your payment has been processed successfully
        </p>
      </div>

      {/* Transaction Details */}
      <div className="bg-gray-50 rounded-xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Transaction ID:</span>
          <span className="font-medium text-gray-900">{transactionId}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Amount Paid:</span>
          <span className="font-bold text-xl text-green-600">₹{product.price}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Payment Method:</span>
          <span className="font-medium text-gray-900">{paymentDetails.method.name}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Date & Time:</span>
          <span className="font-medium text-gray-900">{currentDate}</span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-600">Status:</span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <Check className="w-4 h-4 mr-1" />
            Completed
          </span>
        </div>
      </div>

      {/* Product Details */}
      <div className="border rounded-xl p-4">
        <div className="flex items-center space-x-4">
          <img 
            src={product.image} 
            alt={product.name}
            className="w-12 h-12 object-cover rounded-lg"
          />
          <div className="flex-1 text-left">
            <h4 className="font-medium text-gray-900">{product.name}</h4>
            <p className="text-sm text-gray-600">Quantity: 1</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
          <Download className="w-4 h-4" />
          <span>Download Receipt</span>
        </button>
        
        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2">
          <Share2 className="w-4 h-4" />
          <span>Share Receipt</span>
        </button>
        
        <button 
          onClick={onClose}
          className="w-full text-blue-600 hover:text-blue-700 font-medium py-3 px-6 transition-colors duration-200"
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};