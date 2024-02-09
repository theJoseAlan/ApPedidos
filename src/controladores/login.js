const knex = require('../bancodedados/conexao');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const login = async (req, res) => {

    const {email, senha} = req.body

    if(!email || !senha){
        return res.status(404).json({mensagem: 'e-mail e senha são obrigatórios'})
    }

    try {

        const usuarioEncontrado = await knex('usuario').where({email}).first()

        const senhaCorreta = await bcrypt.compare(senha, usuarioEncontrado.senha);

        if (!senhaCorreta || !usuarioEncontrado) {
            return res.status(401).json({mensagem:"Email e senha não confere"});
        }

        const token = jwt.sign({id: usuarioEncontrado.id}, senhaHash, {expiresIn: '8h'})

        const {senha: _, ...dadosUsuario} = usuarioEncontrado

        return res.status(200).json({
            token
        })

    }catch (erro){
        return res.status(400).json(erro.message)
    }

}

module.exports = {
    login
}