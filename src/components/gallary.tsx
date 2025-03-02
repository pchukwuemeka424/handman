import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';

export default function Gallery({ userDetail }) {
  const [images, setImages] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [limit, setLimit] = useState(6); // Initial limit for images
  const userId = userDetail?.user_id;

  useEffect(() => {
    const fetchImages = async () => {
      const supabase = createClient();
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('user_id', userId)
        .limit(limit)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching images:', error);
        return;
      }
      setImages(data || []);
    };

    fetchImages();
  }, [userId, limit]);

  const handleImageClick = (imageUrl) => {
    setSelectedImage(imageUrl);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="max-w-screen-xl mx-auto py-6">
      <h2 className="text-3xl font-semibold text-center mb-6">Your Image Gallery</h2>

      <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 space-y-4">
        {images.map((image) => (
          <img
            key={image.id}
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image.image}`}
            alt={image.image || 'Image'}
            className="w-full h-auto object-cover rounded-lg transition-transform duration-500 hover:scale-105 cursor-pointer"
            onClick={() => handleImageClick(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/${image.image}`)}
            loading="lazy"
          />
        ))}
      </div>

      {images.length >= limit && (
        <div className="text-center mt-6">
          <button 
            onClick={() => setLimit((prev) => prev + 6)} 
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            Load More
          </button>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50" onClick={closeModal}>
          <div className="relative bg-white p-4 rounded-lg max-w-4xl w-full">
            <img
              src={selectedImage || ''}
              alt="Zoomed image"
              className="w-full h-auto max-h-[90vh] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-white bg-red-500 rounded-full p-2"
            >
              X
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
