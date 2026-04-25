import bdConnection from "./repo/bdConnection.js";
import User from "./microsservico/user.js";
import Reviews from "./microsservicos/reviews.js"
import express, { json } from "express";
import nodemon from "nodemon";

const app = express();
app.use(express.json());

const JWT_SECRET = "super_secret_key"; 
const JWT_EXPIRATION = "2h";


async function startApp() {
    try {
        console.log("--- Sistema Iniciando ---");

        //criação do bd e tabela usuarios
        const dbUser = new bdConnection("Usuarios");
        const poolUser = await dbUser.init();
        const userModel = new User(poolUser);
        await userModel.initializeTable();

        //criação do bd e tabela usuarios
        const dbReviews = new bdConnection("Depoimentos");
        const poolReviews = await dbReviews.init();
        const reviewsModel = new Reviews(poolReviews);
        await reviewsModel.initializeTable();

        console.log("--- Sistema Pronto para Uso ---");

        userRoutes(userModel);
        reviewsRoutes(reviewsModel);
        
        app.listen(3000, () => console.log("🚀 Servidor rodando na porta 3000"));

    } catch (error) {
        console.error("Falha na inicialização:", error);
        process.exit(1); // Fecha o programa com erro
    }

}


function userRoutes(userModel) {
    
    const authenticate = (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ error: "Token de autenticaçao ausente." });
        }

        const token = authHeader.split(" ")[1];
        try {
            req.user = jwt.verify(token, JWT_SECRET);
            next();
        } catch (error) {
            return res.status(401).json({ error: "Token invalido ou expirado." });
        }
    };

    //rota de registro de usuário 
    app.post("/api/signup", async (req, res) => {
        try {
            const { nome, email, senha } = req.body

            const response = await userModel.createUser(nome, email, senha)

            if (!response[0]) {
                return res.statusCode(409).json({ error: response[1].error});
            }

            res.statusCode(201).json({ id: response.id, nome: response.nome, email: response.email })

        } catch (error) {
            console.error("POST /api/signup error:", error);
            res.status(500).json({ error: "Não foi possível criar a conta." });
        }
    });

    //rota de login
    app.post("/api/login", async (req, res) => {
        try {
            const { email, senha } = req.body;
            const normalizedEmail = email.trim().toLowerCase()

            const response = await userModel.findByEmail(normalizedEmail, senha)

            if (!response[0]) {
                return res.status(401).json({error: response[1].error})
            }

            const token = jwt.sign({ id: user.id, nome: user.nome, email: user.email }, JWT_SECRET, {
                  expiresIn: JWT_EXPIRATION,
            });

            res.status(201).json({ token, user: { id: user.id, nome: user.nome, email: user.email } });


        } catch (error) {
            console.error("POST /api/login error:", error);
            res.status(500).json({ error: "Não é possível fazer login com essa conta." });
        }
    });

    //rota de obtenção das informações do usuário já logado
    app.get("/api/me", authenticate, (req, res) =>{
        try {
            const userId = req.user.id
            const response = await userModel.findById(userId)
            res.status(200).json({user: response})
        } catch (error) {
            console.error("GET /api/me error:", error);
            res.status(500).json({ error: "Não foi possível buscar o perfil." });
        }
    });
}

function reviewsRoutes(reviewsModel){
}

startApp()