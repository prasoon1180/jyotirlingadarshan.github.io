import { Link } from 'react-router-dom';
import { MapPin, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const allTemples = [
  { id: 'somnath', name: 'Somnath', state: 'Gujarat' },
  { id: 'mallikarjuna', name: 'Mallikarjuna', state: 'Andhra Pradesh' },
  { id: 'mahakaleshwar', name: 'Mahakaleshwar', state: 'Madhya Pradesh' },
  { id: 'omkareshwar', name: 'Omkareshwar', state: 'Madhya Pradesh' },
  { id: 'kedarnath', name: 'Kedarnath', state: 'Uttarakhand' },
  { id: 'bhimashankar', name: 'Bhimashankar', state: 'Maharashtra' },
  { id: 'kashi-vishwanath', name: 'Kashi Vishwanath', state: 'Uttar Pradesh' },
  { id: 'trimbakeshwar', name: 'Trimbakeshwar', state: 'Maharashtra' },
  { id: 'vaidyanath', name: 'Vaidyanath', state: 'Jharkhand' },
  { id: 'nageshwar', name: 'Nageshwar', state: 'Gujarat' },
  { id: 'rameshwaram', name: 'Rameshwaram', state: 'Tamil Nadu' },
  { id: 'grishneshwar', name: 'Grishneshwar', state: 'Maharashtra' },
];

export const OtherJyotirlingas = ({ currentTempleId }) => {
  const otherTemples = allTemples.filter((t) => t.id !== currentTempleId);

  return (
    <section className="py-16 bg-temple-slate" data-testid="other-jyotirlingas-section">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="font-cormorant text-3xl sm:text-4xl font-bold tracking-tighter text-white text-center mb-4">
          Explore Other Sacred Jyotirlingas
        </h2>
        <p className="font-outfit text-center text-gray-300 mb-10 max-w-2xl mx-auto">
          Continue your spiritual journey across India by visiting the other sacred Jyotirlinga shrines of Lord Shiva.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {otherTemples.map((temple, index) => (
            <motion.div
              key={temple.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              viewport={{ once: true }}
            >
              <Link
                to={`/temple/${temple.id}`}
                className="block p-4 bg-white/5 border border-white/10 hover:bg-white/10 hover:border-saffron-500/50 transition-all group text-center"
                data-testid={`other-temple-${temple.id}`}
              >
                <div className="font-cormorant text-lg font-bold text-white group-hover:text-saffron-400 transition-colors">
                  {temple.name}
                </div>
                <div className="font-outfit text-xs text-gray-400 flex items-center justify-center gap-1 mt-1">
                  <MapPin className="w-3 h-3" />
                  {temple.state}
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-saffron-400 hover:text-saffron-300 font-outfit text-sm transition-colors"
            data-testid="view-all-temples-link"
          >
            View All 12 Jyotirlingas on Map
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};
