import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Phone, Tag, IndianRupee, Calendar, Clock, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Toast from '../components/Toast';
import { API_URL } from '../utils/api';

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [formData, setFormData] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    promoCode: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [discount, setDiscount] = useState(0);
  const [discountType, setDiscountType] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const storedBooking = localStorage.getItem('bookit_current_booking');
    if (storedBooking) {
      try {
        const parsedData = JSON.parse(storedBooking);
        // Ensure all required properties exist to prevent undefined errors
        setBookingData({
          ...parsedData,
          title: parsedData.title || parsedData.experience?.title || 'Experience',
          category: parsedData.category || parsedData.experience?.category || 'Category',
          price: parsedData.price || parsedData.experience?.price || 0,
          image: parsedData.image || parsedData.experience?.image || ''
        });
      } catch (error) {
        console.error('Error parsing booking data:', error);
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleChange = (e) => {
    if (e.target.name === 'image') {
      const file = e.target.files[0];
      if (file) {
        setFormData({
          ...formData,
          image: file
        });
        
        // Create image preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    } else {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const applyPromoCode = () => {
    const code = formData.promoCode.toUpperCase().trim();

    if (!code) {
      setToast({ message: 'Please enter a promo code', type: 'error' });
      return;
    }

    if (code === 'SAVE10') {
      setDiscount(10);
      setDiscountType('percentage');
      setPromoApplied(true);
      setToast({ message: '10% discount applied!', type: 'success' });
    } else if (code === 'FLAT100') {
      setDiscount(100);
      setDiscountType('flat');
      setPromoApplied(true);
      setToast({ message: '₹100 discount applied!', type: 'success' });
    } else {
      setToast({ message: 'Invalid promo code', type: 'error' });
      setDiscount(0);
      setDiscountType('');
      setPromoApplied(false);
    }
  };

    const getBasePrice = () => {
    if (!bookingData) return 0;
    // Use the price from the experience card, with fallbacks
    return Number(bookingData.price || bookingData.experiencePrice || bookingData.experience?.price || 0);
  };

  const calculateTotal = () => {
    if (!bookingData) return 0;

    const basePrice = getBasePrice();
    let total = basePrice;

  if (promoApplied) {
    if (discountType === 'percentage') {
      total = basePrice - (basePrice * discount / 100);
    } else if (discountType === 'flat') {
      total = basePrice - discount;
    }
  }

  return Math.max(0, total);
};

  const handleConfirmBooking = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      setToast({ message: 'Please fix the errors in the form', type: 'error' });
      return;
    }

    try {
      // Create form data for multipart/form-data submission (for image upload)
      const formDataToSend = new FormData();

      // Experience / booking details
      formDataToSend.append('experienceId', bookingData.experienceId || bookingData.id || 0);
      formDataToSend.append('experienceTitle', bookingData.experienceTitle || bookingData.title || '');
      formDataToSend.append('experiencePrice', getBasePrice());
      formDataToSend.append('experienceCategory', bookingData.experienceCategory || bookingData.category || '');
      formDataToSend.append('selectedDate', bookingData.selectedDate || bookingData.selectedDate || '');
      formDataToSend.append('selectedSlot', bookingData.selectedSlot || bookingData.selectedSlot || '');
      formDataToSend.append('documentUrl', bookingData.uploadedImage || bookingData.documentUrl || '');

      // Customer details
      formDataToSend.append('customerName', formData.fullName);
      formDataToSend.append('customerEmail', formData.email);
      formDataToSend.append('customerPhone', formData.phone);

      // User id if logged in
      if (user?._id) formDataToSend.append('userId', user._id);

      // Payment / promo details
      formDataToSend.append('basePrice', getBasePrice());
      formDataToSend.append('finalPrice', calculateTotal());
      if (promoApplied) formDataToSend.append('discountApplied', formData.promoCode);

      // Single image field (multer expects 'image')
      if (formData.image) {
        formDataToSend.append('image', formData.image);
      }

      // Send data to backend
      const response = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        body: formDataToSend,
      });

      // Some backends may return an empty response body (204) or non-JSON content.
      // Guard parsing to avoid `Unexpected end of JSON input` errors.
      let data = null;
      try {
        const contentType = response.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
          data = await response.json();
        }
      } catch (parseErr) {
        console.warn('Could not parse JSON response from bookings API:', parseErr);
        data = null;
      }

      if (!response.ok) {
        // Prefer server-provided message when available
        const msg = data?.message || `Failed to create booking (status ${response.status})`;
        throw new Error(msg);
      }

      // Show success message
      setToast({ message: 'Booking confirmed! Check your email for confirmation.', type: 'success' });

      // Clear local storage
      localStorage.removeItem('bookit_current_booking');

      // Redirect to home page after a short delay so user sees the confirmation toast
      setTimeout(() => {
        navigate('/', { replace: true });
        window.scrollTo(0, 0);
      }, 2000);
    } catch (error) {
      console.error('Error creating booking:', error);
      setToast({ message: error.message || 'Failed to create booking', type: 'error' });
    }
  };

  if (!bookingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Booking Summary</h2>

              <div className="flex gap-4 mb-4">
                {bookingData.image ? (
                  <img
                    src={bookingData.image}
                    alt={bookingData.title}
                    className="w-24 h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-24 h-24 bg-blue-100 rounded-lg flex items-center justify-center">
                    <ImageIcon className="w-12 h-12 text-blue-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-gray-900">{bookingData.title}</h3>
                  <p className="text-sm text-gray-600">{bookingData.category}</p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-gray-700">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(bookingData.selectedDate).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700">
                  <Clock className="w-4 h-4" />
                  <span>{bookingData.selectedSlot}</span>
                </div>
              </div>

              {bookingData.uploadedImage && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" />
                    Uploaded Document
                  </p>
                  <img
                    src={bookingData.uploadedImage}
                    alt="Uploaded document"
                    className="w-32 h-32 object-cover rounded-lg border-2 border-gray-200"
                  />
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Customer Details</h2>

              <form onSubmit={handleConfirmBooking} className="space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.fullName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter your full name"
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.email ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="you@example.com"
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        errors.phone ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="10-digit phone number"
                      maxLength="10"
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                  )}
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Upload Image (Optional)
                  </label>
                  <div className="mt-1 flex items-center gap-4">
                    <label className="flex-1 cursor-pointer">
                      <div className="relative flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-blue-500 transition-colors">
                        <input
                          type="file"
                          name="image"
                          accept="image/*"
                          onChange={handleChange}
                          className="sr-only"
                        />
                        <div className="text-center">
                          <ImageIcon className="mx-auto h-8 w-8 text-gray-400" />
                          <p className="mt-1 text-xs text-gray-500">Click to upload an image</p>
                        </div>
                      </div>
                    </label>
                    
                    {imagePreview && (
                      <div className="relative h-20 w-20 rounded-md overflow-hidden">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="h-full w-full object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setImagePreview(null);
                            setFormData({...formData, image: null});
                          }}
                          className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/3 -translate-y-1/3"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-900 text-white py-3 rounded-lg hover:bg-blue-800 transition-colors font-semibold"
                >
                  Confirm Booking
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Price Details</h2>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between text-gray-700">
                  <span>Base Price</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-4 h-4" />
                    <span>{getBasePrice().toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {promoApplied && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount ({formData.promoCode})</span>
                    <span>
                      - {discountType === 'percentage' ? `${discount}%` : `₹${discount}`}
                    </span>
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-blue-900">
                  <span>Total Amount</span>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-5 h-5" />
                    <span>{calculateTotal().toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Have a Promo Code?
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                      type="text"
                      name="promoCode"
                      value={formData.promoCode}
                      onChange={handleChange}
                      className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                      placeholder="Enter code"
                      disabled={promoApplied}
                    />
                  </div>
                  <button
                    type="button"
                    onClick={applyPromoCode}
                    disabled={promoApplied}
                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                      promoApplied
                        ? 'bg-green-500 text-white cursor-not-allowed'
                        : 'bg-blue-900 text-white hover:bg-blue-800'
                    }`}
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  <p>Try: SAVE10 (10% off) or FLAT100 (₹100 off)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
