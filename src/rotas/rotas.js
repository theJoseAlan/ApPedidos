const express = require('express');
const { cadastrarUsuario } = require('../controladores/usuario');
const login = require('../controladores/login')
const { verificaLogin } = require('../filtros/verificalogin')
const cliente = require('../controladores/cliente')

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

module.exports = rotas