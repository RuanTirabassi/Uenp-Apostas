// Importa o framework Express
import express from "express";
import os from "os";

// Importa as rotas da aplicação
import router from "./routes";

// Importa o arquivo do banco para garantir que a conexão e a criação da tabela aconteçam ao iniciar
import "./database";

// Cria a aplicação Express
const app = express();

/*
  Middleware para permitir que a API receba e interprete JSON no body.
  Exemplo:
  {
    "nome": "Carlos",
    "idade": 28,
    "chavePix": "carlos@email.com"
  }
*/
app.use(express.json());

/*
  Registra as rotas definidas no arquivo routes.ts.
  Como as rotas já foram criadas com "/apostadores", elas funcionarão diretamente.
*/
app.use(router);

/*
  Inicia o servidor na porta 3000 e no host 0.0.0.0 (para permitir acesso na rede local).
*/
app.listen(3000, "0.0.0.0", () => {
  console.log("Servidor rodando localmente em: http://localhost:3000");
  
  // Mostra o IP da rede local no terminal para facilitar o teste em outras máquinas
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]!) {
      if (iface.family === "IPv4" && !iface.internal) {
        console.log(`Servidor acessível na rede em: http://${iface.address}:3000`);
      }
    }
  }
});