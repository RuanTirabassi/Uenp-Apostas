# 🎲 API Apostadores (Technical Specs & API Reference)

Esta é a documentação técnica da API de Apostadores. Ela detalha todos os endpoints, contratos de dados e requisitos de autenticação para integração.

---

## 🌐 URLs de Acesso e Ambientes

Para utilizar a API, utilize a URL base correspondente ao ambiente desejado:

| Ambiente | URL Base | Protocolo |
| :--- | :--- | :--- |
| **Produção (Vercel)** | `https://api-apostadores-fight-azure.vercel.app/` | HTTPS (Nativo) |
| **Desenvolvimento** | `https://localhost:3000` | HTTPS (Autoassinado) |

### 🔒 Observação sobre HTTPS Local
Ao rodar a API localmente, ela gera automaticamente certificados SSL para simular um ambiente seguro. 
- Em ferramentas como **Insomnia** ou **Postman**, você deve desativar a opção **"SSL Certificate Verification"** nas configurações para conseguir realizar as chamadas sem erro de certificado.
- Em produção (Vercel), a validação de segurança é padrão e não requer configurações extras.

---

## 🛠️ Stack Técnica
- **Runtime:** Node.js + Express 5.
- **Linguagem:** TypeScript.
- **Banco de Dados:** Vercel Postgres (Neon).
- **Segurança:** `jsonwebtoken` (Auth) e `crypto` (AES-256-CBC).

---

## 🔐 Fluxo de Autenticação

A API utiliza autenticação baseada em **Bearer Token (JWT)**. Todas as rotas, com exceção da rota de login, exigem a presença do token no cabeçalho das requisições.

### 1. Obter Token (Login)
- **Método:** `POST`
- **Rota:** `/login`
- **Request Body:**
```json
{
  "usuario": "admin",
  "senha": "123"
}
```
- **Response (200 OK):**
```json
{
  "auth": true,
  "token": "eyJhbGciOiJIUzI1..."
}
```

---

## 📡 Referência de Endpoints

### 1. Listar todos os apostadores
Retorna a lista completa de apostadores cadastrados.
- **Método:** `GET`
- **Rota:** `/apostadores`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
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
*(Nota: O campo retornado é `chave_pix` em snake_case)*

---

### 2. Buscar apostador por ID
- **Método:** `GET`
- **Rota:** `/apostadores/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "id": 1,
  "nome": "Carlos Silva",
  "idade": 28,
  "chave_pix": "carlos@email.com"
}
```
- **Response (404 Not Found):**
```json
{
  "mensagem": "Apostador não encontrado"
}
```

---

### 3. Cadastrar novo apostador
- **Método:** `POST`
- **Rota:** `/apostadores`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "nome": "Ana Souza",
  "idade": 24,
  "chavePix": "11999999999"
}
```
*(Atenção: No envio, utilize `chavePix` em camelCase)*

- **Response (210 Created):**
```json
{
  "id": 2,
  "nome": "Ana Souza",
  "idade": 24,
  "chavePix": "11999999999"
}
```

---

### 4. Atualizar apostador existente
- **Método:** `PUT`
- **Rota:** `/apostadores/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
```json
{
  "nome": "Ana Souza Silva",
  "idade": 25,
  "chavePix": "ana.silva@email.com"
}
```
- **Response (200 OK):** Retorna o objeto atualizado.

---

### 5. Remover apostador
- **Método:** `DELETE`
- **Rota:** `/apostadores/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Response (200 OK):**
```json
{
  "mensagem": "Apostador removido com sucesso"
}
```

---

## 💻 Instalação e Execução Local

1.  Instale as dependências: `npm install`
2.  Crie um arquivo `.env` com as chaves:
    - `JWT_SECRET` (Senha do Token)
    - `CRYPTO_SECRET` (Chave de 32 caracteres para AES)
    - `POSTGRES_URL` (URL de conexão Neon/Postgres)
3.  Inicie em modo de desenvolvimento: `npm run dev`
