# API - Apostas

Esta é uma API simples em TypeScript para gerenciar apostadores em uma casa de apostas.

## 🚀 Como rodar o projeto localmente

Para clonar e executar o projeto na sua máquina, siga os passos abaixo.

### Pré-requisitos
- Ter o [Node.js](https://nodejs.org/) instalado na máquina.
- Ter o [Git](https://git-scm.com/) instalado.

### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_SEU_REPOSITORIO>
   ```

2. **Acesse a pasta do projeto:**
   ```bash
   cd UENP-apostas
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

> 💡 **Nota:** O banco de dados SQLite (`database.sqlite`) será criado automaticamente na raiz do projeto e as tabelas serão geradas logo que você iniciar o servidor pela primeira vez.

---

## 🌐 URL Base do Serviço

A API roda localmente por padrão na porta 3000:

```text
http://localhost:3000
```

### Acesso pela Rede Local (Wi-Fi)

Para testar a API de outro computador que esteja na **mesma rede Wi-Fi**, utilize o IP da sua máquina no lugar de `localhost`.

Ao iniciar o projeto, o terminal exibirá automaticamente o IP da rede em que a API está rodando, algo como:

```text
http://192.168.56.1:3000
```

_(Substitua o IP acima pelo que aparecer no seu terminal na hora de testar)_

---

## 📌 Endpoints da API

Abaixo estão os endpoints disponíveis, seus métodos HTTP, rotas, descrições e exemplos detalhados de requisição e resposta.

### 1. Listar todos os apostadores

- **Método HTTP:** `GET`
- **Rota:** `/apostadores`
- **Descrição:** Retorna uma lista com todos os apostadores cadastrados no banco de dados.

**Exemplo de Resposta (Sucesso - Status 200):**

```json
[
  {
    "id": 1,
    "nome": "Carlos",
    "idade": 28,
    "chave_pix": "carlos@email.com"
  },
  {
    "id": 2,
    "nome": "Ana",
    "idade": 24,
    "chave_pix": "11999999999"
  }
]
```

---

### 2. Buscar um apostador por ID

- **Método HTTP:** `GET`
- **Rota:** `/apostadores/:id`
- **Descrição:** Busca e retorna os dados de um único apostador através do seu ID.

**Exemplo de Resposta (Sucesso - Status 200):**

```json
{
  "id": 1,
  "nome": "Carlos",
  "idade": 28,
  "chave_pix": "carlos@email.com"
}
```

**Exemplo de Resposta (Erro - Status 404):**

```json
{
  "mensagem": "Apostador não encontrado"
}
```

---

### 3. Cadastrar um novo apostador

- **Método HTTP:** `POST`
- **Rota:** `/apostadores`
- **Descrição:** Cadastra um novo apostador no sistema.

**Exemplo de Requisição (Body):**

```json
{
  "nome": "Carlos",
  "idade": 28,
  "chavePix": "carlos@email.com"
}
```

**Exemplo de Resposta (Sucesso - Status 201):**

```json
{
  "id": 1,
  "nome": "Carlos",
  "idade": 28,
  "chavePix": "carlos@email.com"
}
```

**Exemplo de Resposta (Erro de Validação - Status 400):**

```json
{
  "mensagem": "Os campos nome, idade e chavePix são obrigatórios"
}
```

---

### 4. Atualizar um apostador existente

- **Método HTTP:** `PUT`
- **Rota:** `/apostadores/:id`
- **Descrição:** Atualiza os dados de um apostador existente. É necessário enviar todos os campos obrigatórios.

**Exemplo de Requisição (Body):**

```json
{
  "nome": "Carlos Silva",
  "idade": 29,
  "chavePix": "carlos.silva@email.com"
}
```

**Exemplo de Resposta (Sucesso - Status 200):**

```json
{
  "id": 1,
  "nome": "Carlos Silva",
  "idade": 29,
  "chavePix": "carlos.silva@email.com"
}
```

**Exemplo de Resposta (Erro - Status 404):**

```json
{
  "mensagem": "Apostador não encontrado"
}
```

---

### 5. Remover um apostador

- **Método HTTP:** `DELETE`
- **Rota:** `/apostadores/:id`
- **Descrição:** Remove um apostador do banco de dados pelo seu ID.

**Exemplo de Resposta (Sucesso - Status 200):**

```json
{
  "mensagem": "Apostador removido com sucesso"
}
```

**Exemplo de Resposta (Erro - Status 404):**

```json
{
  "mensagem": "Apostador não encontrado"
}
```
