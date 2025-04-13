const { v4: uuidv4 } = require('uuid');

class ItemMagico {
    constructor(nome, tipo, forca, defesa) {
        this.id = uuidv4();
        this.nome = nome;
        this.tipo = tipo;
        this.forca = forca;
        this.defesa = defesa;
    }

    validar() {
        if (!['ARMA', 'ARMADURA', 'AMULETO'].includes(this.tipo)) {
            throw new Error('Tipo de item inválido');
        }

        if (this.forca < 0 || this.forca > 10) {
            throw new Error('Força deve estar entre 0 e 10');
        }

        if (this.defesa < 0 || this.defesa > 10) {
            throw new Error('Defesa deve estar entre 0 e 10');
        }

        if (this.forca === 0 && this.defesa === 0) {
            throw new Error('Item não pode ter força e defesa zerados');
        }

        if (this.tipo === 'ARMA' && this.defesa > 0) {
            throw new Error('Arma não pode ter defesa');
        }

        if (this.tipo === 'ARMADURA' && this.forca > 0) {
            throw new Error('Armadura não pode ter força');
        }
    }
}

module.exports = ItemMagico; 