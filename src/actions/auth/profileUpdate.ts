"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export default async function profileUpdate(state: any, formData: FormData) {
  const supabase = await createClient();

  // Authenticate user
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    console.error("Authentication error:", authError?.message);
    return { errors: { message: "Authentication error" } };
  }

  // Validation schema
  const schema = z.object({
    user_id: z.string().min(3, "User ID must be at least 3 characters long"),
    fname: z.string().min(3, "First name must be at least 3 characters long"),  
    lname: z.string().min(3, "Last name must be at least 3 characters long"),
    phone: z.string().min(10, "Phone number must be at least 10 characters long"),
    email: z.string().email("Invalid email address"),
    skills: z.string().min(3, "Skills must be at least 3 characters long"),
    busName: z.string().min(3, "Business name must be at least 3 characters long"),
  });

  const profileData = Object.fromEntries(formData);
  const validation = schema.safeParse(profileData);

  if (!validation.success) {
    return { errors: validation.error.flatten().fieldErrors };
  }

  const { error } = await supabase
    .from("user_profile")
    .update(validation.data)
    .eq("user_id", validation.data.user_id);

  if (error) {
    console.error("Profile update error:", error);
    return { errors: { message: "Failed to update profile" } };
  }

  // Debugging logs
  console.log("Revalidating path: /profile");

  // Ensure revalidation completes before redirect
  await revalidatePath("/profile");

  console.log("Revalidation completed, redirecting...");

  // Redirect to profile page
  redirect("/dashboard");

  return null; // Ensure no further execution happens
}
