const express = require('express');
const router = express.Router();
const Personagem = require('../models/Personagem');

let personagens = [];

// Criar personagem
router.post('/', (req, res) => {
    try {
        const { nome, nomeAventureiro, classe, forca, defesa } = req.body;
        const personagem = new Personagem(nome, nomeAventureiro, classe, forca, defesa);
        personagem.validar();
        personagens.push(personagem);
        res.status(201).json({
            ...personagem,
            forcaTotal: personagem.getForcaTotal(),
            defesaTotal: personagem.getDefesaTotal()
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Listar personagens
router.get('/', (req, res) => {
    const personagensComTotais = personagens.map(p => ({
        ...p,
        forcaTotal: p.getForcaTotal(),
        defesaTotal: p.getDefesaTotal()
    }));
    res.json(personagensComTotais);
});

// Buscar personagem
router.get('/:id', (req, res) => {
    const personagem = personagens.find(p => p.id === req.params.id);
    if (!personagem) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
    }
    res.json({
        ...personagem,
        forcaTotal: personagem.getForcaTotal(),
        defesaTotal: personagem.getDefesaTotal()
    });
});

// Atualizar nome
router.put('/:id/nome', (req, res) => {
    const { novoNome } = req.query;
    const personagem = personagens.find(p => p.id === req.params.id);
    if (!personagem) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
    }
    personagem.nomeAventureiro = novoNome;
    res.json({
        ...personagem,
        forcaTotal: personagem.getForcaTotal(),
        defesaTotal: personagem.getDefesaTotal()
    });
});

// Remover personagem
router.delete('/:id', (req, res) => {
    const index = personagens.findIndex(p => p.id === req.params.id);
    if (index === -1) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
    }
    personagens.splice(index, 1);
    res.status(204).send();
});

module.exports = router; 