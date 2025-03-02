"use client";

import React, { useState } from "react";
import { useActionState } from "react";
<<<<<<< HEAD

export default function ProductForm({ handler, profile }) {
  const [state, action, isPending] = useActionState(handler, undefined);
  const [imageError, setImageError] = useState(""); // Track image errors
  const [isImageValid, setIsImageValid] = useState(true); // Control button state
  const [compressedImages, setCompressedImages] = useState<File[]>([]); // Store compressed images
  const [originalImageSizes, setOriginalImageSizes] = useState<number[]>([]); // Store original image sizes
  const [compressedImageSizes, setCompressedImageSizes] = useState<number[]>([]); // Store compressed image sizes
=======
import Catlist from "./catlist";

export default function ProductForm({ handler, product,profile }) {
  const [state, action, isPending] = useActionState(handler, undefined);
  const [imageError, setImageError] = useState(""); // Track image errors
  const [isImageValid, setIsImageValid] = useState(true); // Control button state
  const [compressedImage, setCompressedImage] = useState<File | null>(null); // Store compressed image
  const [originalImageSize, setOriginalImageSize] = useState(0); // Store original image size
  const [compressedImageSize, setCompressedImageSize] = useState(0); // Store compressed image size
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
  const [isSubmitting, setIsSubmitting] = useState(false); // Track form submission

  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3 MB

<<<<<<< HEAD
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    let valid = true;
    let originalSizes: number[] = [];
    let compressedFiles: File[] = [];
    let compressedSizes: number[] = [];

    for (const file of files) {
      originalSizes.push(file.size);
      if (file.size > MAX_FILE_SIZE) {
        setImageError("One or more images exceed 3 MB. Please select smaller files.");
        setIsImageValid(false);
        valid = false;
        continue;
      }
      try {
        const compressedFile = await compressImage(file);
        compressedFiles.push(compressedFile);
        compressedSizes.push(compressedFile.size);
      } catch (error) {
        console.error("Error compressing an image:", error);
        setImageError("Failed to compress some images. Please try again.");
        valid = false;
      }
    }

    if (valid) {
      setImageError("");
      setIsImageValid(true);
    }

    setOriginalImageSizes(originalSizes);
    setCompressedImages(compressedFiles);
    setCompressedImageSizes(compressedSizes);
=======
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setOriginalImageSize(file.size);
      if (file.size > MAX_FILE_SIZE) {
        setImageError("Image size exceeds 3 MB. Please select a smaller file.");
        setIsImageValid(false);
      } else {
        setImageError("");
        setIsImageValid(true);
        compressImage(file);
      }
    }
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
  };

  const compressImage = async (file: File) => {
    const { default: imageCompression } = await import("browser-image-compression");
    const options = {
      maxSizeMB: 0.5, // Target size: 0.5 MB
      maxWidthOrHeight: 1024, // Max width or height: 1024px
      useWebWorker: true,
    };
<<<<<<< HEAD
    return await imageCompression(file, options);
=======

    try {
      const compressedFile = await imageCompression(file, options);
      setCompressedImage(compressedFile);
      setCompressedImageSize(compressedFile.size);
      console.log("Compressed image size:", compressedFile.size);
    } catch (error) {
      console.error("Error compressing the image:", error);
      setImageError("Failed to compress the image. Please try again.");
    }
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

<<<<<<< HEAD
    if (!compressedImages.length) {
      setImageError("Please select and compress at least one image before submitting.");
=======
    if (!compressedImage) {
      setImageError("Please select and compress an image before submitting.");
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
      setIsSubmitting(false);
      return;
    }

<<<<<<< HEAD
    const formData = new FormData(e.currentTarget);
    compressedImages.forEach((image, index) => {
      formData.append(`compressed_image_${index}`, image);
    });

    handler(state, formData).finally(() => setIsSubmitting(false));
=======
    // Append compressed image to form data
    const formData = new FormData(e.currentTarget);
    formData.append("compressed_image", compressedImage);

    handler(state, formData).finally(() => setIsSubmitting(false)); // Ensure the button is re-enabled after submission
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md col-span-full">
      <form action={action} onSubmit={handleSubmit}>
<<<<<<< HEAD
        <input type="hidden" id="userId" name="userId" defaultValue={profile?.userId || ""} />

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
            Upload Images
=======
      <input
            type="hidden"
            id="agentId"
            name="agentId"
            placeholder="Enter product name"
            defaultValue={profile?.agentId || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
        <input
            type="hidden"
            id="state"
            name="state"
            placeholder="Enter product name"
            defaultValue={profile?.stat || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
    
        {/* Product Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
            Product Name
          </label>
          <input
            type="text"
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name"
            defaultValue={product?.name || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.name && (
            <p className="text-red-500 text-sm mt-1">{state.errors.name}</p>
          )}
        </div>

        {/* Product Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-semibold text-gray-700">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            defaultValue={product?.description || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
            rows={3}
          ></textarea>
          {state?.errors?.description && (
            <p className="text-red-500 text-sm mt-1">{state.errors.description}</p>
          )}
        </div>

        {/* Product Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-sm font-semibold text-gray-700">
            Product Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Enter product price"
            defaultValue={product?.price || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.price && (
            <p className="text-red-500 text-sm mt-1">{state.errors.price}</p>
          )}
        </div>

        {/* Product Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700">
            Product Category
          </label>
        <Catlist />
          {state?.errors?.category && (
            <p className="text-red-500 text-sm mt-1">{state.errors.category}</p>
          )}
        </div>

        {/* Stock Quantity */}
        <div className="mb-4">
          <label htmlFor="stock" className="block text-sm font-semibold text-gray-700">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stock"
            name="stock"
            placeholder="Enter stock quantity"
            defaultValue={product?.stock || ""}
            className="w-full px-4 py-2 border rounded-lg mt-2"
          />
          {state?.errors?.stock && (
            <p className="text-red-500 text-sm mt-1">{state.errors.stock}</p>
          )}
        </div>

        {/* Product Image Upload */}
        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700">
            Product Image
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
<<<<<<< HEAD
            multiple
            className="w-full px-4 py-2 border rounded-lg mt-2"
            onChange={handleImageChange}
          />
          {originalImageSizes.length > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Original Sizes: {originalImageSizes.map(size => (size / 1024).toFixed(2)).join(", ")} KB
            </p>
          )}
          {compressedImageSizes.length > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Compressed Sizes: {compressedImageSizes.map(size => (size / 1024).toFixed(2)).join(", ")} KB
=======
            className="w-full px-4 py-2 border rounded-lg mt-2"
            onChange={handleImageChange}
          />
          {originalImageSize > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Original Size: {(originalImageSize / 1024).toFixed(2)} KB
            </p>
          )}
          {compressedImageSize > 0 && (
            <p className="text-sm mt-2 text-gray-500">
              Compressed Size: {(compressedImageSize / 1024).toFixed(2)} KB
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
            </p>
          )}
          {imageError && <p className="text-red-500 text-sm mt-1">{imageError}</p>}
        </div>

<<<<<<< HEAD
        <button
          type="submit"
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg w-26 mt-4 ${
            isPending || !isImageValid || isSubmitting ? "opacity-50 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          disabled={isPending || !isImageValid || isSubmitting}
        >
          {isPending || isSubmitting ? "Processing..." : "Submit"}
=======
        {/* Submit Button */}
        <button
          type="submit"
          className={`bg-blue-500 text-white px-6 py-2 rounded-lg w-26 mt-4 ${
            isPending || !isImageValid || isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-blue-600"
          }`}
          disabled={isPending || !isImageValid || isSubmitting}
        >
          {isPending || isSubmitting ? "Processing..." : "Add Product"}
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
        </button>
      </form>
    </div>
  );
}
