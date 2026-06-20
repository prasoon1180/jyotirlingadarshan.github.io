import { ExternalLink, Hotel, Plane } from 'lucide-react';

// Affiliate partners — IndiGo Hotels & Cleartrip routed via Cuelinks shortlink
// Booking.com affiliate account: jyotirlinga@outlook.in
const affiliatePartners = [
  {
    name: 'IndiGo Hotels',
    icon: Hotel,
    color: 'bg-blue-700',
    description: 'Premium hotel deals across India',
    url: 'https://clnk.in/Bukh',
    badge: 'via Cuelinks',
  },
  {
    name: 'Cleartrip',
    icon: Plane,
    color: 'bg-sky-600',
    description: 'Flights, hotels & holiday packages',
    url: 'https://clnk.in/Bukh',
    badge: 'via Cuelinks',
  },
  {
    name: 'Booking.com',
    icon: Hotel,
    color: 'bg-blue-800',
    description: 'Worldwide hotels & accommodation',
    // Affiliate via login: jyotirlinga@outlook.in (replace `aid` with your affiliate ID from Booking.com partner dashboard)
    getUrl: (temple) =>
      `https://www.booking.com/searchresults.html?ss=${encodeURIComponent(temple.location.region + ', ' + temple.location.state)}&aid=jyotirlinga`,
    badge: 'Official Partner',
  },
];

export const AffiliateBookingSection = ({ temple }) => {
  return (
    <section className="py-16 md:py-24 bg-background" data-testid="affiliate-booking-section">
      <div className="container mx-auto px-6 md:px-12">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-saffron-100 text-saffron-700 font-outfit text-xs uppercase tracking-wider mb-4">
            Trusted Booking Partners
          </div>
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-temple-slate mb-4">
            Book Your Stay Near {temple.name}
          </h2>
          <p className="font-outfit text-base text-gray-600 max-w-2xl mx-auto">
            Plan your pilgrimage to {temple.name} with our trusted hotel and travel partners. Compare deals and book directly with verified providers.
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {affiliatePartners.map((partner) => {
            const finalUrl = partner.url || partner.getUrl(temple);
            return (
              <a
                key={partner.name}
                href={finalUrl}
                target="_blank"
                rel="noopener noreferrer sponsored"
                className="group bg-white border border-orange-100/50 p-6 hover:border-saffron-300 hover:-translate-y-1 hover:shadow-lg transition-all flex flex-col"
                data-testid={`affiliate-${partner.name.toLowerCase().replace(/[\s\.]+/g, '-')}`}
              >
                <div className={`w-12 h-12 ${partner.color} text-white flex items-center justify-center mb-4`}>
                  <partner.icon className="w-6 h-6" />
                </div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-cormorant text-xl font-bold text-temple-slate">
                    {partner.name}
                  </h3>
                  <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-saffron-500 transition-colors" />
                </div>
                <p className="font-outfit text-sm text-gray-600 mb-4 flex-1">
                  {partner.description}
                </p>
                <div className="flex items-center justify-between">
                  <span className="font-outfit text-xs uppercase tracking-wider text-saffron-600">
                    {partner.badge}
                  </span>
                  <span className="font-outfit text-sm font-medium text-saffron-600 group-hover:text-saffron-700">
                    Book Now →
                  </span>
                </div>
              </a>
            );
          })}
        </div>

        <p className="text-center mt-10 font-outfit text-xs text-gray-500 max-w-xl mx-auto">
          Disclosure: We may earn an affiliate commission when you book through these partners — at no extra cost to you. This helps us keep the Jyotirlinga guide free.
        </p>
      </div>
    </section>
  );
};
