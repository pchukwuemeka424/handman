"use client";

import { useActionState, useEffect } from "react";
import register from "@/actions/auth/register";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { AiOutlineArrowLeft } from "react-icons/ai";
import MultiSelectCombobox from "@/components/MultiSelectCombobox";
import SelectedState from "@/components/selectedState";

export default function Register() {
  const initialState = {
    errors: undefined,
    isSubmitting: false,
    isValid: false,
    successMessage: undefined,
  };

  const [prev, action, isPending] = useActionState(register, initialState);
  
  useEffect(() => {
    if (prev?.successMessage) {
      setTimeout(() => {
        window.location.href = "/dashboard"; // Redirect after 3 seconds
      }, 3000);
    }
  }, [prev?.successMessage]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <div className="flex items-center mb-4">
          <Link href="/">
            <AiOutlineArrowLeft className="text-xl cursor-pointer" />
          </Link>
          <h2 className="text-2xl font-bold text-gray-900 mx-auto">Join as a skilled professional</h2>
        </div>
        <p className="text-center text-gray-600 mb-4">
          Sign up as a skilled professional to connect with clients and offer handyman services.
        </p>
        
        {prev?.successMessage && (
          <div className="text-green-600 text-center font-semibold mb-4">
            {prev.successMessage}
          </div>
        )}

        {prev?.errors?.general && (
          <div className="text-red-500 text-center font-semibold mb-4">
            {prev.errors.general}
          </div>
        )}

        <form className="space-y-4" action={action}>
         <div className="flex  gap-2">
         <div>
         <Input type="text" name="fname" placeholder="First Name" defaultValue={prev?.fname || ""} />
          {prev?.errors?.fname && <span className="text-red-500 text-sm">{prev.errors.fname}</span>}

         </div>
         <div>
         <Input type="text" name="lname" placeholder="Last Name" defaultValue={prev?.lname || ""} />
         {prev?.errors?.lname && <span className="text-red-500 text-sm">{prev.errors.lname}</span>}
         </div>
          
         </div>
         <div className="flex gap-2">
         <div>
         <Input type="text" name="busName" placeholder="Business Name" defaultValue={prev?.busName || ""} />
          {prev?.errors?.busName && <span className="text-red-500 text-sm">{prev.errors.busName}</span>}

         </div>
         <div>
         <Input type="tel" name="phone" placeholder="Phone Number" defaultValue={prev?.phone || ""} />
          {prev?.errors?.phone && <span className="text-red-500 text-sm">{prev.errors.phone}</span>}
          
         </div>
         </div>
          <Input type="email" name="email" placeholder="Email" defaultValue={prev?.email || ""} />
          {prev?.errors?.email && <span className="text-red-500 text-sm">{prev.errors.email}</span>}
          
          <Input type="password" name="password" placeholder="Password" defaultValue={prev?.password || ""} />
         
          {prev?.errors?.password && <span className="text-red-500 text-sm">{prev.errors.password}</span>}
         <SelectedState />
          <MultiSelectCombobox />
          <Button type="submit" disabled={isPending} className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition">
            {isPending ? "Registering..." : "Register"}
          </Button>
        </form>
      </div>
    </div>
  );
}
