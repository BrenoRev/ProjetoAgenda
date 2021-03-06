const mongoose = require('mongoose');
const validator = require('validator')
const bcryptjs = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  login: { type: String, required: true },
  senha: { type: String, required: true }
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
    constructor(body){
        this.body = body;
        this.errors = [];
        this.user = null;
    }

  async logar(){
    this.user = await LoginModel.findOne({ login: this.body.login });
    if(!bcryptjs.compareSync(this.body.senha, this.user.senha) || !this.user){
        this.errors.push('Senha incorreta' );
        this.user = null;
    }

  }

  async register(){
        await this.valida();

        if(this.errors.length > 0){
            return;
        }
            const salt = bcryptjs.genSaltSync(10);
            this.body.senha = bcryptjs.hashSync(this.body.senha, salt);
            this.user = await LoginModel.create(this.body);

    }

    async valida(){

        await this.userExists();

        if(this.user)
            this.errors.push('Usuário já existe');

        this.cleanUp();

        if(!this.body.login){
            this.errors.push('Login não pode ser vazio');
        }
        if(!this.body.senha){
            this.errors.push('Senha não pode ser vazia');
        }
        
    }

    async userExists(){
        this.user = await LoginModel.findOne({ login: this.body.login });
        if(this.user){
            this.errors.push('Usuário já existe');
        }
    }

    cleanUp(){

        for(const key in this.body){
            if(typeof this.body[key] !== 'string'){
                this.body[key] = '';
            }
        }	

        this.body = {
            login: this.body.login,
            senha: this.body.senha
        }

    }
}

module.exports = Login;
