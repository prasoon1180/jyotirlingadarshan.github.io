import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, Home, Utensils, Compass, Train, Plane, ArrowLeft } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { motion } from 'framer-motion';
import axios from 'axios';
import { AffiliateBookingSection } from '@/components/AffiliateBookingSection';
import { SEOHead, getTempleJsonLd } from '@/components/SEOHead';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { OtherJyotirlingas } from '@/components/OtherJyotirlingas';
import { VedicImportanceSection } from '@/components/VedicImportanceSection';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

export const TempleDetailPage = () => {
  const { id } = useParams();
  const [temple, setTemple] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTemple = async () => {
      try {
        const response = await axios.get(`${API}/jyotirlingas/${id}`);
        setTemple(response.data);
      } catch (error) {
        console.error('Error fetching temple:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemple();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-saffron-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!temple) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="font-cormorant text-2xl font-bold text-temple-slate mb-4">Temple not found</h2>
          <Link to="/" className="text-saffron-600 hover:text-saffron-700 font-outfit">
            Return to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" data-testid="temple-detail-page">
      <SEOHead
        title={`${temple.name} Jyotirlinga Temple ${temple.location.state} - Darshan Timings, History, How to Reach`}
        description={`Complete guide to ${temple.name} Jyotirlinga Temple in ${temple.location.region}, ${temple.location.state}. ${temple.description.slice(0, 120)}... Darshan timings, mythology, pooja booking, nearby hotels, food options, and travel information.`}
        keywords={`${temple.name} jyotirlinga, ${temple.name} temple, ${temple.name} temple ${temple.location.state}, ${temple.name} darshan timings, ${temple.name} temple history, ${temple.name} how to reach, ${temple.name} pooja booking, ${temple.name} nearby hotels, ${temple.name} temple mythology, ${temple.location.region} temple, jyotirlinga ${temple.location.state}, shiva temple ${temple.location.region}`}
        canonical={`${window.location.origin}/temple/${temple.id}`}
        ogImage={temple.image_url}
        jsonLd={getTempleJsonLd(temple)}
        breadcrumbs={[
          { name: 'Home', url: window.location.origin },
          { name: '12 Jyotirlingas', url: `${window.location.origin}/#temples` },
          { name: `${temple.name} Jyotirlinga`, url: `${window.location.origin}/temple/${temple.id}` },
        ]}
      />

      {/* Hero Section */}
      <section className="relative h-96 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={temple.image_url}
            alt={`${temple.name} Jyotirlinga Temple in ${temple.location.region}, ${temple.location.state} - sacred Shiva shrine and pilgrimage destination`}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-900/50 to-slate-900/90"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 md:px-12 text-white">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-white hover:text-saffron-300 mb-6 transition-colors"
            data-testid="back-button"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-outfit">Back to All 12 Jyotirlingas</span>
          </Link>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-cormorant text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter mb-4" data-testid="temple-name">
              {temple.name} Jyotirlinga Temple
            </h1>
            <div className="flex items-center text-lg font-outfit">
              <MapPin className="w-5 h-5 mr-2 text-saffron-400" />
              {temple.location.region}, {temple.location.state}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6 md:px-12">
          {/* Breadcrumbs */}
          <div className="mb-8">
            <Breadcrumbs items={[
              { label: 'Home', href: '/' },
              { label: '12 Jyotirlingas', href: '/#temples' },
              { label: `${temple.name} Jyotirlinga` },
            ]} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Description */}
              <div className="mb-12" data-testid="temple-description">
                <h2 className="font-cormorant text-3xl font-bold tracking-tighter text-temple-slate mb-4">
                  About {temple.name} Jyotirlinga Temple
                </h2>
                <p className="font-outfit text-base text-gray-700 leading-relaxed mb-6">
                  {temple.description}
                </p>
              </div>

              {/* Mythology */}
              <div className="mb-12" data-testid="temple-mythology">
                <h2 className="font-cormorant text-3xl font-bold tracking-tighter text-temple-slate mb-4">
                  {temple.name} Temple Mythology & Legend
                </h2>
                <p className="font-outfit text-base text-gray-700 leading-relaxed">
                  {temple.mythology}
                </p>
              </div>

              {/* History */}
              <div className="mb-12" data-testid="temple-history">
                <h2 className="font-cormorant text-3xl font-bold tracking-tighter text-temple-slate mb-4">
                  History of {temple.name} Temple
                </h2>
                <p className="font-outfit text-base text-gray-700 leading-relaxed">
                  {temple.history}
                </p>
              </div>

              {/* Rituals & Timings */}
              <div className="mb-12">
                <h2 className="font-cormorant text-3xl font-bold tracking-tighter text-temple-slate mb-6">
                  {temple.name} Darshan Timings & Rituals
                </h2>
                <div className="bg-white border border-orange-100/50 p-6" data-testid="temple-timings">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-2">Morning</div>
                      <div className="font-outfit font-medium text-temple-slate">{temple.timings.morning}</div>
                    </div>
                    <div>
                      <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-2">Evening</div>
                      <div className="font-outfit font-medium text-temple-slate">{temple.timings.evening}</div>
                    </div>
                    <div>
                      <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-2">Aarti Time</div>
                      <div className="font-outfit font-medium text-temple-slate">{temple.timings.aarti_time}</div>
                    </div>
                    {temple.timings.closed_on && (
                      <div>
                        <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-2">Closed On</div>
                        <div className="font-outfit font-medium text-temple-slate">{temple.timings.closed_on}</div>
                      </div>
                    )}
                  </div>
                  <div>
                    <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-3">Special Rituals</div>
                    <ul className="space-y-2">
                      {temple.rituals.map((ritual, idx) => (
                        <li key={idx} className="flex items-start">
                          <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="font-outfit text-gray-700">{ritual}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Visitor Information Tabs */}
              <div>
                <h2 className="font-cormorant text-3xl font-bold tracking-tighter text-temple-slate mb-6">
                  How to Reach {temple.name} — Stay, Food & Travel Guide
                </h2>
                <Tabs defaultValue="stay" className="w-full" data-testid="visitor-info-tabs">
                  <TabsList className="grid w-full grid-cols-4 mb-6">
                    <TabsTrigger value="stay" data-testid="stay-tab">
                      <Home className="w-4 h-4 mr-2" />
                      Stay
                    </TabsTrigger>
                    <TabsTrigger value="food" data-testid="food-tab">
                      <Utensils className="w-4 h-4 mr-2" />
                      Food
                    </TabsTrigger>
                    <TabsTrigger value="attractions" data-testid="attractions-tab">
                      <Compass className="w-4 h-4 mr-2" />
                      Attractions
                    </TabsTrigger>
                    <TabsTrigger value="travel" data-testid="travel-tab">
                      <Train className="w-4 h-4 mr-2" />
                      Travel
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="stay" data-testid="stay-content">
                    <div className="bg-white border border-orange-100/50 p-6">
                      <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-4">Hotels & Accommodation Near {temple.name}</h3>
                      <ul className="space-y-3">
                        {temple.stay_options.map((option, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="font-outfit text-gray-700">{option}</span>
                          </li>
                        ))}
                      </ul>
                      <div className="mt-6 p-4 bg-saffron-50 border border-saffron-100">
                        <p className="font-outfit text-sm text-gray-700">
                          <strong>Booking Tip:</strong> Visit platforms like MakeMyTrip, Booking.com, or Goibibo for online reservations.
                        </p>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="food" data-testid="food-content">
                    <div className="bg-white border border-orange-100/50 p-6">
                      <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-4">Food & Restaurants Near {temple.name} Temple</h3>
                      <ul className="space-y-3">
                        {temple.food_options.map((option, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="font-outfit text-gray-700">{option}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="attractions" data-testid="attractions-content">
                    <div className="bg-white border border-orange-100/50 p-6">
                      <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-4">Places to Visit Near {temple.name} Temple</h3>
                      <ul className="space-y-3">
                        {temple.nearby_attractions.map((attraction, idx) => (
                          <li key={idx} className="flex items-start">
                            <span className="w-1.5 h-1.5 bg-saffron-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="font-outfit text-gray-700">{attraction}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </TabsContent>

                  <TabsContent value="travel" data-testid="travel-content">
                    <div className="bg-white border border-orange-100/50 p-6">
                      <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-4">How to Reach {temple.name} — Airport, Railway, Road</h3>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center mb-2">
                            <Plane className="w-5 h-5 text-saffron-500 mr-2" />
                            <div className="font-outfit font-medium text-temple-slate">By Air</div>
                          </div>
                          <p className="font-outfit text-gray-700 ml-7">{temple.travel_info.nearest_airport}</p>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <Train className="w-5 h-5 text-saffron-500 mr-2" />
                            <div className="font-outfit font-medium text-temple-slate">By Train</div>
                          </div>
                          <p className="font-outfit text-gray-700 ml-7">{temple.travel_info.nearest_railway}</p>
                        </div>
                        <div>
                          <div className="flex items-center mb-2">
                            <Compass className="w-5 h-5 text-saffron-500 mr-2" />
                            <div className="font-outfit font-medium text-temple-slate">By Road</div>
                          </div>
                          <p className="font-outfit text-gray-700 ml-7">{temple.travel_info.road_connectivity}</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                {/* Quick Info Card */}
                <div className="bg-white border border-orange-100/50 p-6" data-testid="quick-info-card">
                  <h3 className="font-cormorant text-xl font-bold text-temple-slate mb-4">Quick Information</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-1">Location</div>
                      <div className="font-outfit text-temple-slate">{temple.location.region}, {temple.location.state}</div>
                    </div>
                    <div>
                      <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-1">Best Time to Visit</div>
                      <div className="font-outfit text-temple-slate">{temple.best_time_to_visit}</div>
                    </div>
                    <div>
                      <div className="text-sm font-outfit uppercase tracking-wider text-gray-500 mb-1">Coordinates</div>
                      <div className="font-outfit text-sm text-temple-slate">
                        {temple.location.lat.toFixed(4)}, {temple.location.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Link */}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${temple.location.lat},${temple.location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-saffron-500 hover:bg-saffron-600 text-white text-center py-3 font-outfit font-medium transition-colors"
                  data-testid="view-on-map-button"
                >
                  View on Google Maps
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vedic Importance & Astrological Guide */}
      <VedicImportanceSection temple={temple} />

      {/* Affiliate Booking Partners */}
      <AffiliateBookingSection temple={temple} />

      {/* Internal Linking - Other Jyotirlingas */}
      <OtherJyotirlingas currentTempleId={temple.id} />
    </div>
  );
};