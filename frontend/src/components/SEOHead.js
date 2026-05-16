import { Helmet } from 'react-helmet-async';

export const SEOHead = ({ title, description, keywords, canonical, ogImage, jsonLd, breadcrumbs }) => {
  const siteName = '12 Jyotirlingas - Sacred Shiva Temples of India';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      {canonical && <link rel="canonical" href={canonical} />}

      {/* Open Graph */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      {ogImage && <meta property="og:image" content={ogImage} />}
      {canonical && <meta property="og:url" content={canonical} />}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      {ogImage && <meta name="twitter:image" content={ogImage} />}

      {/* Extra SEO */}
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="author" content="12 Jyotirlingas" />

      {/* JSON-LD Structured Data */}
      {jsonLd && (
        <script type="application/ld+json">
          {JSON.stringify(jsonLd)}
        </script>
      )}

      {/* Breadcrumb JSON-LD */}
      {breadcrumbs && (
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": breadcrumbs.map((crumb, i) => ({
              "@type": "ListItem",
              "position": i + 1,
              "name": crumb.name,
              "item": crumb.url,
            })),
          })}
        </script>
      )}
    </Helmet>
  );
};

export const getTempleJsonLd = (temple) => ({
  "@context": "https://schema.org",
  "@type": "HinduTemple",
  "name": `${temple.name} Jyotirlinga Temple`,
  "description": temple.description,
  "image": temple.image_url,
  "address": {
    "@type": "PostalAddress",
    "addressRegion": temple.location.state,
    "addressLocality": temple.location.region,
    "addressCountry": "IN",
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": temple.location.lat,
    "longitude": temple.location.lng,
  },
  "openingHours": `Mo-Su ${temple.timings.morning}`,
  "isAccessibleForFree": true,
  "publicAccess": true,
  "touristType": "Pilgrimage",
});

export const getHomepageJsonLd = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "12 Jyotirlingas - Sacred Shiva Temples of India",
  "url": window.location.origin,
  "description": "Complete guide to the 12 sacred Jyotirlingas of Lord Shiva in India. Explore temple history, mythology, darshan timings, travel information, pooja booking, and pilgrimage planning.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": `${window.location.origin}/search?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
});

export const getItemListJsonLd = (temples) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "12 Jyotirlingas of Lord Shiva",
  "description": "Complete list of all 12 sacred Jyotirlinga temples across India",
  "numberOfItems": 12,
  "itemListElement": temples.map((temple, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": `${temple.name} Jyotirlinga`,
    "url": `${window.location.origin}/temple/${temple.id}`,
    "image": temple.image_url,
  })),
});
