"use client";
<<<<<<< HEAD

=======
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
import Userdashboard from "@/components/userdashboard";
import Topbar from "@/components/topbar";
import profileUpdate from "@/actions/auth/profileUpdate";
import ProfileForm from "@/components/ProfileForm";
<<<<<<< HEAD
import { useUser } from "@/context/userContext";
import Image from "next/image";
import BannwerModalLogo from "@/components/bannerModel";
import LogoModel from "@/components/logoModel";

export default function Profile() {
  const profileJson = useUser();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Full-width Banner Image */}
      <div className="w-full h-48 relative overflow-hidden bg-gray-300">
        {profileJson?.Banner && (
          <Image
            src={profileJson.Banner}
            alt="Banner Image"
            layout="fill"
            objectFit="cover"
            className="rounded-b-lg"
          />
        )}

        {/* Logo (Avatar) */}
        <div className="absolute top-10 left-6">
          {profileJson?.avatar && (
            <Image
              src={profileJson.avatar}
              alt="Logo"
              width={100}
              height={100}
              className="h-32 w-32 rounded-full border-4 border-white shadow-lg"
            />
          )}
        </div>
      </div>

      <div className=" flex my-2 space-x-2 ">
        <LogoModel />
        <BannwerModalLogo />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-white shadow-md rounded-lg mx-4 md:mx-12 mt-6">
        <ProfileForm handler={profileUpdate} profile={profileJson} />
=======
import { redirect } from "next/navigation";
import { FastForwardIcon } from "lucide-react";
import { FaUserAltSlash } from "react-icons/fa";
import { useUser } from "@/context/userContext";

export default function Profile() {

  const profileJson = useUser();
 
  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Main Content Area */}
      <div className="flex-1 p-6 bg-gray-50 space-y-6 ">
        {/* Dashboard & Topbar */}
      <div className="col-span-full bg-blue-700 font-semibold text-white shadow-md p-4">
        <FaUserAltSlash className="inline-block mr-2" />
        Profile Page
        </div>
       
        <div className="min-w-2">
          {/* Profile Form */}
          <ProfileForm handler={profileUpdate} profile={profileJson} />
        </div>
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
      </div>
    </div>
  );
}
