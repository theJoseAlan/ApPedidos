const knex = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaHash = require('../senhaHash')

const cadastrarCliente = async (req, res) => {

    const {nome, endereco, telefone} = req.body

    if(!nome){
        return res.status(404).json({mensagem: 'O campo nome é obrigatório'})
    }

    try {

        const cliente = await knex('clientes')
            .insert({nome, endereco, telefone})

        if(cliente.length === 0){
            return res.status(400).json({mensagem: 'Cliente não cadastrado'})
        }

        return res.status(200).json({mensagem: 'Cliente cadastrado'})
    }catch (erro){
        return res.status(400).json(erro.message)
    }
}

module.exports = {
    cadastrarCliente
}