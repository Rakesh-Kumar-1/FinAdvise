import React, { useState } from 'react';
import { CreditCard, Smartphone, Wallet, Building, Lock, ArrowLeft, Check } from 'lucide-react';

const PaymentGateway = ({ advisor, date, time, onPaymentSuccess, onBack,price }) => {
  const [currentStep, setCurrentStep] = useState('methods'); // 'methods' | 'form' | 'success'
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [loading, setLoading] = useState(false);
  const [transactionIdState, setTransactionId] = useState('');
  const [formData, setFormData] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: '',
    upiId: '',
    email: '',
    phone: ''
  });

  const consultationFee = price ||999; // You can make this dynamic based on advisor

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      type: 'card',
      icon: CreditCard
    },
    {
      id: 'upi',
      name: 'UPI',
      type: 'upi',
      icon: Smartphone
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      type: 'wallet',
      icon: Wallet
    },
    {
      id: 'netbanking',
      name: 'Net Banking',
      type: 'netbanking',
      icon: Building
    }
  ];

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
    setCurrentStep('form');
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Generate transaction ID
    const txnId = `TXN${Date.now().toString().slice(-8)}`;
    
    // Store transaction ID for success screen
    setTransactionId(txnId);

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));


    setCurrentStep('success');
    setLoading(false);

    // Automatically send transaction ID to AdvisorDetails and trigger meeting setup
    setTimeout(() => {
      onBack(selectedMethod);
      onPaymentSuccess(transactionIdState);
    }, 4000); // Small delay to show success screen briefly
  };


  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="payment-gateway-overlay">
      <div className="payment-gateway-modal">
        {/* Header */}
        <div className="payment-header">
          <div className="payment-header-left">
            {currentStep !== 'methods' && (
              <button
                onClick={() => currentStep === 'form' ? setCurrentStep('methods') : onBack()}
                className="back-button"
              >
                <ArrowLeft size={20} />
              </button>
            )}
            <h2>
              {currentStep === 'methods' && 'Select Payment Method'}
              {currentStep === 'form' && 'Payment Details'}
              {currentStep === 'success' && 'Payment Successful'}
            </h2>
          </div>
          <button onClick={onBack} className="close-button">×</button>
        </div>

        {/* Booking Summary */}
        <div className="booking-summary">
          <div className="advisor-info">
            <h3>{advisor.fullname}</h3>
            <p>Financial Advisor</p>
          </div>
          <div className="booking-details">
            <div className="detail-item">
              <span>Date:</span>
              <span>{formatDate(date)}</span>
            </div>
            <div className="detail-item">
              <span>Time:</span>
              <span>{formatTime(time)}</span>
            </div>
            <div className="detail-item total">
              <span>Consultation Fee:</span>
              <span>₹{consultationFee}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        {currentStep === 'methods' && (
          <div className="payment-methods">
            <h3>Choose Payment Method</h3>
            <div className="methods-grid">
              {paymentMethods.map((method) => {
                const IconComponent = method.icon;
                return (
                  <button
                    key={method.id}
                    onClick={() => handleMethodSelect(method)}
                    className="method-card"
                  >
                    <IconComponent size={24} />
                    <span>{method.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Payment Form */}
        {currentStep === 'form' && selectedMethod && (
          <div className="payment-form-container">
            <h3>Pay ₹{consultationFee} using {selectedMethod.name}</h3>
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              {/* Card Payment Fields */}
              {selectedMethod.type === 'card' && (
                <div className="form-section">
                  <div className="form-group">
                    <label>Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                </div>
              )}

              {/* UPI Payment Fields */}
              {selectedMethod.type === 'upi' && (
                <div className="form-section">
                  <div className="form-group">
                    <label>UPI ID</label>
                    <input
                      type="text"
                      name="upiId"
                      value={formData.upiId}
                      onChange={handleInputChange}
                      placeholder="yourname@upi"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Common Contact Fields */}
              <div className="form-section">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 9876543210"
                    required
                  />
                </div>
              </div>

              {/* Security Notice */}
              <div className="security-notice">
                <Lock size={16} />
                <span>Your payment information is secure and encrypted</span>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="pay-button"
              >
                {loading ? (
                  <div className="loading-spinner" />
                ) : (
                  <>
                    <Lock size={16} />
                    Pay ₹{consultationFee}
                  </>
                )}
              </button>
            </form>
          </div>
        )}

        {/* Success Screen */}
        {currentStep === 'success' && (
          <div className="payment-success">
            <div className="success-icon">
              <Check size={48} />
            </div>
            <h3>Payment Successful!</h3>
            <p>Your consultation has been booked successfully</p>
            
            <div className="success-details">
              <p>Amount: ₹{consultationFee}</p>
              <p>Date: {formatDate(date)}</p>
              <p>Time: {formatTime(time)}</p>
              <p>Advisor: {advisor.fullname}</p>
              <p>Transaction ID: {transactionIdState}</p>
            </div>
            
            {/* Manual Continue Button */}
            <div className="success-actions">
              <button 
                className="close-btn"
                onClick={onBack}
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentGateway;