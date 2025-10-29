import { MapPin, Clock, IndianRupee } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function ExperienceCard({ experience }) {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <div className="relative h-48 overflow-hidden">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3">
          <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-900 text-xs font-semibold rounded-full">
            {experience.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-1">
          {experience.title}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {experience.shortDescription}
        </p>

        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{experience.duration}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <IndianRupee className="w-5 h-5 text-blue-900" />
            <span className="text-2xl font-bold text-blue-900">
              {experience.price.toLocaleString('en-IN')}
            </span>
          </div>

          <Link
            to={`/details/${experience.id}`}
            className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors text-sm font-medium"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}
