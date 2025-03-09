"use client";

import { useUser } from "@/context/userContext";
import React, { useEffect, useState } from "react";
import supabaseDb from "@/utils/supabase-db";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Star, Bell, User, ClipboardList } from "lucide-react";

const Dashboard: React.FC = () => {
  const user = useUser();
  const [averageRating, setAverageRating] = useState<number | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);

  useEffect(() => {
    if (!user?.user_id) return;

    const fetchData = async () => {
      try {
        const [{ data: ratingData }, { count: messageCount }] = await Promise.all([
          supabaseDb.from("rating").select("stars").eq("user_id", user.user_id),
          supabaseDb.from("message").select("id", { count: "exact" }).eq("user_id", user.user_id),
        ]);

        const totalStars = ratingData?.reduce((acc, rating) => acc + (parseFloat(rating.stars) || 0), 0) || 0;
        const reviewCount = ratingData?.length || 0;
        setAverageRating(reviewCount > 0 ? Math.round((totalStars / reviewCount) * 10) / 10 : 0);
        setNotificationCount(messageCount ?? 0);
      } catch (error) {
        console.error("Error fetching dashboard data:", error.message);
      }
    };

    fetchData();
  }, [user?.user_id]);

  return (
    <div className="min-h-screen flex flex-col items-center p-6">
      <div className="max-w-3xl w-full ">
        <h1 className="text-xl sm:text-4xl font-extrabold text-center text-gray-800">
          Welcome, <span className="capitalize">{user?.fname ?? "Guest"} {user?.lname ?? ""}</span>
        </h1>
        <div className="text-center text-lg font-medium text-gray-600">{user?.busName}</div>

        {/* Quick Actions */}
        <div className="flex justify-center gap-4 mt-6">
          <Link href="/dashboard/profile">
            <Button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-blue-600">
              <User className="w-5 h-5" /> Profile
            </Button>
          </Link>
          <Link href="/dashboard/message">
            <Button className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg shadow-md hover:bg-gray-300">
              <Bell className="w-5 h-5" /> Messages
            </Button>
          </Link>
        </div>

        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
          <div className="flex flex-col items-center p-6 rounded-xl bg-yellow-100 text-yellow-700 shadow-md">
            <Star className="w-10 h-10" />
            <h2 className="text-lg font-semibold mt-2">Rating</h2>
            <p className="text-3xl font-bold">{averageRating ?? "Loading..."} ⭐</p>
          </div>
          <div className="flex flex-col items-center p-6 rounded-xl bg-red-100 text-red-700 shadow-md">
            <Bell className="w-10 h-10" />
            <h2 className="text-lg font-semibold mt-2">Notifications</h2>
            <p className="text-3xl font-bold">{notificationCount} New</p>
          </div>
        </div>

        {/* Subscription Plan Details */}
        <div className="mt-6 p-4 bg-green-100 rounded-xl text-green-700 shadow-md flex flex-col items-center">
          <ClipboardList className="w-10 h-10" />
          <h2 className="text-lg font-semibold mt-2">Plan Details</h2>
          <p className="text-xl font-bold">{user?.subscription} Plan</p>
          <p className="text-sm text-gray-600">
            Started On {user?.created_at ? new Date(user.created_at).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;