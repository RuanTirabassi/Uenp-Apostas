# 🔐 Mecanismos de Segurança e Criptografia

Este documento descreve as implementações de segurança técnica da API para garantir a integridade dos dados e o controle de acesso.

---

## 1. Criptografia de Dados em Repouso (AES)
A API utiliza criptografia simétrica para proteger informações sensíveis (campo `chave_pix`) no banco de dados.

- **Algoritmo:** `aes-256-cbc`.
- **Chave de Criptografia:** Definida pela variável de ambiente `CRYPTO_SECRET` (deve ter 32 bytes).
- **Vetor de Inicialização (IV):** Gerado aleatoriamente (`crypto.randomBytes(16)`) para cada registro, garantindo que o mesmo dado gere resultados criptografados diferentes.
- **Armazenamento:** O dado é salvo no formato `iv:conteudo_criptografado`.
- **Fluxo:**
  - **Escrita (POST/PUT):** O valor original é criptografado antes do `INSERT`.
  - **Leitura (GET):** O valor é descriptografado em tempo de execução antes de ser enviado no JSON.

---

## 2. Autenticação de Rotas (JWT)
O controle de acesso é feito via JSON Web Tokens.

- **Middleware:** `authMiddleware` intercepta as requisições.
- **Header Requerido:** `Authorization: Bearer <token>`.
- **Validação:** O token é verificado contra a `JWT_SECRET`. Se for inválido ou ausente, a API retorna `401 Unauthorized`.
- **Emissão:** O token pode ser gerado na rota pública `/login`.

---

## 3. Segurança de Infraestrutura (Vercel)
- **HTTPS:** Obrigatório e gerenciado nativamente pela Vercel.
- **Environment Variables:** Chaves e segredos nunca são expostos no código, sendo injetados apenas no ambiente de execução.
- **Database Persistence:** Utiliza **Vercel Postgres (Neon)**, eliminando a necessidade de persistência em arquivos locais (Read-Only filesystem).

---

## 📡 Contrato para Integração
Qualquer serviço externo deve:
1. Obter um token via `/login`.
2. Incluir o token em todas as chamadas subsequentes.
3. Tratar os campos de PIX conforme a convenção do contrato (`chavePix` para envio, `chave_pix` para recebimento).
