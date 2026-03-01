import express from "express";
import { createServer as createViteServer } from "vite";
import { createClient } from "@supabase/supabase-js";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || "";
const supabaseKey = process.env.SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

// Attempt to initialize storage bucket
async function initStorage() {
  try {
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();
    if (listError) throw listError;

    const exists = buckets.find(b => b.name === 'photos');
    if (!exists) {
      console.log("Attempting to create 'photos' bucket...");
      const { error: createError } = await supabase.storage.createBucket('photos', {
        public: true,
        allowedMimeTypes: ['image/jpeg', 'image/png'],
        fileSizeLimit: 5242880 // 5MB
      });
      if (createError) {
        console.warn("Could not auto-create bucket (this is normal with anon keys):", createError.message);
      } else {
        console.log("Successfully created 'photos' bucket.");
      }
    }
  } catch (err) {
    console.warn("Storage initialization skipped (likely missing permissions or bucket already exists).");
  }
}

async function startServer() {
  await initStorage();
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' })); // Increase limit for base64 photos

  // API Routes
  app.get("/api/profiles", async (req, res) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });
      
      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error(error);
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
      
      if (error) throw error;
      if (!data) return res.status(404).json({ error: "Profile not found" });
      res.json(data);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    const { name, akhada_name, title, guru_name, birth_place, joining_date, contact_number, photo_url: base64Photo } = req.body;
    const id = Math.random().toString(36).substring(2, 10).toUpperCase();

    try {
      let finalPhotoUrl = base64Photo;

      // If photo is base64, upload to Supabase Storage
      if (base64Photo && base64Photo.startsWith('data:image')) {
        try {
          const buffer = Buffer.from(base64Photo.split(',')[1], 'base64');
          const fileName = `${id}-${Date.now()}.jpg`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('photos')
            .upload(fileName, buffer, {
              contentType: 'image/jpeg',
              upsert: true
            });

          if (uploadError) {
            // Check specifically for "Bucket not found"
            if (uploadError.message?.includes('not found') || (uploadError as any).status === 404) {
              console.error("Supabase Storage Error: The 'photos' bucket does not exist. Please create it in your Supabase dashboard.");
              // Fallback: Store as base64 in the database if storage fails (optional, but keeps the app working)
              finalPhotoUrl = base64Photo;
            } else {
              throw uploadError;
            }
          } else {
            const { data: publicUrlData } = supabase.storage
              .from('photos')
              .getPublicUrl(fileName);
            
            finalPhotoUrl = publicUrlData.publicUrl;
          }
        } catch (storageErr) {
          console.error("Storage upload failed, falling back to base64:", storageErr);
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

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
