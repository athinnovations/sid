import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { app, supabase } from "./src/api-app.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
  const PORT = 3000;

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
