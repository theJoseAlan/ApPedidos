const express = require('express');
const { cadastrarUsuario } = require('../controladores/usuario');
const login = require('../controladores/login')
const { verificaLogin } = require('../filtros/verificalogin')
const { cadastrarCliente, listarClientes } = require('../controladores/cliente')

const rotas = express()

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login.login)

rotas.use(verificaLogin)

rotas.post('/cliente', cadastrarCliente)
rotas.get('/cliente', listarClientes)

module.exports = rotas