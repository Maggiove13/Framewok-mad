const express = require("express");
const cors = require("cors");
const { LinkController, CommentController } = require("./controllers/controller");

const app = express();
const port = 3000;

// Middleware cors
app.use(cors({
    origin: [
        'http://127.0.0.1:5500', 
        'http://localhost:5500', 
        'http://127.0.0.1:5173',
        'http://localhost:5173',  //puerto 5173  Svelte y React
        'http://localhost:3000',
        'http://localhost:4200',  
        'http://127.0.0.1:4200'  
    ],
    credentials: true,  // Permite credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  
    allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'Authorization'
    ],
    exposedHeaders: ['Content-Range', 'X-Content-Range']
}));

// Manejo de preflight OPTIONS
app.options("*", cors());
//parsear json
app.use(express.json());

// Rutas de prueba para verificar conexión
app.get("/", (req, res) => {
    res.send("API corriendo correctamente 🚀");
});

// Rutas de la API
const apiRouter = express.Router();

apiRouter.post("/links", LinkController.createLink);
apiRouter.get("/links", LinkController.getAllLinks);
apiRouter.get("/links/:linkId", LinkController.getLinkById);
apiRouter.put("/links/:linkId", LinkController.updateLink);
apiRouter.delete("/links/:linkId", LinkController.deleteLink);
apiRouter.post("/links/:linkId/vote", LinkController.voteLink);

apiRouter.post("/links/:linkId/comments", CommentController.createComment);
apiRouter.get("/links/:linkId/comments", CommentController.getComments);

// Usar el router
app.use("/api", apiRouter);

// Middleware de manejo de errores
app.use((err, req, res, next) => {
    console.error("Error en el servidor:", err);
    res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
});

// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
