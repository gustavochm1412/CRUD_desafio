
# 🎲 Sistema de Gerenciamento de RPG

Sistema para gerenciamento de **Personagens** e **Itens Mágicos** de RPG medieval.  
Desenvolvido em **Node.js**, utilizando **Express** e princípios de **Programação Orientada a Objetos (POO)**.

## 📜 Informações do Projeto

- **Nome**: Gustavo Henrique Cordeiro Mesquita  
- **RA**: 21099392-2  
---

## 📦 Requisitos

- ✅ **Node.js** 14 ou superior  
- ✅ **npm** ou **yarn**

---

## ⚙️ Instalação

```bash
# 1️⃣ Clone o repositório
git clone https://github.com/gustavochm1412/CRUD_desafio.git

# 2️⃣ Acesse a pasta do projeto
cd CRUD_desafio

# 3️⃣ Instale as dependências
npm install

# 4️⃣ Inicie o servidor
npm start
```

O servidor irá rodar em:  
[http://localhost:3000](http://localhost:3000)

---

## 📖 Regras do Sistema

### 🧙‍♂️ Personagens

- **Força**: valor entre 0 e 10 (soma com Defesa deve ser **10**)  
- **Defesa**: valor entre 0 e 10 (soma com Força deve ser **10**)  
- **Vida**: de 0 a 100  
- **Classes disponíveis**:
  - `GUERREIRO`
  - `MAGO`
  - `ARQUEIRO`
  - `LADINO`
  - `BARDO`
- **Level**: inicia em 1  
- Pode possuir **vários itens mágicos**  
- Só pode possuir **1 Amuleto**  
- Força e Defesa totais = base do personagem + bônus dos itens  

### 🪄 Itens Mágicos

- **Força**: 0 a 10  
- **Defesa**: 0 a 10  
- **Tipos**:
  - `ARMA`: deve ter defesa = 0
  - `ARMADURA`: deve ter força = 0
  - `AMULETO`: pode ter força e defesa
- Nenhum item pode ter força = 0 e defesa = 0  
- Um personagem só pode possuir **um amuleto**

---

## 📡 Endpoints da API

### 🔹 Personagens

| Ação                       | Método | Endpoint                          |
|:--------------------------|:--------|:----------------------------------|
| Criar Personagem            | `POST`  | `/personagens`                    |
| Listar Personagens          | `GET`   | `/personagens`                    |
| Buscar Personagem por ID    | `GET`   | `/personagens/:id`                |
| Atualizar Nome Aventureiro  | `PUT`   | `/personagens/:id/nome?novoNome=` |
| Remover Personagem          | `DELETE`| `/personagens/:id`                |

### 🔹 Itens Mágicos

| Ação                                | Método | Endpoint                                           |
|:-----------------------------------|:--------|:--------------------------------------------------|
| Criar Item                         | `POST`  | `/itens`                                          |
| Listar Itens                       | `GET`   | `/itens`                                          |
| Buscar Item por ID                 | `GET`   | `/itens/:id`                                      |
| Adicionar Item ao Personagem       | `POST`  | `/itens/:itemId/personagem/:personagemId`         |
| Listar Itens do Personagem         | `GET`   | `/itens/personagem/:personagemId`                 |
| Remover Item do Personagem         | `DELETE`| `/itens/:itemId/personagem/:personagemId`         |
| Buscar Amuleto do Personagem       | `GET`   | `/itens/personagem/:personagemId/amuleto`         |

---

## ✅ Respostas da API

| Código | Descrição              |
|:--------|:----------------------|
| `200`  | OK                     |
| `201`  | Criado                 |
| `204`  | Sem conteúdo           |
| `400`  | Requisição inválida    |
| `404`  | Recurso não encontrado |

---

## 💡 Exemplos de Uso com `curl`

### 📌 Criar Personagem
```bash
curl -X POST http://localhost:3000/personagens \
-H "Content-Type: application/json" \
-d '{
  "nome": "Aragorn",
  "nomeAventureiro": "Elessar",
  "classe": "GUERREIRO",
  "forca": 7,
  "defesa": 3
}'
```

### 📌 Criar Item Mágico
```bash
curl -X POST http://localhost:3000/itens \
-H "Content-Type: application/json" \
-d '{
  "nome": "Espada Andúril",
  "tipo": "ARMA",
  "forca": 8,
  "defesa": 0
}'
```

### 📌 Adicionar Item a um Personagem
```bash
curl -X POST http://localhost:3000/itens/123/personagem/456
```

### 📌 Buscar Amuleto de um Personagem
```bash
curl http://localhost:3000/itens/personagem/456/amuleto
```

---


