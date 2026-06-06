import { motion } from 'framer-motion';
import { Sparkles, ScrollText, Heart } from 'lucide-react';
import { vedicData } from '@/data/vedicData';

export const VedicImportanceSection = ({ temple }) => {
  const data = vedicData[temple.id];

  if (!data) return null;

  return (
    <section className="py-16 md:py-24 bg-saffron-50 relative overflow-hidden" data-testid="vedic-importance-section">
      {/* Subtle Om symbol background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03]">
        <span className="font-cormorant text-[40rem] text-temple-slate select-none">ॐ</span>
      </div>

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-block px-4 py-1 bg-saffron-100 text-saffron-700 font-outfit text-xs uppercase tracking-wider mb-4">
            Vedic & Astrological Guide
          </div>
          <h2 className="font-cormorant text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tighter text-temple-slate mb-4">
            Spiritual Significance of {temple.name}
          </h2>
          <p className="font-outfit text-base text-gray-600 max-w-2xl mx-auto">
            Discover the ancient Vedic importance, Puranic legends, and astrological remedies associated with the sacred {temple.name} Jyotirlinga.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {/* 1. Associated Kaal Sarp Dosh */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border border-orange-100/50 p-8 hover:shadow-lg transition-shadow"
            data-testid="kaal-sarp-dosh-card"
          >
            <div className="w-12 h-12 bg-saffron-500 text-white flex items-center justify-center mb-6">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="font-outfit text-xs uppercase tracking-wider text-saffron-600 mb-2">
              Astrological Connection
            </div>
            <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-4 leading-tight">
              Associated Kaal Sarp Dosh
            </h3>
            <div className="border-l-2 border-saffron-500 pl-4 py-1">
              <p className="font-cormorant text-xl font-semibold text-temple-slate" data-testid="kaal-sarp-dosh-name">
                {data.kaalSarpDosh}
              </p>
            </div>
            <p className="font-outfit text-sm text-gray-600 mt-4 leading-relaxed">
              Visiting this Jyotirlinga is traditionally prescribed as a powerful remedy for those born under or afflicted by this specific Kaal Sarp Dosh.
            </p>
          </motion.div>

          {/* 2. Vedic Importance & Puranic Legends */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white border border-orange-100/50 p-8 hover:shadow-lg transition-shadow"
            data-testid="vedic-importance-card"
          >
            <div className="w-12 h-12 bg-temple-slate text-white flex items-center justify-center mb-6">
              <ScrollText className="w-6 h-6" />
            </div>
            <div className="font-outfit text-xs uppercase tracking-wider text-saffron-600 mb-2">
              Sacred Scriptures
            </div>
            <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-4 leading-tight">
              Vedic Importance & Puranic Legends
            </h3>
            <p className="font-outfit text-sm text-gray-700 leading-relaxed" data-testid="vedic-importance-text">
              {data.vedicImportance}
            </p>
          </motion.div>

          {/* 3. Why You Should Visit */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white border border-orange-100/50 p-8 hover:shadow-lg transition-shadow"
            data-testid="why-visit-card"
          >
            <div className="w-12 h-12 bg-saffron-600 text-white flex items-center justify-center mb-6">
              <Heart className="w-6 h-6" />
            </div>
            <div className="font-outfit text-xs uppercase tracking-wider text-saffron-600 mb-2">
              Transformation
            </div>
            <h3 className="font-cormorant text-2xl font-bold text-temple-slate mb-4 leading-tight">
              Why You Should Visit
            </h3>
            <p className="font-outfit text-xs uppercase tracking-wider text-gray-500 mb-3">
              Spiritual & Material Benefits
            </p>
            <p className="font-outfit text-sm text-gray-700 leading-relaxed" data-testid="why-visit-text">
              {data.whyVisit}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
