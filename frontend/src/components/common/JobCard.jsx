import { MapPin, Briefcase, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const JobCard = ({ title, location, department, slug }) => {
  return (
    <Link to={`/career/${slug}`} className="block h-full">
      <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all border-2 border-gray-100 hover:border-accent group cursor-pointer h-full">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            {/* Job Title */}
            <h3 className="text-xl font-bold text-gray-900 mb-4 group-hover:text-accent transition-colors">
              {title}
            </h3>

            {/* Job Info */}
            <div className="space-y-2">
              {/* Location */}
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-4 h-4 text-accent" />
                <span className="text-sm">{location}</span>
              </div>

              {/* Department */}
              <div className="flex items-center gap-2 text-gray-600">
                <Briefcase className="w-4 h-4 text-accent" />
                <span className="text-sm">{department}</span>
              </div>
            </div>
          </div>
          {/* Arrow Icon */}
          <div className="ml-4">
            <div className="w-10 h-10 bg-gray-100 group-hover:bg-accent rounded-full flex items-center justify-center transition-colors">
              <ArrowRight className="w-5 h-5 text-gray-600 group-hover:text-white transition-colors" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default JobCard;
