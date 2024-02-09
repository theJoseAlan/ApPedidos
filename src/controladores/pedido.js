const knex = require('../bancodedados/conexao')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const senhaHash = require('../senhaHash')

const cadastrarPedido = async (req, res) => {

    const {cliente_id, produto_id, quantidade, nro_parcelas} = req.body

    if(!cliente_id || !produto_id || !quantidade || !nro_parcelas){
        return res.status(404).json({mensagem: 'Todos os campos são obrigatórios'})
    }

    try {
        const cliente = await knex('clientes').where({id: cliente_id}).first()

        if(!cliente){
            return res.status(404).json({mensagem: 'Cliente não encontrado'})
        }

        const produto = await knex('produtos').where({id: produto_id}).first()

        if(!produto){
            return res.status(404).json({mensagem: 'Produto não encontrado'})
        }

        if(quantidade > produto.quantidade){
            return res.status(400).json({mensagem: 'Não há produtos suficientes'});
        }

        if(quantidade <= 0){
            return res.status(400).json({mensagem: 'Insira uma quantidade válida'});
        }

        const total = produto.valor_unitario * quantidade

        let quantidadeSubtraidaDeProdutos = produto.quantidade - quantidade

        await knex('produtos').update({quantidade:quantidadeSubtraidaDeProdutos}).where({id: produto_id})

        const pedido = await knex('pedidos')
            .insert({cliente_id, produto_id, quantidade, nro_parcelas, total}).returning('*')

        if(pedido.length === 0){
            return res.status(400).json({mensagem: 'Pedido não cadastrado'})
        }

        const valor_individual = total / nro_parcelas

        const parcelas = await knex('parcelas')
            .insert({quantidade: nro_parcelas, valor_individual, total, pedido_id: pedido[0].id})
            .returning('*')

        return res.status(200).json([pedido, parcelas])
    }catch (erro){
        return res.status(400).json(erro.message)
    }
}

const listarPedidos = async (req, res) => {

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

        const pedidos = await knex('pedidos')

        let arrayPedidos = []

        for(let i = 0; i < pedidos.length; i++){

            const cliente = await knex('clientes').where({id: pedidos[i].cliente_id}).first()

            const produto = await knex('produtos').where({id: pedidos[i].produto_id}).first()

            const pedidosResponse = {
                codPedido: pedidos[i].id,
                cliente: cliente.nome,
                produto: produto.nome,
                quantidade: pedidos[i].quantidade,
                parelas: pedidos[i].nro_parcelas,
                total: pedidos[i].total
            }

            arrayPedidos.push(pedidosResponse)

        }

        return res.status(200).json(arrayPedidos)

    }catch (erro){
        return res.status(400).json(erro.message)
    }
}

const listarPedidosPorCliente = async (req, res) => {

    const { authorization } = req.headers
    const { nomeCliente } = req.params

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

        const clienteEncontrado = await knex('clientes').where({nome: nomeCliente}).first()

        if(!clienteEncontrado){
            return res.status(404).json({mensagem: 'Cliente não encontrado'})
        }

        const pedidos = await knex('pedidos').where({cliente_id: clienteEncontrado.id})

        if(pedidos.length === 0){
            return res.status(200).json({mensagem: 'Esse cliente ainda não fez nenhum pedido'})
        }

        let arrayPedidos = []

        for(let i = 0; i < pedidos.length; i++){

            const cliente = await knex('clientes').where({id: pedidos[i].cliente_id}).first()

            const produto = await knex('produtos').where({id: pedidos[i].produto_id}).first()

            const pedidosResponse = {
                codPedido: pedidos[i].id,
                cliente: cliente.nome,
                produto: produto.nome,
                quantidade: pedidos[i].quantidade,
                parelas: pedidos[i].nro_parcelas,
                total: pedidos[i].total
            }

            arrayPedidos.push(pedidosResponse)

        }

        return res.status(200).json(arrayPedidos)

    }catch (erro){
        return res.status(400).json(erro.message)
    }
}

const atualizarPedido = async (req, res) => {

    const { cliente_id, produto_id, quantidade, nro_parcelas } = req.body
    const { id } = req.params

    if(!cliente_id && !produto_id && !quantidade && !nro_parcelas){
        return res.status(400).json({mensagem: 'É necessário ao menos um campo para atualizar'})
    }

    try {

        const pedidoExiste = await knex('pedidos').where({id}).first()

        if(!pedidoExiste){
            return res.status(404).json({mensagem: 'Pedido não encontrado'})
        }

        const cliente = await knex('clientes').where({id: cliente_id}).first()

        if(!cliente){
            return res.status(404).json({mensagem: 'Cliente não encontrado'})
        }

        const produto = await knex('produtos').where({id: produto_id}).first()

        if(!produto){
            return res.status(404).json({mensagem: 'Produto não encontrado'})
        }

        if(quantidade > produto.quantidade){
            return res.status(400).json({mensagem: 'Não há produtos suficientes'});
        }

        if(quantidade <= 0){
            return res.status(400).json({mensagem: 'Insira uma quantidade válida'});
        }

        let quantidadeSubtraidaDeProdutos = produto.quantidade - quantidade

        await knex('produtos').update({quantidade:quantidadeSubtraidaDeProdutos}).where({id: produto_id})

        const pedido = await knex('pedidos').update({ cliente_id, produto_id, quantidade, nro_parcelas}).where({id})

        if(!pedido){
            return res.status(400).json({mensagem: 'Não foi possível atualizar o pedido'})
        }

        return res.status(200).json({mensagem: 'Pedido atualizado'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }

}

const excluirPedido = async (req, res) => {
    const { id } = req.params

    try{
        const pedidoExistente = await knex('pedidos').where({id}).first()

        if(!pedidoExistente){
            return res.status(404).json({mensagem: 'Pedido não encontrado'})
        }

        const pedido = await knex('pedidos').delete().where({id})

        if(!pedido){
            return res.status(400).json({mensagem: 'Não foi posssível excluir o cliente'})
        }

        return res.status(200).json({mensagem:'Pedido excluido com sucesso'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }
}

const excluirPedidoPorCliente = async (req, res) => {
    const { cliente_id } = req.params

    try{
        const clienteExistente = await knex('clientes').where({id: cliente_id})

        if(!clienteExistente){
            return res.status(404).json({mensagem: 'Cliente não encontrado'})
        }

        const pedidoExistente = await knex('pedidos').where({cliente_id})

        if(pedidoExistente.length === 0){
            return res.status(404).json({mensagem: 'Pedidos não encontrados'})
        }

        const pedido = await knex('pedidos').delete().where({cliente_id})

        if(!pedido){
            return res.status(400).json({mensagem: 'Não foi posssível excluir o cliente'})
        }

        return res.status(200).json({mensagem:'Pedidos excluidos com sucesso'})

    }catch (erro){
        return res.status(500).json(erro.message)
    }
}

module.exports = {
    cadastrarPedido,
    listarPedidos,
    listarPedidosPorCliente,
    atualizarPedido,
    excluirPedido,
    excluirPedidoPorCliente
}