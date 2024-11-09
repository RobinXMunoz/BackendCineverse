import express from "express";
import dotenv from "dotenv";
import admin from "firebase-admin";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

// Configuración de dotenv
dotenv.config();

// Obtener la ruta del directorio actual en módulos ES
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// Inicializar la app de Express
const app = express();
const port = parseInt(process.env.PORT) || 3001;

// Configurar Firebase Admin SDK
const serviceAccountPath = "C:/Users/Usuario/Documents/Universidad/Programacion Web/CineverseApi/Backend/Base.json";
const serviceAccount = JSON.parse(await fs.readFile(serviceAccountPath, "utf-8"));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

app.use(cors());
app.use(express.json());

// **Ruta de bienvenida**
app.get('/', (req, res) => {
  res.send("Bienvenido a la API de Cineverse");
});

// Endpoint para obtener todos los posts
app.get("/posts", async (req, res) => {
  try {
    const snapshot = await db.collection("posts").get();
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(posts);
  } catch (error) {
    console.error("Error al obtener posts:", error);
    res.status(500).json({ mensaje: "Error al obtener posts" });
  }
});

// Endpoint para crear un nuevo post
app.post("/posts", async (req, res) => {
  const { title, description, images, value } = req.body;

  try {
    const newPost = {
      title,
      description,
      images: Array.isArray(images) ? images : [images],
      value,
    };

    const docRef = await db.collection("posts").add(newPost);
    res.json({
      mensaje: "Post creado",
      post: { id: docRef.id, ...newPost },
    });
  } catch (error) {
    console.log("Error al crear el post:", error);
    res.status(404).json({
      mensaje: "Error al crear el post",
    });
  }
});

// Endpoint para actualizar un post por ID
app.patch("/posts/:id", async (req, res) => {
  const postId = req.params.id;
  const { title, description, images, value } = req.body;

  try {
    const postRef = db.collection("posts").doc(postId);
    await postRef.update({
      title,
      description,
      images: Array.isArray(images) ? images : [images],
      value,
    });

    res.json({
      mensaje: "Post actualizado",
    });
  } catch (error) {
    console.error("Error al actualizar el post:", error);
    res.status(404).json({
      mensaje: "Error al actualizar el post",
    });
  }
});

// Endpoint para eliminar un post por ID
app.delete("/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const postRef = db.collection("posts").doc(postId);
    await postRef.delete();

    res.json({
      mensaje: "Post eliminado",
    });
  } catch (error) {
    console.error("Error al eliminar el post:", error);
    res.status(404).json({
      mensaje: "Error al eliminar el post",
    });
  }
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
