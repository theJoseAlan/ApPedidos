const knex = require('../bancodedados//conexao');
const jwt = require('jsonwebtoken');
const senhaHash = require('../senhaHash');

const verificaLogin = async (req, res, next) => {
    const {authorization} = req.headers

    if(!authorization){
        return res.status(401).json({mensagem: 'Não autorizado'})
    }

    try {

        const token = authorization.replace('Bearer ', '').trim()

        const { id } = jwt.verify(token, senhaHash)

        const usuarioEncontrado = await knex('usuario').where({id})

        if(!usuarioEncontrado){
            return res.status(404).json({mensagem: 'Usuário não encontrado'})
        }

        const { senha, ...usuario} = usuarioEncontrado[0]

        req.usuario = usuario

        next()

    }catch (erro){
        return res.status(400).json(erro.message);
    }
}

module.exports = {
    verificaLogin
}