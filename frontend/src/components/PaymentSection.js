import { useState } from 'react';
import { CreditCard, Heart, Flower2, Plane } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;
const RAZORPAY_KEY = process.env.REACT_APP_RAZORPAY_KEY_ID;

const donationAmounts = [101, 251, 501, 1001, 2101, 5001];

const poojaOptions = [
  { name: 'Rudrabhishek', price: 1100, desc: 'Sacred bathing ritual of Shiva Lingam' },
  { name: 'Maha Aarti', price: 501, desc: 'Grand evening aarti ceremony' },
  { name: 'Laghu Rudra', price: 2100, desc: 'Condensed version of Rudra Yagna' },
  { name: 'Bilva Patra Puja', price: 351, desc: 'Offering of sacred Bilva leaves' },
  { name: 'Abhishekam', price: 751, desc: 'Holy water & milk offering to Shivalinga' },
];

const travelPackages = [
  { name: 'Temple Darshan Package', price: 2999, desc: 'Guided temple visit with VIP access', duration: '1 Day' },
  { name: 'Spiritual Retreat', price: 7999, desc: 'Temple visit + meditation + stay', duration: '2 Days' },
  { name: 'Complete Pilgrimage Tour', price: 14999, desc: 'Full pilgrimage with travel & accommodation', duration: '3 Days' },
];

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

