"use client";
import React from "react";
import { FaMapMarkerAlt, FaSearch } from "react-icons/fa";
import { nigeriaStates } from "./states";
import Image from "next/image";
import { Button } from "./ui/button";
import SearchBar from "./searchBar";
import Link from "next/link";
import { search } from "@/actions/auth/search";


export default function Topnav() {
  const [marketInput, setMarketInput] = React.useState("");
  return (
    <div>
      <div className="flex justify-between items-center px-2 py-2">
     <Link href="/">
     <Image
          src="https://fbpdbcxjavianaboavoo.supabase.co/storage/v1/object/public/images//KwikFix-Logo-03-10-2025_09_53_PM.png"
          alt="Logo"
          width={300}
          height={300}
          className="w-44 h-30 sm:w-56 sm:h-24 object-contain m-2"  
        />
        </Link>
      <div className="mr-2">
      <Link href="/register">
        <Button className="mr-2">SignUp</Button>
        </Link>
        <Link href="/login">
        <Button className="bg-white border border-black text-black">Login</Button>
        </Link>
      </div>
      </div>
      <div className="w-full sm:flex sm:justify-end items-center px-4">
       
        <div>
          <form className=" w-full mx-auto" action={search}>
            <div className="flex items-center ">
              {/* Search Input */}

                 <SearchBar value={marketInput} onChange={setMarketInput}  />
              {/* Location Dropdown */}
              <div className="relative w-full sm:w-48">
              
                <select
                  name="state"
                  className="w-full sm:w-48 h-12 sm:h-14 pl-10 pr-4 py-2 border border-gray-300  text-gray-700 focus:outline-none">
                  <option value="">Location</option>
                  {nigeriaStates.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
              </div>

              {/* Search Button */}
              <button className="bg-blue-500 text-white px-4 h-12 sm:h-14 rounded-r-md flex items-center justify-center">
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
