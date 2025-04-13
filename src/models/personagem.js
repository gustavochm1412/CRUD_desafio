const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const { ClassePersonagem } = require('./constants');

const personagemSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    nomeAventureiro: {
        type: String,
        required: true
    },
    classe: {
        type: String,
        enum: ['GUERREIRO', 'MAGO', 'ARQUEIRO', 'LADINO', 'BARDO'],
        required: true
    },
    level: {
        type: Number,
        default: 1
    },
    forca: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    defesa: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    itens: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ItemMagico'
    }]
});

// Validação para garantir que força + defesa = 10
personagemSchema.pre('save', function(next) {
    if (this.forca + this.defesa !== 10) {
        next(new Error('A soma de força e defesa deve ser 10'));
    }
    next();
});

// Método para calcular força total (incluindo itens)
personagemSchema.methods.getForcaTotal = async function() {
    await this.populate('itens');
    return this.forca + this.itens.reduce((total, item) => total + item.forca, 0);
};

// Método para calcular defesa total (incluindo itens)
personagemSchema.methods.getDefesaTotal = async function() {
    await this.populate('itens');
    return this.defesa + this.itens.reduce((total, item) => total + item.defesa, 0);
};

// Método para adicionar item
personagemSchema.methods.adicionarItem = async function(item) {
    await this.populate('itens');
    
    // Verifica se já tem amuleto
    if (item.tipo === 'AMULETO') {
        const temAmuleto = this.itens.some(i => i.tipo === 'AMULETO');
        if (temAmuleto) {
            throw new Error('Personagem já possui um amuleto');
        }
    }
    
    this.itens.push(item._id);
    await this.save();
};

// Método para remover item
personagemSchema.methods.removerItem = async function(itemId) {
    this.itens = this.itens.filter(item => !item._id.equals(itemId));
    await this.save();
};

// Método para buscar amuleto
personagemSchema.methods.getAmuleto = async function() {
    await this.populate('itens');
    return this.itens.find(item => item.tipo === 'AMULETO');
};

class Personagem {
    constructor(nome, nomeAventureiro, classe, forca, defesa) {
        this.id = uuidv4();
        this.nome = nome;
        this.nomeAventureiro = nomeAventureiro;
        this.classe = classe;
        this.level = 1;
        this.forca = forca;
        this.defesa = defesa;
        this.vida = 100;
        this.itens = [];
    }

    validar() {
        if (this.forca < 0 || this.forca > 10) {
            throw new Error('Força deve estar entre 0 e 10');
        }
        if (this.defesa < 0 || this.defesa > 10) {
            throw new Error('Defesa deve estar entre 0 e 10');
        }
        if (this.forca + this.defesa !== 10) {
            throw new Error('A soma de força e defesa deve ser 10');
        }
        if (!['GUERREIRO', 'MAGO', 'ARQUEIRO', 'LADINO', 'BARDO'].includes(this.classe)) {
            throw new Error('Classe inválida');
        }
        if (this.vida < 0 || this.vida > 100) {
            throw new Error('Vida deve estar entre 0 e 100');
        }
    }

    getForcaTotal() {
        return this.forca + this.itens.reduce((total, item) => total + item.forca, 0);
    }

    getDefesaTotal() {
        return this.defesa + this.itens.reduce((total, item) => total + item.defesa, 0);
    }

    adicionarItem(item) {
        if (item.tipo === 'AMULETO') {
            const temAmuleto = this.itens.some(i => i.tipo === 'AMULETO');
            if (temAmuleto) {
                throw new Error('Personagem já possui um amuleto');
            }
        }
        this.itens.push(item);
    }

    removerItem(itemId) {
        this.itens = this.itens.filter(item => item.id !== itemId);
    }

    getAmuleto() {
        return this.itens.find(item => item.tipo === 'AMULETO');
    }
}

module.exports = mongoose.model('Personagem', personagemSchema); 