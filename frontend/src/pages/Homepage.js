import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Clock, Calendar, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { MapComponent } from '@/components/MapComponent';
import { SEOHead, getHomepageJsonLd, getItemListJsonLd } from '@/components/SEOHead';

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
      <SEOHead
        title="12 Jyotirlingas of Lord Shiva - Complete Pilgrimage Guide India"
        description="Explore the 12 sacred Jyotirlingas of Lord Shiva across India. Complete pilgrimage guide with temple history, darshan timings, travel information, pooja booking, nearby hotels, and spiritual significance of Somnath, Mallikarjuna, Mahakaleshwar, Omkareshwar, Kedarnath, Bhimashankar, Kashi Vishwanath, Trimbakeshwar, Vaidyanath, Nageshwar, Rameshwaram, and Grishneshwar temples."
        keywords="12 jyotirlingas, jyotirlinga temples, shiva temples india, jyotirlinga pilgrimage, sacred shiva shrines, somnath temple, kedarnath temple, kashi vishwanath, mahakaleshwar ujjain, rameshwaram temple, jyotirlinga darshan, hindu pilgrimage india, shiva temple tour, jyotirlinga yatra, jyotirlinga locations map, temple timings, pooja booking online, jyotirlinga travel guide"
        canonical={window.location.origin}
        ogImage="https://images.unsplash.com/photo-1759998756869-c8eeb78f49e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxTaGl2YSUyMHN0YXR1ZSUyMEluZGlhJTIwc3Vuc2V0fGVufDB8fHx8MTc3NTUwNTI4MHww&ixlib=rb-4.1.0&q=85"
        jsonLd={temples.length > 0 ? getItemListJsonLd(temples) : getHomepageJsonLd()}
        breadcrumbs={[{ name: 'Home', url: window.location.origin }]}
      />
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1759998756869-c8eeb78f49e8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxOTB8MHwxfHNlYXJjaHwxfHxTaGl2YSUyMHN0YXR1ZSUyMEluZGlhJTIwc3Vuc2V0fGVufDB8fHx8MTc3NTUwNTI4MHww&ixlib=rb-4.1.0&q=85"
            alt="Lord Shiva statue at sunset - 12 Jyotirlingas pilgrimage guide India"
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
              The 12 Sacred Jyotirlingas of India
            </h1>
            <p className="font-outfit text-base sm:text-lg mb-8 text-gray-200">
              Embark on a divine pilgrimage to the 12 Jyotirlinga temples of Lord Shiva. Discover the sacred shrines spread across India — from the coastal Somnath in Gujarat to the Himalayan Kedarnath, from the holy Kashi Vishwanath in Varanasi to the island temple of Rameshwaram. Plan your Jyotirlinga yatra with darshan timings, travel guides, pooja booking, and nearby accommodation.
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
              What are Jyotirlingas? Meaning and Significance
            </h2>
            <p className="font-outfit text-base text-gray-700 leading-relaxed mb-6">
              A Jyotirlinga (also spelled Jyotirling) is a devotional representation of the Hindu god Lord Shiva. The word is derived from two Sanskrit words: <strong>Jyoti</strong> meaning radiance or light, and <strong>Linga</strong> meaning a sign or mark of Shiva. According to the Shiva Purana, there are <strong>12 Jyotirlinga shrines in India</strong> where Lord Shiva manifested himself as an infinite column of light, piercing through the earth and sky.
            </p>
            <p className="font-outfit text-base text-gray-700 leading-relaxed mb-6">
              These <strong>twelve Jyotirlinga temples</strong> are considered the most sacred abodes of Shiva and are among the most visited Hindu pilgrimage destinations in India. Visiting all 12 Jyotirlingas is believed to grant <em>moksha</em> (spiritual liberation) and wash away sins. Each temple has its own unique mythology, architecture, rituals, and spiritual energy.
            </p>
            <p className="font-outfit text-base text-gray-700 leading-relaxed">
              The 12 Jyotirlingas are: <strong>Somnath</strong> (Gujarat), <strong>Mallikarjuna</strong> (Andhra Pradesh), <strong>Mahakaleshwar</strong> (Ujjain), <strong>Omkareshwar</strong> (Madhya Pradesh), <strong>Kedarnath</strong> (Uttarakhand), <strong>Bhimashankar</strong> (Maharashtra), <strong>Kashi Vishwanath</strong> (Varanasi), <strong>Trimbakeshwar</strong> (Nashik), <strong>Vaidyanath</strong> (Jharkhand), <strong>Nageshwar</strong> (Gujarat), <strong>Rameshwaram</strong> (Tamil Nadu), and <strong>Grishneshwar</strong> (Maharashtra).
            </p>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-24 md:py-32 bg-temple-slate" data-testid="map-section">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-white text-center mb-4">
            Map of 12 Jyotirlinga Locations in India
          </h2>
          <p className="font-outfit text-center text-gray-300 mb-12 max-w-2xl mx-auto">
            Interactive map showing the exact locations of all 12 Jyotirlinga temples across India. Click on any marker to explore temple details, darshan timings, and travel information.
          </p>
          <div className="bg-white p-4 shadow-2xl">
            <MapComponent temples={temples} />
          </div>
        </div>
      </section>

      {/* Temples Grid Section */}
      <section id="temples" className="py-24 md:py-32 bg-background" data-testid="temples-section">
        <div className="container mx-auto px-6 md:px-12">
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-temple-slate text-center mb-4">
            All 12 Jyotirlinga Temples — Complete Guide
          </h2>
          <p className="font-outfit text-center text-gray-600 mb-16 max-w-2xl mx-auto">
            Explore each of the 12 sacred Jyotirlinga temples with detailed information on history, mythology, darshan timings, how to reach, nearby hotels, and pooja booking.
          </p>
          
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
                          alt={`${temple.name} Jyotirlinga Temple ${temple.location.state} - darshan timings, travel guide, pooja booking`}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>
                      <div className="p-6">
                        <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-2">
                          {temple.name} Jyotirlinga
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
              Plan Your Jyotirlinga Pilgrimage Yatra
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white p-8 border border-orange-100/50">
                <Clock className="w-10 h-10 text-saffron-500 mb-4" />
                <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-3">Best Time to Visit Jyotirlingas</h3>
                <p className="font-outfit text-sm text-gray-600">
                  Most Jyotirlinga temples are best visited between <strong>October and March</strong> when the weather is pleasant across India. Kedarnath temple in Uttarakhand is only accessible from <strong>May to October</strong> due to heavy snowfall. Maha Shivaratri (February–March) is the most auspicious time for Jyotirlinga darshan across all 12 temples.
                </p>
              </div>
              <div className="bg-white p-8 border border-orange-100/50">
                <Calendar className="w-10 h-10 text-saffron-500 mb-4" />
                <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-3">Auspicious Days for Jyotirlinga Darshan</h3>
                <p className="font-outfit text-sm text-gray-600">
                  <strong>Maha Shivaratri</strong>, <strong>Shravan month</strong> (July–August), Mondays (<em>Somvar</em>), and <strong>Pradosh Vrat</strong> days are considered the most auspicious for visiting Jyotirlinga temples. Many temples like Mahakaleshwar hold special <strong>Bhasma Aarti</strong> ceremonies, while Kashi Vishwanath performs five daily aartis.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};