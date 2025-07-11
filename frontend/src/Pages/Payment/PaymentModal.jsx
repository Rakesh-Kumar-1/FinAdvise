import React, { useState } from 'react';
import { X, ArrowLeft } from 'lucide-react';
import { PaymentMethods } from './PaymentMethods';
import { PaymentForm } from './PaymentForm';
import { PaymentSuccess } from './PaymentSuccess';

export const PaymentModal = ({ isOpen, onClose, product }) => {
  const [currentStep, setCurrentStep] = useState('methods'); // 'methods' | 'form' | 'success'
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setCurrentStep('form');
  };

  const handlePaymentSubmit = (details) => {
    setPaymentDetails(details);
    setCurrentStep('success');
  };

  const handleClose = () => {
    setCurrentStep('methods');
    setSelectedMethod(null);
    setPaymentDetails(null);
    onClose();
  };

  const handleBack = () => {
    if (currentStep === 'form') {
      setCurrentStep('methods');
    } else if (currentStep === 'success') {
      setCurrentStep('form');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {currentStep !== 'methods' && (
              <button
                onClick={handleBack}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <h2 className="text-xl font-bold text-gray-900">
              {currentStep === 'methods' && 'Payment Method'}
              {currentStep === 'form' && 'Payment Details'}
              {currentStep === 'success' && 'Payment Successful'}
            </h2>
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Product Summary */}
        <div className="p-6 bg-gray-50 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <img 
              src={product.image} 
              alt={product.name}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-2xl font-bold text-gray-900">₹{product.price}</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {currentStep === 'methods' && (
            <PaymentMethods onMethodSelect={handleMethodSelect} />
          )}
          
          {currentStep === 'form' && selectedMethod && (
            <PaymentForm
              method={selectedMethod}
              product={product}
              onSubmit={handlePaymentSubmit}
            />
          )}
          
          {currentStep === 'success' && paymentDetails && (
            <PaymentSuccess
              product={product}
              paymentDetails={paymentDetails}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
};