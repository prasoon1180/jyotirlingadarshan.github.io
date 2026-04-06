import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MapComponent } from '@/components/MapComponent';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const Homepage = () => {
  const [temples, setTemples] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemples = async () => {
      try {
        const response = await axios.get(`${API}/jyotirlingas`);
        setTemples(response.data);
      } catch (error) {
        console.error('Error fetching temples:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemples();
  }, []);

  return (
    <div className="min-h-screen" data-testid="homepage">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1759998756869-c8eeb78f49e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxTaGl2YSUyMHN0YXR1ZSUyMEluZGlhJTIwc3Vuc2V0fGVufDB8fHx8MTc3NTUwNTI4MHww&ixlib=rb-4.1.0&q=85"
            alt="Shiva statue at sunset"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/40 to-transparent"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-6" data-testid="hero-title">
              The 12 Sacred Jyotirlingas
            </h1>
            <p className="font-outfit text-base sm:text-lg mb-8 text-gray-200">
              Embark on a spiritual journey to the divine abodes of Lord Shiva. Discover the sacred Jyotirlingas spread across India, each with its unique history, mythology, and spiritual significance.
            </p>
            <a
              href="#temples"
              className="inline-flex items-center space-x-2 bg-saffron-500 hover:bg-saffron-600 text-white px-8 py-3 font-outfit font-medium transition-all hover:-translate-y-0.5 shadow-lg hover:shadow-xl"
              data-testid="explore-temples-button"
            >
              <span>Explore Temples</span>
              <ArrowRight className="w-5 h-5" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 md:py-32 bg-background" data-testid="about-section">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-temple-slate mb-6">
              What are Jyotirlingas?
            </h2>
            <p className="font-outfit text-base text-gray-700 leading-relaxed mb-6">
              A Jyotirlinga or Jyotirling is a devotional representation of Lord Shiva. The word "Jyotirlinga" is derived from two Sanskrit words: Jyoti (light) and Linga (sign). According to Hindu scriptures, there are twelve sacred sites in India where Lord Shiva manifested himself as a fiery column of light, transcending both the heavens and the earth.
            </p>
            <p className="font-outfit text-base text-gray-700 leading-relaxed">
              These twelve Jyotirlingas are considered the most sacred abodes of Shiva, and visiting them is believed to bring spiritual merit and liberation. Each temple has its own unique legend, history, and architectural significance, attracting millions of devotees annually.
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-24 md:py-32 bg-temple-slate" data-testid="map-section">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white text-center mb-12">
            Locate the 12 Jyotirlingas
          </h2>
          <div className="bg-white p-4 shadow-2xl">
            <MapComponent temples={temples} />
          </div>
        </div>
      </section>

      {/* Temples Grid Section */}
      <section id="temples" className="py-24 md:py-32 bg-background" data-testid="temples-section">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-temple-slate text-center mb-16">
            Explore All Temples
          </h2>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {temples.map((temple, index) => (
                <motion.div
                  key={temple.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  data-testid={`temple-card-${temple.id}`}
                >
                  <Link to={`/temple/${temple.id}`}>
                    <div className="group bg-white border border-orange-100/50 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={temple.image_url}
                          alt={temple.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-2">
                          {temple.name}
                        </h3>
                        <div className="flex items-center text-sm font-outfit text-gray-600 mb-3">
                          <MapPin className="w-4 h-4 mr-1 text-saffron-500" />
                          {temple.location.state}
                        </div>
                        <p className="font-outfit text-sm text-gray-600 line-clamp-2 mb-4">
                          {temple.description}
                        </p>
                        <div className="flex items-center text-sm font-outfit text-saffron-600 font-medium">
                          <span>Learn More</span>
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Best Time to Visit Section */}
      <section className="py-24 md:py-32 bg-saffron-50" data-testid="visit-info-section">
        <div className="container mx-auto px-6 md:px-12">
          <div className="max-w-4xl mx-auto">
            <h2 className="font-cormorant text-3xl sm:text-4xl font-bold tracking-tighter text-temple-slate text-center mb-12">
              Plan Your Pilgrimage
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 border border-orange-100/50">
                <Clock className="w-10 h-10 text-saffron-500 mb-4" />
                <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-3">Best Time to Visit</h3>
                <p className="font-outfit text-sm text-gray-600">
                  Most temples are best visited between October and March when the weather is pleasant. However, temples like Kedarnath are only accessible from May to October due to snow.
                </p>
              </div>
              <div className="bg-white p-8 border border-orange-100/50">
                <Calendar className="w-10 h-10 text-saffron-500 mb-4" />
                <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-3">Special Occasions</h3>
                <p className="font-outfit text-sm text-gray-600">
                  Maha Shivaratri, Shravan month (July-August), and Mondays are considered especially auspicious. Many temples hold special ceremonies and celebrations during these times.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};