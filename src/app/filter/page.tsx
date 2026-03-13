'use client';

import React from 'react';
import ServiceCategories from '@/components/serviceCategories';
import SearchProduct from './filterFetch';
import SliderBox from '@/components/sliderBox';


export default function Page() {
  return (
    <div className='mt-2'>
       <SliderBox />
      <div className="grid grid-cols-12 gap-4 px-4">
        {/* Service Categories */}
        <div className="col-span-12 sm:col-span-3">
          <ServiceCategories />
        </div>
        {/* Service Providers list */}
        <div className="col-span-12 sm:col-span-9">
          <SearchProduct />
        </div>
      </div>
    </div>
  );
}
