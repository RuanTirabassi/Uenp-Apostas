# 🎲 API - Apostadores (Microsserviço)

Este projeto é um **Microsserviço de Apostadores** desenvolvido em Node.js com TypeScript e SQLite. Ele foi construído para funcionar de forma "plugável" atrás de um **Integrador (API Gateway)** e está preparado para rodar na nuvem (Serverless) via **Vercel**.

---

## 🏗️ Como a Camada de Segurança vai funcionar com o Integrador

Para garantir alta segurança e alta disponibilidade na arquitetura distribuída, a comunicação entre o Integrador e esta API segue regras rígidas:

### 1. Roteamento Vercel (Único Ponto de Entrada Seguro)
A API de Apostadores terá o seu próprio deploy na Vercel (ex: `https://api-apostas.vercel.app`). A Vercel **já provê HTTPS nativo**. O Integrador deverá cadastrar esta URL nos seus arquivos de configuração. Todas as requisições HTTPS do usuário final chegam ao Integrador, e ele repassa as requisições HTTP/HTTPS para as URLs da Vercel que configuramos.

### 2. Autenticação entre Máquinas (JWT Validation)
Mesmo que o usuário final faça o login no Integrador, a nossa API precisa saber que a requisição está vindo realmente do Integrador e não de um hacker que descobriu a URL da Vercel. 
*   **O Integrador envia:** Em todas as requisições, ele tem que repassar o token no cabeçalho: `Authorization: Bearer <SEU_TOKEN_JWT>`.
*   **A API valida:** Nós possuímos um middleware global que pega esse token, abre e verifica se a "assinatura" bate usando a senha contida na variável `JWT_SECRET`. Se a senha não bater, o Integrador leva um erro `401 Unauthorized`.

### 3. Criptografia Automática (SQLite no Vercel)
A nossa API criptografa automaticamente dados sensíveis (Chave PIX) usando **AES-256-CBC**. 
*   **Detalhe Técnico da Vercel:** Como o ambiente da Vercel (Serverless) não permite salvar arquivos permanentes, nós configuramos o nosso SQLite para rodar no diretório `/tmp`. Isso significa que, na Vercel, **o banco será reiniciado periodicamente** (efêmero). Isso é perfeitamente válido e comum em entregas acadêmicas para provar o conceito de comunicação sem pagar por bancos SQL na nuvem.

---

## 🚀 Requisitos para o Desenvolvedor do Integrador

Se você está construindo a API Gateway, siga estes requisitos para plugar nossa API:

1. **Variável de Ambiente Compartilhada:** Me informe qual será a string secreta que você vai usar para assinar os seus tokens JWT. Eu preciso colocar essa exata mesma string na minha variável `JWT_SECRET` da Vercel para a comunicação funcionar.
2. **Ignorar Validação SSL Local:** Quando estivermos rodando localmente (sua máquina falando com a minha), a minha API gera um certificado SSL caseiro (autoassinado). O seu código precisa aceitar esse certificado sem dar erro (`verify=False` no Python, ou equivalente no Node/Java).
3. **CORS:** O CORS já está liberado na nossa API. Você não terá problemas de "Cross-Origin" ao chamar as nossas rotas.

---

## 📡 Contrato de Dados (Endpoints)

Todas as requisições abaixo DEVEM possuir o cabeçalho: `Authorization: Bearer <token>`

### 1. Listar Apostadores
- **Método HTTP:** `GET`
- **Rota:** `/apostadores`
- **Resposta (200):**
```json
[
  {
    "id": 1,
    "nome": "Carlos Silva",
    "idade": 28,
    "chave_pix": "carlos@email.com"
  }
]
```

### 2. Cadastrar Apostador
- **Método HTTP:** `POST`
- **Rota:** `/apostadores`
- **Body (JSON):**
```json
{
  "nome": "Paulo",
  "idade": 50,
  "chavePix": "paulo@email.com"
}
```
- **Resposta (201):** Retorna o objeto criado com o ID gerado pelo banco.

### 3. Atualizar e Deletar Apostadores
- **PUT /apostadores/:id**: Mesma estrutura do POST, atualiza os dados e retorna `200`.
- **DELETE /apostadores/:id**: Remove e retorna `200`.

---

## 💻 Como rodar e testar localmente (Para Desenvolvedores)

Se quiser clonar o repositório da API de apostadores para rodar no seu computador junto com o Integrador:

```bash
git clone https://github.com/RuanTirabassi/Uenp-Apostas
cd Uenp-Apostas
npm install
```

Crie o arquivo `.env`:
```env
JWT_SECRET=super-secreto-faculdade-integrador-2026
CRYPTO_SECRET=12345678901234567890123456789012
```

Inicie:
```bash
npm run dev
```
O console mostrará os IPs da sua máquina (Ex: `https://192.168.x.x:3000`). Você pode usar esse IP no Integrador para testes locais antes de subir na Vercel!
