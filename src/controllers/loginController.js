const Login = require('../models/LoginModel');

exports.index = (req, res) => {
    if(req.session.user){
        return res.render('login-logado');
    }else{
        res.render('login');
    }
}; 

exports.register = async (req, res) => {
    try{
        console.log(req.body)
        const login = new Login(req.body);
        await login.register();
    
        if(login.errors.length > 0){
            req.flash('errors', login.errors);
            req.session.save(function() {
                res.redirect('/login');
            });
            return;
        }

        req.flash('success', 'Seu usuário foi criado com sucesso');
        req.session.save(function() {
            res.redirect('/login');
        });

    }catch(e){
        console.log(e);
        return res.render('404')
    }


};

exports.login = async (req, res) => {
    try{
        console.log(req.body)
        const login = new Login(req.body);
        await login.logar();
    
        if(login.errors.length > 0){
            req.flash('errors', login.errors);
            req.session.save(function() {
                res.redirect('/login');
            });
            return;
        }

        
        req.flash('success', 'Você entrou no sistema.')
        req.session.user = login.user;
        req.session.save(function() {
            res.redirect('/login');
        });

    }catch(e){
        console.log(e);
        return res.render('404')
    }
};

exports.logout = (req, res) => {
    req.session.destroy(function() {
        res.redirect('/login');
    });
};