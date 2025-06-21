import React, { useState } from 'react';
import axios from 'axios';

const User_payments = () => {
  const [amount, setAmount] = useState('');

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const payNow = async () => {
    if (!amount) {
      alert('Please enter an amount');
      return;
    }

    const res = await loadRazorpayScript();
    if (!res) {
      alert('Razorpay SDK failed to load. Are you online?');
      return;
    }

    try {
      // Create order using axios
      const response = await axios.post('http://localhost:8080/user/create-order', {
        amount,
        currency: 'INR',
        receipt: 'receipt#1',
        notes: {}
      });

      const order = response.data;

      const options = {
        key: 'rzp_test_Y2wy8t1wD1AFaA', // Replace with your Razorpay key_id
        amount: order.amount,
        currency: order.currency,
        name: 'Your Company Name',
        description: 'Test Transaction',
        order_id: order.id,
        prefill: {
          name: 'Your Name',
          email: 'your.email@example.com',
          contact: '9999999999'
        },
        theme: {
          color: '#F37254'
        },
        handler: async function (response) {
          try {
            const verificationRes = await axios.post('http://localhost:8080/user/verify-payment', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature
            });

            if (verificationRes.data.status === 'ok') {
              window.location.href = 'http://localhost:8080/user/payment-success';
            } else {
              alert('Payment verification failed');
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Error verifying payment');
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating payment order');
    }
  };

  return (
    <div>
      <h1>Razorpay Payment Gateway Integration</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label htmlFor="amount">Amount:</label>
        <input
          type="number"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <button type="button" onClick={payNow}>Pay Now</button>
      </form>
    </div>
  );
};

export default User_payments;
