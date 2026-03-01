import express from "express";
import { createClient } from "@supabase/supabase-js";
import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

console.log("Initializing API App...");
console.log("Supabase URL present:", !!process.env.SUPABASE_URL || "Using fallback");

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || "https://lpiqjlwotnlfpdhyykia.supabase.co";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxwaXFqbHdvdG5sZnBkaHl5a2lhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIzNTA5NjcsImV4cCI6MjA4NzkyNjk2N30.8hlXIN-CdQtBMcbZlgsnYHYjWOb8TZvLoMY7ogq8evU";
const supabase = createClient(supabaseUrl, supabaseKey);

console.log("Supabase client initialized");

// Initialize Cloudinary
if (process.env.CLOUDINARY_CLOUD_NAME) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log("Cloudinary initialized");
} else {
  console.log("Cloudinary config missing, skipping initialization");
}

const app = express();
app.use(express.json({ limit: '50mb' }));

// Health check route for debugging
app.get("/api/health", (req, res) => {
  res.json({ 
    status: "ok", 
    supabase: !!supabaseUrl,
    cloudinary: !!process.env.CLOUDINARY_CLOUD_NAME,
    env: process.env.NODE_ENV
  });
});

// API Routes
app.get("/api/profiles", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Supabase error fetching profiles:", error);
      return res.status(500).json({ error: error.message, details: error });
    }
    
    res.json(data || []);
  } catch (error) {
    console.error("Unexpected error fetching profiles:", error);
    res.status(500).json({ error: "Failed to fetch profiles" });
  }
});

app.get("/api/profiles/:id", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", req.params.id)
      .single();
    
    if (error) {
      console.error(`Supabase error fetching profile ${req.params.id}:`, error);
      return res.status(error.code === 'PGRST116' ? 404 : 500).json({ error: error.message });
    }
    
    if (!data) return res.status(404).json({ error: "Profile not found" });
    res.json(data);
  } catch (error) {
    console.error(`Unexpected error fetching profile ${req.params.id}:`, error);
    res.status(500).json({ error: "Failed to fetch profile" });
  }
});

app.post("/api/profiles", async (req, res) => {
  const { name, akhada_name, title, guru_name, birth_place, joining_date, contact_number, photo_url: base64Photo } = req.body;
  const id = Math.random().toString(36).substring(2, 10).toUpperCase();

  try {
    let finalPhotoUrl = base64Photo;

    // If photo is base64, upload to Cloudinary
    if (base64Photo && base64Photo.startsWith('data:image')) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(base64Photo, {
          folder: "akhada_profiles",
          public_id: id,
          overwrite: true,
        });
        finalPhotoUrl = uploadResponse.secure_url;
      } catch (cloudinaryErr) {
        console.error("Cloudinary upload failed, falling back to base64:", cloudinaryErr);
        finalPhotoUrl = base64Photo;
      }
    }

    const { data, error } = await supabase
      .from("profiles")
      .insert([{ 
        id, 
        name, 
        akhada_name, 
        title, 
        guru_name, 
        birth_place, 
        joining_date, 
        contact_number, 
        photo_url: finalPhotoUrl 
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create profile" });
  }
});

export { app, supabase };
