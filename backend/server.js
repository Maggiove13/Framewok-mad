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
//app.options("*", cors());

//Middleware para parsear json
app.use(express.json()); //parsear json

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
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


// Iniciar servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
