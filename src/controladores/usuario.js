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
        const quantidadeUsuario = await knex('usuario').count()

        if(quantidadeUsuario[0].count > 0){
            return res.status(400).json({mensagem:'Só deve haver um usuário'})
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

const atualizarUsuario = async (req, res) => {

    const { email, senha } = req.body
    const { id } = req.usuario;

    if(!email && !senha){
        return res.status(400).json({mensagem: 'É necessário ao menos um campo para atualizar'})
    }

    try {

        const usuarioExiste = await knex('usuario').where({ id }).first()

        if(!usuarioExiste){
            return res.status(404).json({mensagem: 'Usuario não encontrado'})
        }

        const senhaCriptografada = await bcrypt.hash(senha, 10);

        const usuario = await knex('usuario').update({ email, senha: senhaCriptografada}).where({ id })

        if(!usuario){
            return res.status(400).json({mensagem: 'Não foi possível atualizar o usuario'})
        }

        return res.status(200).json({mensagem: 'Usuario atualizado'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }

}

module.exports = {
    cadastrarUsuario,
    atualizarUsuario
}