"use client";
import React, { useState, useEffect } from "react";
import { AiOutlineSearch } from "react-icons/ai";
import { FaMapMarkerAlt } from "react-icons/fa";
import { search } from "@/actions/auth/search";
import { nigeriaStates } from "./states";
import SearchBar from "./searchBar";

const largeScreen = [
  "https://fbpdbcxjavianaboavoo.supabase.co/storage/v1/object/public/images//hand.png",
];
const smallScreen = [
  "https://fbpdbcxjavianaboavoo.supabase.co/storage/v1/object/public/images//mbil.png",
];

export default function HeroHandyman() {
  const [marketInput, setMarketInput] = useState("");
  const [currentImage, setCurrentImage] = useState(largeScreen[0]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setCurrentImage(smallScreen[0]);
      } else {
        setCurrentImage(largeScreen[0]);
      }
    };

    handleResize(); // Set image on initial load
    window.addEventListener("resize", handleResize); // Listen for window size changes

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section
      className="h-screen flex flex-col justify-center items-center relative bg-cover bg-center transition-opacity duration-1000"
      style={{ backgroundImage: `url(${currentImage})` }}
    >
      {/* Black Overlay */}
      <div className="absolute inset-0 bg-blue-900 opacity-30 transition-opacity"></div>

      {/* Content Container */}
      <div className="relative container mx-auto text-left sm:text-center px-4 max-w-4xl z-10">
        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
          Discover Skilled Professionals
        </h1>
        <p className="text-gray-200 mb-6">
          Easily connect with experienced experts for repairs, maintenance, and installations.
        </p>

        {/* Search Bar Form */}
        <form action={search} className="flex flex-col sm:flex-row items-center space-y-2 justify-center w-full">
          <div className="relative w-full sm:w-96">
            <SearchBar value={marketInput} onChange={setMarketInput} />
          </div>

          <div className="relative w-full sm:w-48">
            <FaMapMarkerAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select
              name="state"
              className="w-full pl-10 pr-4 py-2 border h-12 sm:h-14 border-gray-300  text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Location</option>
              {nigeriaStates.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full h-12 sm:h-14 sm:w-auto flex items-center justify-center bg-blue-600 text-white px-2 py-2 hover:bg-blue-700 transition whitespace-nowrap"
          >
            <AiOutlineSearch className="w-6 h-6 mr-2" />
            Search
          </button>
        </form>

        <div className="text-gray-300 mt-4">
          Popular: House Cleaning, Web Design, Personal Trainers
        </div>
      </div>
    </section>
  );
}
