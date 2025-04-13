const express = require('express');
const router = express.Router();
const ItemMagico = require('../models/itemMagico');
const Personagem = require('../models/personagem');

// Listas pra guardar os itens e personagens
const itens = [];
const personagens = [];

// Cria um novo item
router.post('/', (req, res) => {
    try {
        const { nome, tipo, forca, defesa } = req.body;
        const item = new ItemMagico(nome, tipo, forca, defesa);
        item.validar();
        itens.push(item);
        res.status(201).json(item);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Lista todos os itens
router.get('/', (req, res) => {
    res.json(itens);
});

// Busca um item pelo ID
router.get('/:id', (req, res) => {
    const item = itens.find(i => i.id === req.params.id);
    if (item) {
        res.json(item);
    } else {
        res.status(404).json({ error: 'Item não encontrado' });
    }
});

// Adiciona um item a um personagem
router.post('/:itemId/personagem/:personagemId', (req, res) => {
    const item = itens.find(i => i.id === req.params.itemId);
    const personagem = personagens.find(p => p.id === req.params.personagemId);

    if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
    }
    if (!personagem) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
    }

    try {
        personagem.adicionarItem(item);
        res.json(personagem);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Lista os itens de um personagem
router.get('/personagem/:personagemId', (req, res) => {
    const personagem = personagens.find(p => p.id === req.params.personagemId);
    if (personagem) {
        res.json(personagem.itens);
    } else {
        res.status(404).json({ error: 'Personagem não encontrado' });
    }
});

// Remove um item de um personagem
router.delete('/:itemId/personagem/:personagemId', (req, res) => {
    const personagem = personagens.find(p => p.id === req.params.personagemId);
    if (personagem) {
        personagem.removerItem(req.params.itemId);
        res.status(204).send();
    } else {
        res.status(404).json({ error: 'Personagem não encontrado' });
    }
});

// Busca o amuleto de um personagem
router.get('/personagem/:personagemId/amuleto', (req, res) => {
    const personagem = personagens.find(p => p.id === req.params.personagemId);
    if (personagem) {
        const amuleto = personagem.getAmuleto();
        if (amuleto) {
            res.json(amuleto);
        } else {
            res.status(404).json({ error: 'Amuleto não encontrado' });
        }
    } else {
        res.status(404).json({ error: 'Personagem não encontrado' });
    }
});

module.exports = router; 