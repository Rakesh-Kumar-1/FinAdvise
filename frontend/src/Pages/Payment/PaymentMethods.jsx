import React from 'react';
import { CreditCard, Smartphone, Wallet, Building } from 'lucide-react';

export const PaymentMethods = ({ onMethodSelect }) => {
  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: 'CreditCard'
    },
    {
      id: 'upi',
      name: 'UPI',
      type: 'upi',
      icon: 'Smartphone'
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      type: 'wallet',
      icon: 'Wallet'
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      type: 'netbanking',
      icon: 'Building'
    }
  ];

  const getIcon = (iconName) => {
    switch (iconName) {
      case 'CreditCard':
        return <CreditCard className="w-6 h-6" />;
      case 'Smartphone':
        return <Smartphone className="w-6 h-6" />;
      case 'Wallet':
        return <Wallet className="w-6 h-6" />;
      case 'Building':
        return <Building className="w-6 h-6" />;
      default:
        return <CreditCard className="w-6 h-6" />;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Payment Method</h3>
      
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => onMethodSelect(method)}
          className="w-full p-4 border border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center space-x-4 group"
        >
          <div className="text-gray-600 group-hover:text-blue-600 transition-colors">
            {getIcon(method.icon)}
          </div>
          <div className="flex-1 text-left">
            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
              {method.name}
            </h4>
          </div>
        </button>
      ))}
    </div>
  );
};