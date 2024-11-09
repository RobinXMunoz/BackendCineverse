import express from "express";
import cors from "cors"; // Importar CORS
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, addDoc, doc, deleteDoc } from "firebase/firestore"; // Añadir las funciones de Firestore

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAwzANMiNODchXML3J_yZuYE5I8CV1m_kU",
  authDomain: "basecineverse.firebaseapp.com",
  projectId: "basecineverse",
  storageBucket: "basecineverse.firebasestorage.app",
  messagingSenderId: "1023052502640",
  appId: "1:1023052502640:web:f003dc323256f7672986b5"
};

// Inicializa la aplicación Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

const app = express();
const port = parseInt(process.env.PORT) || 3001;

// Habilitar CORS, asegurándose de que solo se permiten solicitudes desde http://localhost:3000
app.use(cors({
  origin: 'http://localhost:3000',  // Permite solicitudes solo desde este origen
})); 

app.use(express.json()); 

// Rutas
app.get("/posts", async (req, res) => {  
  try {
    const postsCollection = collection(db, "posts");  
    const postsSnapshot = await getDocs(postsCollection);
    const postsList = postsSnapshot.docs.map(doc => doc.data());
    res.json(postsList);
  } catch (error) {
    console.error("Error getting posts: ", error);
    res.status(500).json({ error: "Error al obtener los posts" });
  }
});

app.post("/posts", async (req, res) => { 
  try {
    const newPost = req.body; 
    const postsCollection = collection(db, "posts");  
    const docRef = await addDoc(postsCollection, newPost);
    res.status(201).json({ mensaje: "Post creado", id: docRef.id });
  } catch (error) {
    console.error("Error adding post: ", error);
    res.status(500).json({ error: "Error al crear el post" });
  }
});

app.delete("/posts/:id", async (req, res) => {  
  const { id } = req.params;
  try {
    const postRef = doc(db, "posts", id);  
    await deleteDoc(postRef);
    res.json({ mensaje: "Post eliminado" });
  } catch (error) {
    console.error("Error deleting post: ", error);
    res.status(500).json({ error: "Error al eliminar el post" });
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});
