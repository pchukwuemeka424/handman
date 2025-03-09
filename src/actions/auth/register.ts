"use server";

import { createClient } from '@/utils/supabase/server';
import { z } from "zod";
import { Resend } from 'resend';
import { stat } from 'fs';

interface FormData {
  get: (key: string) => string | null;
}

interface RegisterState {
  errors: Record<string, string>;
  isSubmitting: boolean;
  isValid: boolean;
  successMessage?: string;
}

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function register(prev: RegisterState, formData: FormData) {
  // Define the registration form schema using Zod
  const registerSchema = z.object({
    fname: z.string().min(3, { message: "First name is required" }),
    lname: z.string().min(3, { message: "Last name is required" }),
    email: z.string().email({ message: "Invalid email format" }),
    busName: z.string().min(3, { message: "Business name is required" }),
    phone: z.string().regex(/^\+?\d+$/, { message: "Invalid phone number format" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    category: z.string().min(3, { message: "Category is required" }),
    state: z.string().min(3, { message: "State is required" }),
    city: z.string().min(3, { message: "City is required" }),
  });

  // Validate the form data using Zod
  const validated = registerSchema.safeParse({
    fname: formData.get("fname"),
    lname: formData.get("lname"),
    email: formData.get("email"),
    busName: formData.get("busName"),
    phone: formData.get("phone"),
    password: formData.get("password"),
    category: formData.get("category"),
    state: formData.get("state"),
    city: formData.get("city"),
  });

  // If validation fails, return errors and previous values
  if (!validated.success) {
    return {
      ...prev,
      errors: validated.error.flatten().fieldErrors,
      email: formData.get("email"),
      password: formData.get("password"),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      busName: formData.get("busName"),
      phone: formData.get("phone"),
      category: formData.get("category"),
      state: formData.get("state"),
      city: formData.get("city"),
      isSubmitting: false,
    };
  }

  const supabase = await createClient();

  // Check for existing user by email or phone
  const [emailCheck, phoneCheck] = await Promise.all([
    supabase.from('user_profile').select('user_id').eq('email', validated.data.email).maybeSingle(),
    supabase.from('user_profile').select('user_id').eq('phone', validated.data.phone).maybeSingle(),
  ]);

  // If either email or phone already exists, return error
  if (emailCheck.data || phoneCheck.data) {
    return {
      ...prev,
      errors: {
        email: emailCheck.data ? "Email already exists" : undefined,
        phone: phoneCheck.data ? "Phone number already exists" : undefined,
      },
      isSubmitting: false,
      email: formData.get("email"),
      password: formData.get("password"),
      fname: formData.get("fname"),
      lname: formData.get("lname"),
      busName: formData.get("busName"),
      phone: formData.get("phone"),
      category: formData.get("category"),
      state: formData.get("state"),
    };
  }

  // Register the user in Supabase Auth
  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  });

  if (error) {
    return {
      ...prev,
      errors: { general: error.message },
      isSubmitting: false,
    };
  }

  // Insert user data into the 'user_profile' table
  const response = await supabase.from('user_profile').insert({
    user_id: data.user?.id,
    fname: validated.data.fname,
    lname: validated.data.lname,
    busName: validated.data.busName,
    phone: validated.data.phone,
    email: validated.data.email,
    kyc_status: "Pending",
    skills: validated.data.category,
    state: validated.data.state,
    city: validated.data.city
  });

  if (response.error) {
    return {
      ...prev,
      errors: { general: response.error.message },
      isSubmitting: false,
    };
  }

  // If registration is successful, return success message
  return {
    ...prev,
    errors: {},
    isSubmitting: false,
    isValid: true,
    successMessage: "Registration successful! Redirecting to login...",
  };
}
