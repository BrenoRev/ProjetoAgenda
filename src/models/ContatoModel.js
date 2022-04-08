const mongoose  = require("mongoose");
const validator = require('validator');

const ContatoSchema = new mongoose.Schema(
    {
    nome: { type: String, required: true },
    sobrenome: { type: String, required: false, default: '' },
    telefone: { type: String, required: false, default: ''},
    email: { type: String, required: false, default: '' },
    criadoEm: { type: Date, default: Date.now }
    }
)

const ContatoModel = mongoose.model('Contato', ContatoSchema);

 function Contato(body) {
    this.body = body;
    this.errors = [];
    this.contato = null;
}

  Contato.buscaPorId = async function(id) {

    if(typeof id !== 'string')
        return;

    this.contato = await ContatoModel.findById(id);

    if(!this.contato){
        this.errors.push('Contato não encontrado');
    }

    return this.contato;
}

Contato.buscaContatos = async function() {
    return await ContatoModel.find()
                             .sort({ criadoEm: -1 });
}

Contato.deleteContato = async function(id) {
    if(typeof id !== 'string')
        return;

    await ContatoModel.findByIdAndDelete(id);
}

Contato.prototype.register = async function() {
    this.valida();
    if(this.errors.length > 0)
        throw new Error('Erro ao cadastrar contato');
    
    this.contato = await ContatoModel.create(this.body);
}

Contato.prototype.edit = async function(id) {

    if(typeof id !== 'string') return;

    this.valida();

    if(this.errors.length > 0){
        throw new Error('Erro ao editar contato');
        return;
    }

    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
}

Contato.prototype.valida = function() {

    this.cleanUp();

    if(this.body.email && !validator.isEmail(this.body.email))
        this.errors.push('Email inválido');

    if(!this.body.nome)
        this.errors.push('Nome é um campo obrigatório');

    if(!this.body.email &&  !this.body.telefone){
        this.errors.push("Pelo menos um contato precisa ser enviado: e-mail ou telefone")
    }
    
}

Contato.prototype.cleanUp = function() {

    for(const key in this.body){
        if(typeof this.body[key] !== 'string'){
            this.body[key] = '';
        }
    }	

    this.body = {
        nome: this.body.nome,
        sobrenome: this.body.sobrenome,
        email: this.body.email,
        telefone: this.body.telefone
    }

}

module.exports = Contato;