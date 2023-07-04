const express = require("express");
const { findOneById, findAll, create, update, destroy } = require("./database/data.manager.js");

require('dotenv').config();

const server = express();

// Middlewares
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

// Obtener todos los productos
server.get('/productos', (req, res) => {
    findAll()
        .then((zapatillas) => res.status(200).send(zapatillas))
        .catch((error) => res.status(400).send(error.message));
});

// Obtener un producto específico
server.get('/productos/:id', (req, res) => {
    const { id } = req.params;

    findOneById(Number(id))
        .then((zapatilla) => res.status(200).send(zapatilla))
        .catch((error) => res.status(400).send(error.message));
});

// Crear un nuevo producto
server.post('/productos', (req, res) => {
    const { nombre, marca, precio, color } = req.body;

    create({nombre, marca, precio, color })
        .then((zapatillas) => res.status(201).send(zapatillas))
        .catch((error) => res.status(400).send(error.message));
});

// Actualizar un producto específico
server.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, marca, precio, color } = req.body;

    update({ id: Number(id), nombre, marca, precio, color })
        .then((zapatilla) => res.status(200).send(zapatilla))
        .catch((error) => res.status(400).send(error.message));
});

// Eliminar un producto específico
server.delete('/productos/:id', (req, res) => {
    const { id } = req.params;

    destroy(Number(id))
        .then((zapatilla) => res.status(200).send(zapatilla))
        .catch((error) => res.status(400).send(error.message));
});

// Control de rutas inexistentes
server.use('*', (req, res) => {
    res.status(404).send(`<h1>Error 404</h1><h3>La URL indicada no existe en este servidor</h3>`);
});

// Método oyente de peticiones
server.listen(process.env.SERVER_PORT, process.env.SERVER_HOST, () => {
    console.log(`Corriendo en http://${process.env.SERVER_HOST}:${process.env.SERVER_PORT}/productos`);
});