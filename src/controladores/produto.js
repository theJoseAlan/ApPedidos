const knex = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaHash = require('../senhaHash')

const cadastrarProduto = async (req, res) => {

    const {nome, valor_unitario, disponivel, quantidade, observacao} = req.body

    if(!nome){
        return res.status(404).json({mensagem: 'É necessário informar o nome do produto'})
    }

    if(!valor_unitario){
        return res.status(404).json({mensagem: 'É necessário informar o valor do produto'})
    }

    if(!disponivel){
        return res.status(404).json({mensagem: 'É necessário informar se o produto está disponivel ou não'})
    }

    if(!quantidade){
        return res.status(404).json({mensagem: 'É necessário informar a quantidade'})
    }

    try {

        const produto = await knex('produtos')
            .insert({nome, valor_unitario, disponivel, quantidade, observacao}).returning('*')

        if(produto.length === 0){
            return res.status(400).json({mensagem: 'Produto não cadastrado'})
        }

        return res.status(200).json(produto)
    }catch (erro){
        return res.status(400).json(erro.message)
    }
}

const listarProdutos = async (req, res) => {
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

        const produtos = await knex('produtos')

        return res.status(200).json(produtos)

    }catch (erro){
        return res.status(400).json(erro.message)
    }
}

const atualizarProduto = async (req, res) => {

    const { nome, valor_unitario, disponivel, quantidade, observacao } = req.body
    const { id } = req.params

    if(!nome && !valor_unitario && !disponivel && !quantidade && !observacao){
        return res.status(400).json({mensagem: 'É necessário ao menos um campo para atualizar'})
    }

    try {

        const produtoExiste = await knex('produtos').where({id}).first()

        if(!produtoExiste){
            return res.status(404).json({mensagem: 'Produto não encontrado'})
        }

        const cliente = await knex('produtos').update({nome, valor_unitario, disponivel, quantidade, observacao}).where({id})

        if(!cliente){
            return res.status(400).json({mensagem: 'Não foi possível atualizar o produto'})
        }

        return res.status(200).json({mensagem: 'Produto atualizado'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }

}

const excluirProduto = async (req, res) => {
    const { id } = req.params

    try{
        const produtoExiste = await knex('produtos').where({id}).first()

        if(!produtoExiste){
            return res.status(404).json({mensagem: 'Produto não encontrado'})
        }

        const usuario = await knex('produtos').delete().where({id})

        if(!usuario){
            return res.status(400).json({mensagem: 'Não foi posssível excluir o produto'})
        }

        return res.status(200).json({mensagem:'Produto excluido com sucesso'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }
}

const obterProdutoPorNome = async (req, res) => {

    const { nome } = req.params

    try {
        const produto = await knex('produtos').where({nome}).first()

        if(!produto){
            return res.status(404).json({mensagem: 'Produto não encontrado'})
        }

        return res.status(200).json(produto)

    }catch (erro){
        return res.status(400).json(erro.message)
    }

}

module.exports = {
    cadastrarProduto,
    listarProdutos,
    atualizarProduto,
    excluirProduto,
    obterProdutoPorNome
}