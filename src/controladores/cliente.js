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

const listarClientes = async (req, res) => {
    const { authorization } = req.headers

    if(!authorization){
        return res.status(401).json({mensagem: 'Não autorizado'})
    }

    try {

        const token = authorization.replace('Bearer ', '').trim()
        const { id } = jwt.verify(token, senhaHash)

        const usuarioencontrado = await knex('usuario').where({id}).first()

        if(!usuarioencontrado){
            return res.status(404).json({mensagem: 'Usuario não encontrado' })
        }

        const clientes = await knex('clientes')

        console.log(clientes)

        return res.status(200).json(clientes)

    }catch (erro){
        return res.status(400).json(erro.message)
    }

}

module.exports = {
    cadastrarCliente,
    listarClientes
}