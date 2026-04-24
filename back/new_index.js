import bdConnection from "./repo/bdConnection.js";
import User from "./models/user.js";
import express from "express";
import nodemon from "nodemon";
const app = express();


async function startApp() {
    try {
        console.log("--- Sistema Iniciando ---");

        const db = new bdConnection("meu_banco");
        const pool = await db.init();

        const userModel = new User(pool);
        await userModel.initializeTable();

        console.log("--- Sistema Pronto para Uso ---");

        // Aqui você iniciaria seu servidor Express, por exemplo:
        // app.listen(3000, () => { ... });

        //rota de registro de usuário
        app.post("/api/signup", async (req, res) => {
            try{
                const {nome, email, senha} = req.body

                const response = userModel.createUser(nome, email, senha)

                if(response.error === "Esse email está em uso"){
                    return res.statusCode(409).json({ error: response.error });
                }

                if(response.error === "É necesário preencher todos os campos."){
                    return res.statusCode(409).json({ error: response.error });
                }

                res.statusCode(201).json({id: response.id, nome: response.nome, email: response.email })

            }catch(error){
                console.error("POST /api/signup error:", error);
                res.status(500).json({ error: "Não foi possível criar a conta." });
            }
        });

    } catch (error) {
        console.error("Falha na inicialização:", error);
        process.exit(1); // Fecha o programa com erro
    }

}

startApp()