"use server";
import { createClient } from '@/utils/supabase/server';
import { z } from "zod";
import { Resend } from 'resend';

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

  if (!validated.success) {
    return {
      ...prev,
      errors: validated.error.flatten().fieldErrors,
      isSubmitting: false,
    };
  }

  const supabase = await createClient();

  const [emailCheck, phoneCheck] = await Promise.all([
    supabase.from('user_profile').select('user_id').eq('email', validated.data.email).maybeSingle(),
    supabase.from('user_profile').select('user_id').eq('phone', validated.data.phone).maybeSingle(),
  ]);

  if (emailCheck.data || phoneCheck.data) {
    return {
      ...prev,
      errors: {
        email: emailCheck.data ? "Email already exists" : undefined,
        phone: phoneCheck.data ? "Phone number already exists" : undefined,
      },
      isSubmitting: false,
    };
  }

  const { data, error } = await supabase.auth.signUp({
    email: validated.data.email,
    password: validated.data.password,
  });

  try {
    await resend.emails.send({
      from: `KwikFix <support@kwikfix.ng>`,
      to: validated.data.email,
      subject: `Welcome to KwikFix - Your Trusted Handyman Platform!`, 
      html: `
        <div style="font-family: Arial, sans-serif; color: #333;">
          <img src="https://fbpdbcxjavianaboavoo.supabase.co/storage/v1/object/public/images//KwikFix-Logo-03-10-2025_09_53_PM.png" alt="KwikFix Logo" width="240"/>
      
          <p>Hi <strong>${validated.data.fname}</strong>,</p>
          <p>Thank you for joining <strong>KwikFix</strong> – where skilled professionals connect with those in need of reliable services.</p>
          <p>Here are your details:</p>
          <ul>
            <li><strong>Email:</strong> ${validated.data.email}</li>
            <li><strong>Business Name:</strong> ${validated.data.busName}</li>
            <li><strong>Phone:</strong> ${validated.data.phone}</li>
            <li><strong>Skill Category:</strong> ${validated.data.category}</li>
          </ul>
          <p>We’re excited to have you on board! Get ready to connect with clients and grow your business.</p>
          <p>Best Regards,</p>
          <p><strong>The KwikFix Team</strong></p>
         
          <hr style="margin-top: 20px; border: none; border-top: 1px solid #ddd;">
          <p style="font-size: 12px; color: #666; text-align: center;">
            If you no longer wish to receive emails from us, 
            <a href="https://kwikfix.ng/unsubscribe?email=${encodeURIComponent(validated.data.email)}" style="color: #007bff; text-decoration: none;">unsubscribe here</a>.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error('Error sending email:', error);
  }
  

  if (error) {
    return {
      ...prev,
      errors: { general: error.message },
      isSubmitting: false,
    };
  }

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

  return {
    ...prev,
    errors: {},
    isSubmitting: false,
    isValid: true,
    successMessage: "Registration successful! Redirecting to login...",
  };
}
