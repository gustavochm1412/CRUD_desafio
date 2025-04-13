const express = require('express');
const router = express.Router();
const ItemMagico = require('../models/ItemMagico');
const Personagem = require('../models/Personagem');

let itens = [];
let personagens = [];

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

router.get('/', (req, res) => {
    res.json(itens);
});

router.get('/:id', (req, res) => {
    const item = itens.find(i => i.id === req.params.id);
    if (!item) {
        return res.status(404).json({ error: 'Item não encontrado' });
    }
    res.json(item);
});

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

router.get('/personagem/:personagemId', (req, res) => {
    const personagem = personagens.find(p => p.id === req.params.personagemId);
    if (!personagem) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
    }
    res.json(personagem.itens);
});

router.delete('/:itemId/personagem/:personagemId', (req, res) => {
    const personagem = personagens.find(p => p.id === req.params.personagemId);
    if (!personagem) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
    }

    try {
        personagem.removerItem(req.params.itemId);
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.get('/personagem/:personagemId/amuleto', (req, res) => {
    const personagem = personagens.find(p => p.id === req.params.personagemId);
    if (!personagem) {
        return res.status(404).json({ error: 'Personagem não encontrado' });
    }

    const amuleto = personagem.getAmuleto();
    if (!amuleto) {
        return res.status(404).json({ error: 'Personagem não possui amuleto' });
    }

    res.json(amuleto);
});

module.exports = router; 