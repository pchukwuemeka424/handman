"use client";

import React, { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import ClientLayout from "@/components/ClientLayout";
import { UserProvider } from "@/context/userContext";


export default function Layout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: authUser, error: authError } = await supabase.auth.getUser();

      if (authError || !authUser?.user) {
        console.error("Error getting user:", authError);
        router.push("/");
      } else {
        setLoading(false);
      }
    };

    fetchUser();
  }, [supabase, router]);

  if (loading) return <div className="spinner"><i className="fas fa-spinner fa-spin"></i></div>;

  return (
    <UserProvider>
      <ClientLayout>{children}</ClientLayout>
    </UserProvider>
  );
}
