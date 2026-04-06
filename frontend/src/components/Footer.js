export const Footer = () => {
  return (
    <footer className="bg-temple-slate text-white py-12" data-testid="main-footer">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-cormorant text-2xl font-bold mb-4">12 Jyotirlingas</h3>
            <p className="font-outfit text-sm text-gray-300">
              Explore the sacred abodes of Lord Shiva across India. Complete guide to the divine Jyotirlinga temples.
            </p>
          </div>
          
          <div>
            <h4 className="font-outfit text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm font-outfit text-gray-300">
              <li><a href="/" className="hover:text-saffron-400 transition-colors">Home</a></li>
              <li><a href="/#about" className="hover:text-saffron-400 transition-colors">About Jyotirlingas</a></li>
              <li><a href="/#map" className="hover:text-saffron-400 transition-colors">Temple Map</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-outfit text-sm uppercase tracking-wider mb-4">Disclaimer</h4>
            <p className="text-sm font-outfit text-gray-300">
              Information provided for educational and spiritual guidance. Please verify temple timings and travel details before your visit.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm font-outfit text-gray-400">
            © {new Date().getFullYear()} 12 Jyotirlingas. Built with devotion.
          </p>
        </div>
      </div>
    </footer>
  );
};