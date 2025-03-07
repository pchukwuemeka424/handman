"use client";

import { useUser } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import supabaseDb from "@/utils/supabase-db";

import { Button } from "@/components/ui/button";
import  Link from "next/link";  

const Dashboard: React.FC = () => {
  const user = useUser();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [earnings, setEarnings] = useState<number>(0);
  const [jobRequests, setJobRequests] = useState<number>(0);
  const [availability, setAvailability] = useState<boolean>(true);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchData = async () => {
      try {
        const [{ data: ratingData }, { count: messageCount }, { data: earningsData }, { count: jobCount }] = await Promise.all([
          supabaseDb.from("rating").select("stars").eq("user_id", user.user_id),
          supabaseDb.from("message").select("id", { count: "exact" }).eq("user_id", user.user_id),
          supabaseDb.from("transactions").select("amount").eq("user_id", user.user_id),
          supabaseDb.from("jobs").select("id", { count: "exact" }).eq("user_id", user.user_id)
        ]);

        const totalStars = ratingData?.reduce((acc, rating) => acc + (parseFloat(rating.stars) || 0), 0) || 0;
        const reviewCount = ratingData?.length || 0;
        setAverageRating(reviewCount > 0 ? Math.round((totalStars / reviewCount) * 10) / 10 : 0);
        setNotificationCount(messageCount ?? 0);
        setEarnings(earningsData?.reduce((acc, txn) => acc + txn.amount, 0) || 0);
        setJobRequests(jobCount ?? 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      }
    };

    fetchData();
  }, [user?.user_id]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="max-w-4xl w-full space-y-4">
        <h1 className="text-3xl font-bold text-center text-gray-800">
          Welcome, <span className="capitalize">{user?.fname ?? "Guest"} {user?.lname ?? ""}</span>
        </h1>
        <div className="text-center text-2xl font-semibold text-gray-700">{user?.busName}</div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 my-4">
          <Link href="/dashboard/profile">
          <Button variant="default">Manage Profile</Button>
          </Link>
          <Link href="/dashboard/message">
          <Button variant="secondary">Message</Button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Rating</h2>
            <p className="text-2xl font-bold text-yellow-400">{averageRating ?? "Loading..."} ⭐</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Notifications</h2>
            <p className="text-2xl font-bold text-red-500">{notificationCount} New</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Earnings</h2>
            <p className="text-2xl font-bold text-green-500">₦{earnings}</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-lg text-center">
            <h2 className="text-xl font-semibold text-gray-700">Job Requests</h2>
            <p className="text-2xl font-bold text-blue-500">{jobRequests} Pending</p>
          </div>
        </div>

        {/* Availability Toggle */}
        <div className="flex items-center justify-center mt-4">
          <span className="text-gray-700 font-semibold">Availability:</span>
        
          <span className={`ml-2 font-semibold ${availability ? "text-green-600" : "text-red-600"}`}>
            {availability ? "Available" : "Busy"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
