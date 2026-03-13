"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { Search, ChevronDown, ChevronRight, Filter, Tag } from 'lucide-react';
import Link from 'next/link';

// Group similar service categories for better organization
const categoryGroups = [
  {
    id: 'home-services',
    name: 'Home Services',
    icon: '🏠',
    categories: ['Plumber', 'Electrician', 'Carpenter', 'Painter', 'Tiler', 'Roofing', 'Flooring', 'Drywall Installation']
  },
  {
    id: 'home-maintenance',
    name: 'Home Maintenance',
    icon: '🔧',
    categories: ['Pressure Washing', 'Gutter Cleaning', 'Window Repair', 'Fence Repair', 'Door Installation', 'Lock Installation']
  },
  {
    id: 'home-improvement',
    name: 'Home Improvement',
    icon: '🏗️',
    categories: ['Home Renovation', 'Kitchen Remodeling', 'Bathroom Remodeling', 'Cabinet Installation', 'Countertop Installation']
  },
  {
    id: 'appliance-services',
    name: 'Appliance Services',
    icon: '🛠️',
    categories: ['Appliance Installation', 'Appliance Repair', 'Refrigerator Installation', 'Dishwasher Installation']
  },
  {
    id: 'smart-home',
    name: 'Smart Home',
    icon: '🏠💡',
    categories: ['Smart Home Installation', 'Home Automation Services', 'Smart Thermostat Installation', 'Smart Security System Installation']
  },
  {
    id: 'hvac',
    name: 'HVAC Services',
    icon: '❄️🔥',
    categories: ['HVAC Installation', 'HVAC Repair', 'Air Conditioning Installation', 'Air Conditioning Repair']
  },
  {
    id: 'beauty-services',
    name: 'Beauty Services',
    icon: '💄',
    categories: ['Makeup Artist', 'Hair Stylist', 'Nail Technician', 'Eyebrow Threading', 'Lash Extensions', 'Facials']
  },
  {
    id: 'fitness-health',
    name: 'Fitness & Health',
    icon: '💪',
    categories: ['Personal Trainer', 'Yoga Instructor', 'Dietitian', 'Massage Therapist', 'Skin Care Specialist']
  },
  {
    id: 'auto-services',
    name: 'Auto Services',
    icon: '🚗',
    categories: ['Auto Mechanic', 'Car Detailing', 'Car Maintenance', 'Battery Replacement', 'Brake Service', 'Tire Services']
  },
  {
    id: 'tech-services',
    name: 'Tech Services',
    icon: '💻',
    categories: ['IT Support', 'Web Development', 'Mobile App Development', 'Network Setup', 'Smartphone Repair', 'Laptop Repair']
  }
];

interface Category {
  id: string;
  title: string;
}

export default function ServiceCategories() {
  const supabase = createClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['home-services', 'beauty-services']);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const { data: categoryData, error } = await supabase
        .from("category")
        .select("*");
      if (error) console.error("Error fetching categories:", error);
      else setCategories(categoryData);
    };

    fetchCategories();
  }, [supabase]);

  useEffect(() => {
    if (searchTerm.trim()) {
      // Filter categories by search term
      const filtered = categories.filter(category =>
        category.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories([]);
    }
  }, [searchTerm, categories]);

  const toggleGroup = (groupId: string) => {
    setExpandedGroups(prev =>
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <Tag className="mr-2 text-rose-500" size={20} />
          Service Categories
        </h2>
        <div className="text-sm text-gray-500">{categories.length} categories</div>
      </div>

      {/* Search and Filter */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search for services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Search Results */}
      {searchTerm.trim() && filteredCategories.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Search Results</h3>
          <div className="space-y-2">
            {filteredCategories.map((category) => (
              <Link
                key={category.id}
                href={`/products/${category.id}`}
                className={`block px-4 py-2 rounded-lg text-sm transition-colors ${
                  activeCategory === category.id
                    ? 'bg-rose-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => handleCategoryClick(category.id)}
              >
                {category.title}
              </Link>
            ))}
          </div>
          {filteredCategories.length === 0 && (
            <div className="text-sm text-gray-500">No categories found</div>
          )}
        </div>
      )}

      {/* Category Groups */}
      <div className="space-y-4">
        {categoryGroups.map((group) => {
          // Filter categories in this group that exist in our data
          const groupCategories = categories.filter(category =>
            group.categories.some(gc => category.title.toLowerCase().includes(gc.toLowerCase()))
          );

          if (groupCategories.length === 0) return null;

          return (
            <div key={group.id} className="border border-gray-200 rounded-lg overflow-hidden">
              <button
                onClick={() => toggleGroup(group.id)}
                className="w-full px-4 py-3 flex items-center justify-between bg-gray-50 hover:bg-gray-100 transition-colors text-left"
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{group.icon}</span>
                  <span className="font-medium text-gray-800">{group.name}</span>
                  <span className="ml-2 text-xs bg-gray-300 text-gray-700 px-2 py-1 rounded-full">
                    {groupCategories.length}
                  </span>
                </div>
                {expandedGroups.includes(group.id) ? (
                  <ChevronDown size={18} className="text-gray-500" />
                ) : (
                  <ChevronRight size={18} className="text-gray-500" />
                )}
              </button>

              {expandedGroups.includes(group.id) && (
                <div className="p-4 bg-white border-t border-gray-200">
                  <div className="grid grid-cols-1 gap-2">
                    {groupCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products/${category.id}`}
                        className={`block px-3 py-2 rounded-lg text-sm transition-colors ${
                          activeCategory === category.id
                            ? 'bg-rose-500 text-white'
                            : 'text-gray-600 hover:bg-gray-100'
                        }`}
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        {category.title}
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* All Categories Link */}
      {!searchTerm.trim() && (
        <div className="mt-6">
          <Link
            href="/filter"
            className="block w-full text-center py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-lg transition-colors font-medium"
          >
            View All Categories
          </Link>
        </div>
      )}
    </div>
  );
}