async function initiatePayment({ amount, temple, paymentType, description, onSuccess, onError }) {
  try {
    const { data } = await axios.post(`${API}/payments/create-order`, {
      amount: amount * 100,
      currency: 'INR',
      temple_id: temple.id,
      payment_type: paymentType,
      description: description,
    });

    // Demo mode - simulate payment flow
    if (data.demo_mode) {
      const confirmed = window.confirm(
        `[DEMO MODE] Razorpay Payment\n\n` +
        `Amount: ₹${amount}\n` +
        `Temple: ${temple.name}\n` +
        `Type: ${paymentType}\n` +
        `Description: ${description}\n\n` +
        `This is a demo transaction. In production, a real Razorpay checkout popup would appear here.\n\n` +
        `Click OK to simulate successful payment.`
      );
      if (confirmed) {
        await axios.post(`${API}/payments/verify`, {
          razorpay_order_id: data.order_id,
          razorpay_payment_id: `demo_pay_${Date.now()}`,
          razorpay_signature: 'demo_signature',
        });
        onSuccess?.({ demo: true });
      }
      return;
    }

    // Real Razorpay mode
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      onError?.('Failed to load payment gateway');
      return;
    }

    const options = {
      key: data.key_id || RAZORPAY_KEY,
      amount: data.amount,
      currency: data.currency,
      name: '12 Jyotirlingas',
      description: description,
      order_id: data.order_id,
      handler: async (response) => {
        try {
          await axios.post(`${API}/payments/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature,
          });
          onSuccess?.(response);
        } catch (err) {
          onError?.('Payment verification failed');
        }
      },
      prefill: {
        name: '',
        email: '',
        contact: '',
      },
      theme: {
        color: '#F97316',
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    onError?.(err?.response?.data?.detail || 'Payment initiation failed');
  }
}

export const PaymentSection = ({ temple }) => {
  const [selectedDonation, setSelectedDonation] = useState(501);
  const [customDonation, setCustomDonation] = useState('');
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (amount, type, description) => {
    setProcessing(true);
    setPaymentStatus(null);
    await initiatePayment({
      amount,
      temple,
      paymentType: type,
      description: `${description} - ${temple.name}`,
      onSuccess: () => {
        setPaymentStatus({ type: 'success', message: 'Payment successful! Thank you for your devotion.' });
        setProcessing(false);
      },
      onError: (msg) => {
        setPaymentStatus({ type: 'error', message: msg });
        setProcessing(false);
      },
    });
    setProcessing(false);
  };

  return (
    <section className="py-16 bg-saffron-50" data-testid="payment-section">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="font-cormorant text-3xl sm:text-4xl font-bold tracking-tighter text-temple-slate text-center mb-4">
          Services & Bookings
        </h2>
        <p className="font-outfit text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Book pooja, make donations, or plan your travel to {temple.name}. All payments are processed securely via Razorpay.
        </p>

        {paymentStatus && (
          <div
            className={`max-w-2xl mx-auto mb-8 p-4 text-center font-outfit text-sm ${
              paymentStatus.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}
            data-testid="payment-status"
          >
            {paymentStatus.message}
          </div>
        )}

        <Tabs defaultValue="donation" className="max-w-4xl mx-auto" data-testid="payment-tabs">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="donation" data-testid="donation-tab">
              <Heart className="w-4 h-4 mr-2" />
              Donation
            </TabsTrigger>
            <TabsTrigger value="pooja" data-testid="pooja-tab">
              <Flower2 className="w-4 h-4 mr-2" />
              Pooja Booking
            </TabsTrigger>
            <TabsTrigger value="travel" data-testid="travel-tab">
              <Plane className="w-4 h-4 mr-2" />
              Travel Packages
            </TabsTrigger>
          </TabsList>

          {/* Donation Tab */}
          <TabsContent value="donation" data-testid="donation-content">
            <div className="bg-white border border-orange-100/50 p-8">
              <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-2">
                Make a Donation
              </h3>
              <p className="font-outfit text-sm text-gray-600 mb-6">
                Your contribution supports the maintenance and spiritual activities of {temple.name}.
              </p>

              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-6">
                {donationAmounts.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => { setSelectedDonation(amt); setCustomDonation(''); }}
                    className={`py-3 px-2 font-outfit text-sm font-medium border transition-colors ${
                      selectedDonation === amt && !customDonation
                        ? 'bg-saffron-500 text-white border-saffron-500'
                        : 'bg-white text-temple-slate border-orange-200 hover:border-saffron-400'
                    }`}
                    data-testid={`donation-amount-${amt}`}
                  >
                    ₹{amt}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-4 mb-6">
                <span className="font-outfit text-sm text-gray-600">Custom:</span>
                <div className="relative flex-1 max-w-xs">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-outfit">₹</span>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={customDonation}
                    onChange={(e) => { setCustomDonation(e.target.value); setSelectedDonation(0); }}
                    className="w-full pl-8 pr-4 py-2 border border-orange-200 font-outfit text-sm focus:outline-none focus:border-saffron-500"
                    data-testid="custom-donation-input"
                  />
                </div>
              </div>

              <button
                onClick={() => {
                  const amt = customDonation ? parseInt(customDonation) : selectedDonation;
                  if (amt >= 1) handlePayment(amt, 'donation', 'Donation');
                }}
                disabled={processing}
                className="w-full bg-saffron-500 hover:bg-saffron-600 text-white py-3 font-outfit font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                data-testid="donate-button"
              >
                <CreditCard className="w-5 h-5" />
                {processing ? 'Processing...' : `Donate ₹${customDonation || selectedDonation}`}
              </button>
            </div>
          </TabsContent>

          {/* Pooja Booking Tab */}
          <TabsContent value="pooja" data-testid="pooja-content">
            <div className="bg-white border border-orange-100/50 p-8">
              <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-2">
                Book a Pooja
              </h3>
              <p className="font-outfit text-sm text-gray-600 mb-6">
                Book sacred rituals and ceremonies at {temple.name}. A priest will perform the pooja on your behalf.
              </p>

              <div className="space-y-4">
                {poojaOptions.map((pooja) => (
                  <div
                    key={pooja.name}
                    className="flex items-center justify-between p-4 border border-orange-100/50 hover:border-saffron-300 transition-colors"
                    data-testid={`pooja-option-${pooja.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div>
                      <div className="font-cormorant text-lg font-bold text-temple-slate">{pooja.name}</div>
                      <div className="font-outfit text-sm text-gray-600">{pooja.desc}</div>
                    </div>
                    <button
                      onClick={() => handlePayment(pooja.price, 'pooja', `${pooja.name} Booking`)}
                      disabled={processing}
                      className="bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-2 font-outfit text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                      data-testid={`book-pooja-${pooja.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      ₹{pooja.price}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* Travel Packages Tab */}
          <TabsContent value="travel" data-testid="travel-packages-content">
            <div className="bg-white border border-orange-100/50 p-8">
              <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-2">
                Travel Packages
              </h3>
              <p className="font-outfit text-sm text-gray-600 mb-6">
                Book curated travel packages to {temple.name} with guided tours, stay, and meals.
              </p>

              <div className="space-y-4">
                {travelPackages.map((pkg) => (
                  <div
                    key={pkg.name}
                    className="flex items-center justify-between p-4 border border-orange-100/50 hover:border-saffron-300 transition-colors"
                    data-testid={`travel-package-${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <div>
                      <div className="font-cormorant text-lg font-bold text-temple-slate">{pkg.name}</div>
                      <div className="font-outfit text-sm text-gray-600">{pkg.desc}</div>
                      <div className="font-outfit text-xs text-saffron-600 mt-1">Duration: {pkg.duration}</div>
                    </div>
                    <button
                      onClick={() => handlePayment(pkg.price, 'travel', `${pkg.name} Booking`)}
                      disabled={processing}
                      className="bg-saffron-500 hover:bg-saffron-600 text-white px-6 py-2 font-outfit text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap disabled:opacity-50"
                      data-testid={`book-travel-${pkg.name.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <CreditCard className="w-4 h-4" />
                      ₹{pkg.price.toLocaleString('en-IN')}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
};
