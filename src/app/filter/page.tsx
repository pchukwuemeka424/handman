'use client';

import React from 'react';
import CategoryList from '@/components/category';
import SearchProduct from './filterFetch';
import SliderBox from '@/components/sliderBox';


export default function Page() {
  return (
    <div className='mt-2'>
       <SliderBox />
      <div className="grid grid-cols-12 gap-4 px-4">
        {/* Product list */}
        <SearchProduct />
       
      </div>
    </div>
  );
}
