const express = require('express');

const { cadastrarUsuario } = require('../controladores/usuario');
const { verificaLogin } = require('../filtros/verificalogin')
const login = require('../controladores/login')
const cliente = require('../controladores/cliente')
const produto = require('../controladores/produto')
const pedido = require('../controladores/pedido')

const rotas = express()

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login.login)

rotas.use(verificaLogin)

rotas.post('/cliente', cliente.cadastrarCliente)
rotas.get('/cliente', cliente.listarClientes)
rotas.get('/cliente/:nome', cliente.obterClientePorNome)
rotas.get('/cliente/endereco/:endereco', cliente.listarClientesPorEndereco)
rotas.put('/cliente/:id', cliente.atualizarCliente)
rotas.delete('/cliente/:id', cliente.excluirCliente)

rotas.post('/produto', produto.cadastrarProduto)
rotas.get('/produto', produto.listarProdutos)
rotas.put('/produto/:id', produto.atualizarProduto)
rotas.delete('/produto/:id', produto.excluirProduto)
rotas.get('/produto/:nome', produto.obterProdutoPorNome)

rotas.post('/pedido', pedido.cadastrarPedido)
rotas.get('/pedido', pedido.listarPedidos)
rotas.get('/pedido/:cliente_id', pedido.listarPedidosPorCliente)
rotas.put('/pedido/:id', pedido.atualizarPedido)
rotas.delete('/pedido/:id', pedido.excluirPedido)

module.exports = rotas