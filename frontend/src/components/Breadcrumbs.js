import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const Breadcrumbs = ({ items }) => {
  return (
    <nav aria-label="Breadcrumb" className="font-outfit text-sm" data-testid="breadcrumbs">
      <ol className="flex items-center flex-wrap gap-1" itemScope itemType="https://schema.org/BreadcrumbList">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex items-center"
            itemProp="itemListElement"
            itemScope
            itemType="https://schema.org/ListItem"
          >
            {index > 0 && <ChevronRight className="w-3 h-3 mx-1 text-gray-400" />}
            {item.href ? (
              <Link
                to={item.href}
                className="text-saffron-600 hover:text-saffron-700 transition-colors"
                itemProp="item"
                data-testid={`breadcrumb-${index}`}
              >
                <span itemProp="name">{item.label}</span>
              </Link>
            ) : (
              <span className="text-gray-600" itemProp="name" data-testid={`breadcrumb-${index}`}>
                {item.label}
              </span>
            )}
            <meta itemProp="position" content={String(index + 1)} />
          </li>
        ))}
      </ol>
    </nav>
  );
};
