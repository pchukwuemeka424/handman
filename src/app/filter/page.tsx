'use client';

import React from 'react';
import SearchProduct from './filterFetch';
import SliderBox from '@/components/sliderBox';
import ServiceCategories from '@/components/serviceCategories';


export default function Page() {
  return (
    <div className='mt-2'>
       <SliderBox />
      <div className="grid grid-cols-12 gap-4 px-4">
        {/* Service categories */}
        <div className="col-span-12">
          <h2 className="text-xl font-semibold mb-2">Service Categories</h2>
          <ServiceCategories />
        </div>
        {/* Product list */}
        <SearchProduct />
        
      </div>
    </div>
  );
}
