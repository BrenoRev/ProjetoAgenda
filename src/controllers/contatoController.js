const Contato = require('../models/ContatoModel');

exports.index = (req, res) => {
    res.render('contato', {contato: {}});
}

exports.register = async (req, res) => {
    const contato = new Contato(req.body);
    try {
        await contato.register();
        req.flash('success', 'Contato c adastrado com sucesso');
        res.redirect(`/contato/${contato.contato._id}`);
    } catch (error) {
        req.flash('errors', contato.errors);
        res.redirect('/contato');
        return ;
    }
}

exports.editIndex = async (req, res) => {

    if(!req.params.id){
        req.render('404');
    }
        const id = req.params.id;
        const contato = await Contato.buscaPorId(id);

    res.render('contato', {contato});
}

exports.updateContato = async (req, res) => {
    if(!req.params.id) return res.render('404');

    const contato = new Contato(req.body);

    try {
        await contato.edit(req.params.id);
        req.flash('success', 'Contato atualizado com sucesso');
        res.redirect(`/contato/${contato.contato._id}`);
    } catch (error) {
        req.flash('errors', contato.errors);
        res.redirect(`/contato/${contato.contato._id}`);
        return;
    }
}

exports.deleteContato= async (req, res) => {
    if(!req.params.id) return res.render('404');

    try{
        await Contato.deleteContato(req.params.id);
        req.flash('success', 'Contato excluido com sucesso');
        res.redirect('/');
    } catch (error) {
        req.flash('errors', 'Erro ao excluir contato');
        res.redirect('/');
        return;
    }
}