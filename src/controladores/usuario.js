const knex = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaHash = require('../senhaHash')
const e = require("express");

const cadastrarUsuario = async (req, res) => {

    const {email, senha} = req.body

    if(!email || !senha){
        return res.status(404).json({mensagem: 'Insira todos os campos para prosseguir'})
    }

    try {
        const quantidadeUsuario = await knex('usuario').where({email}).count()

        if(quantidadeUsuario[0].count > 0){
            return res.status(400).json({mensagem:'Já existe um usuário com esse e-mail'})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuario')
            .insert({email, senha: senhaCriptografada})

        if(usuario.length === 0){
            return res.status(400).json({mensagem:'Usuário não cadastrado'})
        }

        return res.status(200).json({mensagem:'Usuário cadastrado com sucesso'})
    }catch (erro){
        return res.status(400).json(erro.message)
    }
}

module.exports = {
    cadastrarUsuario
}