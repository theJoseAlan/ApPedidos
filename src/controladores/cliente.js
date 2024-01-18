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

        return res.status(200).json(clientes)

    }catch (erro){
        return res.status(400).json(erro.message)
    }

}

const obterClientePorNome = async (req, res) => {

    const { nome } = req.params

    try {
        const cliente = await knex('clientes').where({nome}).first()

        if(!cliente){
            return res.status(404).json({mensagem: 'Cliente não encontrado'})
        }

        return res.status(200).json(cliente)

    }catch (erro){
        return res.status(400).json(erro.message)
    }

}

const listarClientesPorEndereco = async (req, res) => {

    const { endereco } = req.params

    try {
        const cliente = await knex('clientes').where({endereco})

        if(!cliente){
            return res.status(404).json({mensagem: 'Clientes não encontrados'})
        }

        return res.status(200).json(cliente)

    }catch (erro){
        return res.status(400).json(erro.message)
    }

}

const atualizarCliente = async (req, res) => {

    const { nome, endereco, telefone } = req.body
    const { id } = req.params

    if(!nome && !endereco && !telefone){
        return res.status(400).json({mensagem: 'É necessário ao menos um campo para atualizar'})
    }

    try {

        const clienteExiste = await knex('clientes').where({id}).first()

        if(!clienteExiste){
            return res.status(404).json({mensagem: 'Cliente não encontrado'})
        }

        const cliente = await knex('clientes').update({nome, endereco, telefone}).where({id})

        if(!cliente){
            return res.status(400).json({mensagem: 'Não foi possível atualizar o cliente'})
        }

        return res.status(200).json({mensagem: 'Cliente atualizado'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }

}

const excluirCliente = async (req, res) => {
    const { id } = req.params

    try{
        const clienteExistente = await knex('clientes').where({id}).first()

        if(!clienteExistente){
            return res.status(404).json({mensagem: 'Cliente não encontrado'})
        }

        const usuario = await knex('clientes').delete().where({id})

        if(!usuario){
            return res.status(400).json({mensagem: 'Não foi posssível excluir o cliente'})
        }

        return res.status(200).json({mensagem:'Cliente excluido com sucesso'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }
}

module.exports = {
    cadastrarCliente,
    listarClientes,
    obterClientePorNome,
    listarClientesPorEndereco,
    atualizarCliente,
    excluirCliente

}