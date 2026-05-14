// Importa o framework Express
import express from "express";
import os from "os";
import https from "https";
import fs from "fs";
import path from "path";
import selfsigned from "selfsigned";
import dotenv from "dotenv";
import cors from "cors";

// Importa as rotas da aplicação
import router from "./routes";

// Importa o arquivo do banco para garantir que a conexão e a criação da tabela aconteçam ao iniciar
import "./database";

// Carrega as variáveis de ambiente do .env
dotenv.config();

// Cria a aplicação Express
const app = express();

/*
  Middleware para liberar o CORS (Cross-Origin Resource Sharing).
  Isso permite que o Integrador (em outra máquina/IP) consiga fazer requisições
  para esta API sem ser bloqueado pelos navegadores ou políticas de segurança de rede.
*/
app.use(cors());

/*
  Middleware para permitir que a API receba e interprete JSON no body.
*/
app.use(express.json());

/*
  Registra as rotas definidas no arquivo routes.ts.
*/
app.use(router);

// Pega a porta do .env ou usa 3000 por padrão
const PORT = parseInt(process.env.PORT || "3000", 10);

/*
  Configuração de Certificados SSL (HTTPS)
  Como o professor exigiu HTTPS, estamos gerando um certificado SSL local automaticamente
  para facilitar os testes de desenvolvimento.
*/
// Exporta a aplicação Express diretamente para a Vercel usar sem subir um servidor manual
export default app;

/*
  Inicia o servidor HTTPS manualmente APENAS se estivermos rodando localmente (fora da Vercel).
  Na Vercel, o HTTPS já é nativo e o servidor sobe automaticamente lendo o `export default app`.
*/
if (!process.env.VERCEL) {
  async function startServer() {
    const certsPath = path.join(__dirname, "..", "certs");
    if (!fs.existsSync(certsPath)) {
      fs.mkdirSync(certsPath);
    }

    const keyPath = path.join(certsPath, "server.key");
    const certPath = path.join(certsPath, "server.cert");

    let privateKey, certificate;

    if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
      privateKey = fs.readFileSync(keyPath, "utf8");
      certificate = fs.readFileSync(certPath, "utf8");
    } else {
      console.log("Gerando certificados SSL autoassinados para HTTPS...");
      const attrs = [{ name: "commonName", value: "localhost" }];
      
      const pems = await (selfsigned as any).generate(attrs, { days: 365 });
      
      privateKey = pems.private;
      certificate = pems.cert;
      
      fs.writeFileSync(keyPath, privateKey);
      fs.writeFileSync(certPath, certificate);
    }

    const credentials = { key: privateKey, cert: certificate };

    const httpsServer = https.createServer(credentials, app);

    httpsServer.listen(PORT, "0.0.0.0", () => {
      console.log(`🔒 Servidor Seguro rodando localmente em: https://localhost:${PORT}`);
      
      const interfaces = os.networkInterfaces();
      for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]!) {
          if (iface.family === "IPv4" && !iface.internal) {
            console.log(`🔒 Servidor Seguro acessível na rede em: https://${iface.address}:${PORT}`);
          }
        }
      }
    });
  }

  startServer().catch(err => {
    console.error("Erro ao inicializar o servidor:", err);
  });
}