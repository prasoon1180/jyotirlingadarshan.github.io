import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Search } from 'lucide-react';
import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

const jyotirlingas = [
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

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await axios.get(`${API}/jyotirlingas/search/${query}`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/70 backdrop-blur-xl border-b border-white/20" data-testid="main-header">
        <div className="container mx-auto px-6 md:px-12">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2" data-testid="header-logo">
              <div className="text-2xl font-cormorant font-bold text-temple-slate tracking-tighter">
                12 Jyotirlingas
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <div className="relative group">
                <button 
                  className="text-sm font-outfit text-temple-slate hover:text-saffron-600 transition-colors flex items-center space-x-1"
                  data-testid="temples-dropdown-button"
                >
                  <span>Temples</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute top-full left-0 mt-2 w-72 bg-white border border-orange-100/50 shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200" data-testid="temples-dropdown-menu">
                  <div className="py-2">
                    {jyotirlingas.map((temple) => (
                      <Link
                        key={temple.id}
                        to={`/temple/${temple.id}`}
                        className="block px-4 py-2 text-sm font-outfit text-temple-slate hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                        data-testid={`temple-link-${temple.id}`}
                      >
                        <div className="font-medium">{temple.name}</div>
                        <div className="text-xs text-gray-500">{temple.state}</div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSearchOpen(true)}
                className="text-sm font-outfit text-temple-slate hover:text-saffron-600 transition-colors flex items-center space-x-1"
                data-testid="search-button"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden text-temple-slate"
              data-testid="mobile-menu-button"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-orange-100/50 bg-white" data-testid="mobile-menu">
            <div className="px-6 py-4 space-y-2">
              <button
                onClick={() => setSearchOpen(true)}
                className="w-full text-left px-4 py-2 text-sm font-outfit text-temple-slate hover:bg-saffron-50 hover:text-saffron-600 transition-colors flex items-center space-x-2"
                data-testid="mobile-search-button"
              >
                <Search className="w-4 h-4" />
                <span>Search Temples</span>
              </button>
              <div className="font-outfit text-xs uppercase tracking-wider text-gray-500 px-4 py-2">All Temples</div>
              {jyotirlingas.map((temple) => (
                <Link
                  key={temple.id}
                  to={`/temple/${temple.id}`}
                  className="block px-4 py-2 text-sm font-outfit text-temple-slate hover:bg-saffron-50 hover:text-saffron-600 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-temple-link-${temple.id}`}
                >
                  <div className="font-medium">{temple.name}</div>
                  <div className="text-xs text-gray-500">{temple.state}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* Search Dialog */}
      <CommandDialog open={searchOpen} onOpenChange={setSearchOpen}>
        <CommandInput 
          placeholder="Search temples by name or location..." 
          onValueChange={handleSearch}
          data-testid="search-input"
        />
        <CommandList>
          <CommandEmpty>No temples found.</CommandEmpty>
          <CommandGroup heading="Temples">
            {searchResults.map((temple) => (
              <CommandItem
                key={temple.id}
                onSelect={() => {
                  window.location.href = `/temple/${temple.id}`;
                  setSearchOpen(false);
                }}
                data-testid={`search-result-${temple.id}`}
              >
                <div>
                  <div className="font-medium">{temple.name}</div>
                  <div className="text-xs text-gray-500">{temple.location.state}</div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};