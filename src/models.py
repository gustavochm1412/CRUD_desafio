from enum import Enum
from typing import List, Optional
from pydantic import BaseModel, Field, validator
from uuid import UUID, uuid4

# Classes de personagens disponíveis no jogo
class ClassePersonagem(str, Enum):
    GUERREIRO = "Guerreiro"  # Especialista em combate corpo a corpo
    MAGO = "Mago"           # Mestre das artes arcanas
    ARQUEIRO = "Arqueiro"   # Especialista em ataques à distância
    LADINO = "Ladino"       # Mestre da furtividade
    BARDO = "Bardo"         # Mestre da música e magia

# Tipos de itens mágicos que podem ser equipados
class TipoItem(str, Enum):
    ARMA = "Arma"      # Para causar dano
    ARMADURA = "Armadura"  # Para proteção
    AMULETO = "Amuleto"    # Para bônus especiais

class ItemMagico(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    nome: str
    tipo: TipoItem
    forca: int = Field(ge=0)
    defesa: int = Field(ge=0)

    # Validações específicas para cada tipo de item
    @validator('defesa')
    def validar_defesa_arma(cls, v, values):
        if 'tipo' in values and values['tipo'] == TipoItem.ARMA and v != 0:
            raise ValueError('Arma não pode ter defesa!')
        return v

    @validator('forca')
    def validar_forca_armadura(cls, v, values):
        if 'tipo' in values and values['tipo'] == TipoItem.ARMADURA and v != 0:
            raise ValueError('Armadura não pode ter força!')
        return v

    @validator('forca', 'defesa')
    def validar_valores(cls, v, values):
        if 'forca' in values and 'defesa' in values:
            if values['forca'] == 0 and values['defesa'] == 0:
                raise ValueError('Item precisa ter pelo menos um atributo!')
        return v

class Personagem(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    nome: str
    nomeAventureiro: str  # Nome usado nas aventuras
    classe: ClassePersonagem
    level: int = Field(ge=1)
    forcaBase: int = Field(ge=0)
    defesaBase: int = Field(ge=0)
    itensMagicos: List[ItemMagico] = Field(default_factory=list)

    # Validação dos pontos base do personagem
    @validator('forcaBase', 'defesaBase')
    def validar_pontos_base(cls, v, values):
        if 'forcaBase' in values and 'defesaBase' in values:
            total = values['forcaBase'] + values['defesaBase']
            if total > 10:
                raise ValueError('Máximo de 10 pontos para distribuir!')
        return v

    # Validação de amuleto único
    @validator('itensMagicos')
    def validar_amuleto_unico(cls, v):
        amuletos = [item for item in v if item.tipo == TipoItem.AMULETO]
        if len(amuletos) > 1:
            raise ValueError('Só pode ter um amuleto!')
        return v

    # Métodos para gerenciar itens
    def adicionar_item(self, item: ItemMagico) -> bool:
        if item.tipo == TipoItem.AMULETO:
            if any(i.tipo == TipoItem.AMULETO for i in self.itensMagicos):
                return False
        self.itensMagicos.append(item)
        return True

    def remover_item(self, item_id: UUID) -> bool:
        for i, item in enumerate(self.itensMagicos):
            if item.id == item_id:
                self.itensMagicos.pop(i)
                return True
        return False

    def get_amuleto(self) -> Optional[ItemMagico]:
        for item in self.itensMagicos:
            if item.tipo == TipoItem.AMULETO:
                return item
        return None

    # Cálculo dos atributos totais
    @property
    def forca_total(self) -> int:
        return self.forcaBase + sum(item.forca for item in self.itensMagicos)

    @property
    def defesa_total(self) -> int:
        return self.defesaBase + sum(item.defesa for item in self.itensMagicos) 