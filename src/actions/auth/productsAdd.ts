"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface FormInput {
<<<<<<< HEAD
  images: string[];
  user_id: string | null;
=======
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  stateLocal: string;
  image: string | null;
  user_id: string | null;
  agentId: string | null;
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
}

export default async function addProduct(state: any, formData: FormData) {
  const supabase = await createClient();
  const userDetails = await supabase.auth.getUser();
  const user_id = userDetails.data?.user?.id || null;
  
<<<<<<< HEAD
  const formInput: FormInput = {
    images: [],
    user_id: user_id,
  };

  const imageFiles = formData.getAll("image") as File[];
  if (!imageFiles.length) {
    return { errors: { message: "At least one image file is required." } };
  }

  const uploadedImagePaths: string[] = [];

  for (const imageFile of imageFiles) {
=======

  const formInput: FormInput = {
    name: formData.get("name")?.toString() || "",
    description: formData.get("description")?.toString() || "",
    price: formData.get("price") ? parseFloat(formData.get("price")?.toString() || "0") : 0,
    category: formData.get("category")?.toString() || "",
    stock: formData.get("stock") ? parseInt(formData.get("stock")?.toString() || "0", 10) : 0,
    stateLocal: formData.get("state")?.toString() || "",
    image: null,
    user_id: user_id,
    agentId: formData.get("agentId")?.toString() || null,
  };

  const imageFile = formData.get("image") as File | null;
  if (!imageFile) {
    return { errors: { message: "Image file is required." } };
  }

  // Handle compressed image if provided by the client
  const compressedImageFile = formData.get("compressed_image") as File | null;

  if (compressedImageFile) {
    const imageBuffer = await compressedImageFile.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    const fileName = `${Date.now()}-${compressedImageFile.name}`;
    const filePath = `public/compressed/${fileName}`;

    // Upload the compressed image directly to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products_image")
      .upload(filePath, buffer, {
        contentType: compressedImageFile.type,
      });

    if (uploadError) {
      console.error("Error uploading compressed image:", uploadError);
      return { errors: { message: "Error uploading compressed image." } };
    }

    formInput.image = filePath;
  } else {
    // If no compressed image is provided, handle the original image upload
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b
    const imageBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(imageBuffer);

    const fileName = `${Date.now()}-${imageFile.name}`;
    const filePath = `public/${fileName}`;

<<<<<<< HEAD
    const { error: uploadError } = await supabase.storage
      .from("images")
      .upload(filePath, buffer, {
        contentType: imageFile.type,
      });

    if (uploadError) {
      console.error("Error uploading image:", uploadError);
      return { errors: { message: "Error uploading images." } };
    }

    uploadedImagePaths.push(filePath);
  }

  formInput.images = uploadedImagePaths;

  const { error: insertError } = await supabase
    .from("images")
    .insert(
      uploadedImagePaths.map((imagePath) => ({
        image: imagePath,
        user_id: user_id,
      }))
    );

  if (insertError) {
    console.error("Error inserting images:", insertError);
    return { errors: { message: "Error inserting images." } };
  }

  console.log("Images uploaded successfully:", uploadedImagePaths);
=======
    // Upload the original image directly to Supabase storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("products_image")
      .upload(filePath, buffer, {
        contentType: imageFile.type, // Use the original file's content type
      });

    if (uploadError) {
      console.error("Error uploading original image:", uploadError);
      return { errors: { message: "Error uploading image." } };
    }

    formInput.image = filePath;
  }

  // Insert product into the database
  const { data: productData, error: insertError } = await supabase
    .from("products")
    .insert({
      title: formInput.name,
      description: formInput.description,
      price: formInput.price,
      category: formInput.category,
      stock: formInput.stock,
      image: formInput.image,
      state: formInput.stateLocal,
      id: user_id,
      agentId: formInput.agentId,
    });

  if (insertError) {
    console.error("Error inserting product:", insertError);
    return { errors: { message: "Error inserting product." } };
  }

  console.log("Product added successfully:", productData);
>>>>>>> 289a2ea15e8b55fb67a7d96029f3aeb75773f25b

  return redirect("/dashboard/productlist");
}
