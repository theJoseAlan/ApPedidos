const express = require('express');
const { cadastrarUsuario } = require('../controladores/usuario');
const login = require('../controladores/login')
const { verificaLogin } = require('../filtros/verificalogin')
const { cadastrarCliente } = require('../controladores/cliente')

const rotas = express()

rotas.post('/usuario', cadastrarUsuario)
rotas.post('/login', login.login)

rotas.use(verificaLogin)

rotas.post('/cliente', cadastrarCliente)

module.exports = rotas