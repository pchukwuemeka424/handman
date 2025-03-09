import React, { useEffect, useState } from 'react';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

export default function SliderBox() {
  const [images, setImages] = useState([]);

  useEffect(() => {
    // Fetch images from Supabase
    const fetchBanner = async () => {
      const supabase = createClient();
      const { data: pictures, error } = await supabase.from('Banner').select("*");
      if (error) {
        console.error('Error fetching banners:', error);
      } else {
        setImages(pictures);
      }
    };

    fetchBanner();
  }, []);

  const settings = {
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 6000,
    cssEase: "linear",
    adaptiveHeight: true
  };

  return (
    <Slider {...settings}>
      {/* Map images */}
      {images.map((image) => (
        <div key={image.id} > {/* Added larger horizontal margin */}
          <Image
            src={image.image}
            width={100}
            height={100}
            alt={`Banner ${image.id}`}
            unoptimized
            className="w-full h-36 sm:h-64 object-cover  sm:rounded-md"  // Removed extra margin classes from image
          />
        </div>
      ))}
    </Slider>
  );
}
