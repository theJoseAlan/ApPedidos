CREATE DATABASE appedidos

CREATE TABLE usuario (

  id serial primary key,
  email varchar(255),
  senha varchar(255)

)

CREATE TABLE clientes(

    id serial primary key,
	nome varchar(255),
	endereco varchar(255),
	telefone varchar(255)

)

CREATE TABLE pedidos(

    id serial primary key,
    quantidade integer,
	nro_parcelas integer,
    cliente_id integer references clientes(id),
	produto_id integer references produtos(id),
	column total real

)

CREATE TABLE produtos(

    id serial primary key,
	nome varchar(255),
	valor_unitario real,
	disponivel varchar(10),
	quantidade integer
	observacao text,

)

CREATE TABLE parcelas(

  id serial primary key,
  quantidade int,
  valor_individual real,
  total real
  pedido_id integer references pedidos(id)

)
