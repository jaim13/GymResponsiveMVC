"use strict";
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');

const app = express();
const port = 3000;

app.use(bodyParser.json());

const config = {
    server: 'costa-rica-fitness.database.windows.net',
    database: 'CostaRicaFitness',
    user: 'JaimDavid',
    password: 'Jaim1311*',
    options: {
        encrypt: true,
        trustServerCertificate: false,
        enableArithAbort: true
    }
};

app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send('Error interno del servidor');
});

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

sql.connect(config).then(function () {
    console.log('Conexión a la base de datos establecida');
}).catch(function (err) {
    console.error('Error al conectar a la base de datos: ' + err.stack);
});

app.post('/api/buscar-cedula', async function (req, res) {
    const cedula = req.body.cedula;
    try {
        const result = await sql.query(`SELECT * FROM Personas WHERE cedula = '${cedula}'`);
        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Cédula no encontrada en la base de datos' });
        }
        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).json({ error: 'Error al buscar la cédula en la base de datos' });
    }
});

// Iniciar el servidor
app.listen(port, function () {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
