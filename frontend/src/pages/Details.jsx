import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, IndianRupee, CheckCircle } from 'lucide-react';
import experiencesData from '../data/experiences.json';
import UploadImage from '../components/UploadImage';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export default function Details() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [experience, setExperience] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedSlot, setSelectedSlot] = useState('');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const exp = experiencesData.find(e => e.id === parseInt(id));
    if (exp) {
      setExperience(exp);
    }
  }, [id]);

  const handleBookNow = async () => {
    if (!user) {
      setToast({ message: 'Please log in to make a booking', type: 'error' });
      navigate('/login');
      return;
    }

    if (!selectedDate) {
      setToast({ message: 'Please select a date', type: 'error' });
      return;
    }

    if (!selectedSlot) {
      setToast({ message: 'Please select a time slot', type: 'error' });
      return;
    }

    // Validate experience data is present
    if (!experience) {
      setToast({ message: 'Experience details not found', type: 'error' });
      return;
    }

    // Prepare complete booking data
    const bookingData = {
      // Experience details from the card
      id: experience.id,
      title: experience.title,
      price: experience.price,
      category: experience.category,
      image: experience.image,
      duration: experience.duration,
      included: experience.included,
      description: experience.description,

      // Selected booking details from form
      selectedDate,
      selectedSlot,
      documentUrl: uploadedImage || '',

      // Original data needed for backend
      experienceId: experience.id,
      experienceTitle: experience.title,
      experiencePrice: experience.price,
      experienceCategory: experience.category,

      // Customer details (some might be updated in checkout)
      customerName: user.name || '',
      customerEmail: user.email || '',
      customerPhone: user.phone || '',
      userId: user._id,

      // Additional details
      uploadTime: new Date().toISOString(),
      bookingStatus: 'pending'
    };

    // Persist to localStorage for Checkout page
    localStorage.setItem('bookit_current_booking', JSON.stringify(bookingData));
    setToast({ message: 'Proceeding to checkout…', type: 'success' });
    setTimeout(() => {
      navigate('/checkout', { replace: true });
    }, 700);
  };

  if (!experience) {
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
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={experience.image}
              alt={experience.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="px-4 py-2 bg-white/90 backdrop-blur-sm text-blue-900 text-sm font-semibold rounded-full">
                {experience.category}
              </span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
              <h1 className="text-4xl font-bold text-white mb-2">{experience.title}</h1>
              <div className="flex items-center gap-1 text-yellow-400">
                <IndianRupee className="w-6 h-6" />
                <span className="text-3xl font-bold">{experience.price.toLocaleString('en-IN')}</span>
                <span className="text-white text-lg ml-2">per person</span>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Experience</h2>
                <p className="text-gray-600 leading-relaxed mb-6">{experience.description}</p>

                <div className="flex items-center gap-2 text-gray-700 mb-4">
                  <Clock className="w-5 h-5 text-blue-900" />
                  <span className="font-semibold">Duration:</span>
                  <span>{experience.duration}</span>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">What's Included:</h3>
                  <ul className="space-y-2">
                    {experience.included.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Calendar className="inline w-4 h-4 mr-2" />
                    Select Date
                  </label>
                  <select
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Choose a date</option>
                    {experience.availableDates.map((date, index) => (
                      <option key={index} value={date}>
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    <Clock className="inline w-4 h-4 mr-2" />
                    Select Time Slot
                  </label>
                  <div className="space-y-2">
                    {experience.slots.map((slot, index) => (
                      <label
                        key={index}
                        className={`flex items-center p-4 border-2 rounded-lg cursor-pointer transition-all ${
                          selectedSlot === slot
                            ? 'border-blue-900 bg-blue-50'
                            : 'border-gray-200 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot}
                          checked={selectedSlot === slot}
                          onChange={(e) => setSelectedSlot(e.target.value)}
                          className="mr-3 w-4 h-4 text-blue-900"
                        />
                        <span className="font-medium text-gray-900">{slot}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-3">
                    Upload Travel Document / ID
                  </label>
                  <UploadImage onImageUpload={setUploadedImage} currentImage={uploadedImage} />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a photo of your ID or travel document for verification
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-center sm:text-left">
                  <p className="text-sm text-gray-600">Total Price</p>
                  <div className="flex items-center gap-1">
                    <IndianRupee className="w-6 h-6 text-blue-900" />
                    <span className="text-3xl font-bold text-blue-900">
                      {experience.price.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleBookNow}
                  className="w-full sm:w-auto px-8 py-4 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold text-lg shadow-lg hover:shadow-xl"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
