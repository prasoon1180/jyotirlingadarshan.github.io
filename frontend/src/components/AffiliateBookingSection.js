import { ExternalLink, Hotel, Bus, Train, Plane } from 'lucide-react';

const affiliatePartners = {
  accommodation: [
    {
      name: 'Booking.com',
      icon: Hotel,
      color: 'bg-blue-600',
      getUrl: (temple) =>
        `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(temple.location.region + ', ' + temple.location.state)}&aid=YOUR_AFFILIATE_ID`,
      tag: '8-12% commission',
    },
    {
      name: 'MakeMyTrip',
      icon: Hotel,
      color: 'bg-red-500',
      getUrl: (temple) =>
        `https://www.makemytrip.com/hotels/hotel-listing/?city=${encodeURIComponent(temple.location.region)}&checkin=&checkout=`,
      tag: '8-12% commission',
    },
    {
      name: 'OYO Rooms',
      icon: Hotel,
      color: 'bg-rose-600',
      getUrl: (temple) =>
        `https://www.oyorooms.com/search?location=${encodeURIComponent(temple.location.region + ', ' + temple.location.state)}`,
      tag: '8-12% commission',
    },
  ],
  travel: [
    {
      name: 'IRCTC (Trains)',
      icon: Train,
      color: 'bg-orange-700',
      getUrl: (temple) =>
        `https://www.irctc.co.in/nget/train-search`,
      desc: `Nearest station: ${null}`,
      getDesc: (temple) => `Nearest: ${temple.travel_info.nearest_railway}`,
      tag: '5-10% commission',
    },
    {
      name: 'RedBus',
      icon: Bus,
      color: 'bg-red-700',
      getUrl: (temple) =>
        `https://www.redbus.in/search?dst=${encodeURIComponent(temple.location.region)}`,
      getDesc: (temple) => `Bus routes to ${temple.location.region}`,
      tag: '5-10% commission',
    },
    {
      name: 'MakeMyTrip Flights',
      icon: Plane,
      color: 'bg-blue-700',
      getUrl: (temple) =>
        `https://www.makemytrip.com/flights/`,
      getDesc: (temple) => `Nearest airport: ${temple.travel_info.nearest_airport}`,
      tag: '5-10% commission',
    },
    {
      name: 'Yatra',
      icon: Plane,
      color: 'bg-red-600',
      getUrl: (temple) =>
        `https://www.yatra.com/flights`,
      getDesc: (temple) => `Flights & packages to ${temple.location.state}`,
      tag: '5-10% commission',
    },
  ],
};

export const AffiliateBookingSection = ({ temple }) => {
  return (
    <section className="py-16 bg-background" data-testid="affiliate-booking-section">
      <div className="container mx-auto px-6 md:px-12">
        <h2 className="font-cormorant text-3xl sm:text-4xl font-bold tracking-tighter text-temple-slate text-center mb-4">
          Book Your Trip
        </h2>
        <p className="font-outfit text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Plan your pilgrimage to {temple.name} with our trusted travel partners. Book accommodation and travel through these platforms.
        </p>

        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Accommodation Partners */}
          <div>
            <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-6 flex items-center gap-2">
              <Hotel className="w-6 h-6 text-saffron-500" />
              Accommodation
            </h3>
            <div className="space-y-3">
              {affiliatePartners.accommodation.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.getUrl(temple)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white border border-orange-100/50 hover:border-saffron-300 hover:-translate-y-0.5 transition-all group"
                  data-testid={`affiliate-${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${partner.color} text-white flex items-center justify-center`}>
                      <partner.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-outfit font-medium text-temple-slate">{partner.name}</div>
                      <div className="font-outfit text-xs text-gray-500">
                        Hotels near {temple.location.region}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-saffron-500 transition-colors" />
                </a>
              ))}
            </div>
          </div>

          {/* Travel Partners */}
          <div>
            <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-6 flex items-center gap-2">
              <Train className="w-6 h-6 text-saffron-500" />
              Travel & Transport
            </h3>
            <div className="space-y-3">
              {affiliatePartners.travel.map((partner) => (
                <a
                  key={partner.name}
                  href={partner.getUrl(temple)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-4 bg-white border border-orange-100/50 hover:border-saffron-300 hover:-translate-y-0.5 transition-all group"
                  data-testid={`affiliate-${partner.name.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${partner.color} text-white flex items-center justify-center`}>
                      <partner.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-outfit font-medium text-temple-slate">{partner.name}</div>
                      <div className="font-outfit text-xs text-gray-500">
                        {partner.getDesc(temple)}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-saffron-500 transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
