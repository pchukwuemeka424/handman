'use client';

import React from 'react';
import { FaCheckCircle } from 'react-icons/fa';

interface ServiceCategoriesProps {
  categories?: string[];
  onCategorySelect?: (category: string) => void;
}

const defaultCategories = [
  'Handyman',
  'Plumber',
  'Carpenter',
  'Electrician',
  'Painter',
  'Gardener',
  'Cleaner',
  'Mechanic',
  'Tailor',
  'Barber',
];

const ServiceCategories: React.FC<ServiceCategoriesProps> = ({
  categories = defaultCategories,
  onCategorySelect,
}) => {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((category, index) => (
        <span
          key={index}
          className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700 hover:bg-blue-100 hover:text-blue-700 cursor-pointer transition-colors"
          onClick={() => onCategorySelect && onCategorySelect(category)}
        >
          <FaCheckCircle className="text-blue-500" /> {category}
        </span>
      ))}
    </div>
  );
};

export default ServiceCategories;
