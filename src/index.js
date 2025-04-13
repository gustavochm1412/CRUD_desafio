const express = require('express');
const app = express();

app.use(express.json());

const personagemRoutes = require('./routes/personagemRoutes');
const itemMagicoRoutes = require('./routes/itemMagicoRoutes');

app.use('/personagens', personagemRoutes);
app.use('/itens', itemMagicoRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
}); 