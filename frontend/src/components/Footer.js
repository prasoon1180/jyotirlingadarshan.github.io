export const Footer = () => {
  const temples = [
    { id: 'somnath', name: 'Somnath' },
    { id: 'mallikarjuna', name: 'Mallikarjuna' },
    { id: 'mahakaleshwar', name: 'Mahakaleshwar' },
    { id: 'omkareshwar', name: 'Omkareshwar' },
    { id: 'kedarnath', name: 'Kedarnath' },
    { id: 'bhimashankar', name: 'Bhimashankar' },
    { id: 'kashi-vishwanath', name: 'Kashi Vishwanath' },
    { id: 'trimbakeshwar', name: 'Trimbakeshwar' },
    { id: 'vaidyanath', name: 'Vaidyanath' },
    { id: 'nageshwar', name: 'Nageshwar' },
    { id: 'rameshwaram', name: 'Rameshwaram' },
    { id: 'grishneshwar', name: 'Grishneshwar' },
  ];

  return (
    <footer className="bg-temple-slate text-white py-12" data-testid="main-footer">
      <div className="container mx-auto px-6 md:px-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="font-cormorant text-2xl font-bold mb-4">12 Jyotirlingas</h3>
            <p className="font-outfit text-sm text-gray-300">
              Complete pilgrimage guide to the 12 sacred Jyotirlinga temples of Lord Shiva in India. Explore darshan timings, travel information, pooja booking, mythology, and history.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="font-outfit text-sm uppercase tracking-wider mb-4">All 12 Jyotirlinga Temples</h4>
            <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm font-outfit text-gray-300">
              {temples.map((temple) => (
                <li key={temple.id}>
                  <a href={`/temple/${temple.id}`} className="hover:text-saffron-400 transition-colors">
                    {temple.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="font-outfit text-sm uppercase tracking-wider mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm font-outfit text-gray-300">
              <li><a href="/" className="hover:text-saffron-400 transition-colors">Home</a></li>
              <li><a href="/#about" className="hover:text-saffron-400 transition-colors">About Jyotirlingas</a></li>
              <li><a href="/#map" className="hover:text-saffron-400 transition-colors">Jyotirlinga Locations Map</a></li>
              <li><a href="/#temples" className="hover:text-saffron-400 transition-colors">Temple Guide</a></li>
            </ul>
            <h4 className="font-outfit text-sm uppercase tracking-wider mt-6 mb-2">Disclaimer</h4>
            <p className="text-xs font-outfit text-gray-400">
              Information provided for educational and spiritual guidance. Please verify temple timings and travel details before your visit.
            </p>
          </div>
        </div>
        
        <div className="border-t border-gray-700 mt-8 pt-8 text-center">
          <p className="text-sm font-outfit text-gray-400">
            {new Date().getFullYear()} 12 Jyotirlingas — Sacred Shiva Temples of India. Built with devotion.
          </p>
        </div>
      </div>
    </footer>
  );
};
