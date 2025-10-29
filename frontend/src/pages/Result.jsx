import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar, Clock, IndianRupee, User, Mail, Phone, Tag, Home, RefreshCw } from 'lucide-react';

export default function Result() {
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    const finalBooking = localStorage.getItem('bookit_final_booking');

    if (finalBooking) {
      const bookingData = JSON.parse(finalBooking);
      setBooking(bookingData);

      const id = 'BK' + Math.random().toString(36).substr(2, 9).toUpperCase();
      setBookingId(id);

      localStorage.removeItem('bookit_current_booking');
      localStorage.removeItem('bookit_final_booking');
    } else {
      navigate('/');
    }
  }, [navigate]);

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4 animate-bounce">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Booking Successful!</h1>
          <p className="text-lg text-gray-600">Your adventure awaits</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-6">
          <div className="border-b border-gray-200 pb-6 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-600">Booking ID</span>
              <span className="text-lg font-bold text-blue-900">{bookingId}</span>
            </div>
            <p className="text-xs text-gray-500">
              Please save this booking ID for your records
            </p>
          </div>

          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Experience Details</h2>
            <div className="flex gap-4 mb-4">
              <img
                src={booking.experience.image}
                alt={booking.experience.title}
                className="w-32 h-32 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 mb-1">
                  {booking.experience.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{booking.experience.category}</p>
                <p className="text-sm text-gray-700">{booking.experience.duration}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700">
                <Calendar className="w-4 h-4 text-blue-900" />
                <div>
                  <p className="font-medium">Date</p>
                  <p>{new Date(booking.selectedDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  })}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="w-4 h-4 text-blue-900" />
                <div>
                  <p className="font-medium">Time Slot</p>
                  <p>{booking.selectedSlot}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Customer Information</h2>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-3 text-gray-700">
                <User className="w-4 h-4 text-blue-900" />
                <div>
                  <p className="font-medium">Full Name</p>
                  <p>{booking.customerDetails.fullName}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Mail className="w-4 h-4 text-blue-900" />
                <div>
                  <p className="font-medium">Email</p>
                  <p>{booking.customerDetails.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <Phone className="w-4 h-4 text-blue-900" />
                <div>
                  <p className="font-medium">Phone</p>
                  <p>{booking.customerDetails.phone}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-gray-700">
                <span>Base Price</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-4 h-4" />
                  <span>{booking.experience.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {booking.promoCode && (
                <div className="flex justify-between text-green-600 font-medium">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4" />
                    <span>Discount ({booking.promoCode})</span>
                  </div>
                  <span>
                    - {booking.discountType === 'percentage'
                      ? `${booking.discount}%`
                      : `₹${booking.discount}`}
                  </span>
                </div>
              )}

              <div className="border-t border-gray-200 pt-2 flex justify-between text-lg font-bold text-blue-900">
                <span>Total Paid</span>
                <div className="flex items-center gap-1">
                  <IndianRupee className="w-5 h-5" />
                  <span>{booking.totalPrice.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-blue-900 mb-2">What's Next?</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li>• A confirmation email has been sent to {booking.customerDetails.email}</li>
            <li>• Please carry a valid ID and the uploaded document</li>
            <li>• Arrive 15 minutes before your scheduled time</li>
            <li>• Contact support for any changes or queries</li>
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>
          <button
            onClick={() => navigate('/')}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white text-blue-900 border-2 border-blue-900 rounded-lg hover:bg-blue-50 transition-colors font-semibold"
          >
            <RefreshCw className="w-5 h-5" />
            Book Another Experience
          </button>
        </div>

        <p className="text-center text-gray-500 text-sm mt-8">
          Thank you for choosing BookIt for your travel adventures!
        </p>
      </div>
    </div>
  );
}
