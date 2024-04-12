import express from 'express';
import bodyParser from 'body-parser';
import sql from 'mssql';

const app = express();
const port = 3000;

app.use(bodyParser.json());

const config = {
  user: 'JaimDavid',
  password: '1234',
  server: 'localhost',
  database: 'Registro_CostaRica',
  options: {
      encrypt: true,
      trustServerCertificate: true
  }
};

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Error interno del servidor');
});
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});



sql.connect(config).then(() => {
    console.log('Conexión a la base de datos establecida');
}).catch((err) => {
    console.error('Error al conectar a la base de datos: ' + err.stack);
});

app.post('/api/buscar-cedula', async (req, res) => {
    const { cedula } = req.body;

    try {
        const result = await sql.query`SELECT * FROM Personas WHERE cedula = ${cedula}`;

        if (result.recordset.length === 0) {
            return res.status(404).json({ error: 'Cédula no encontrada en la base de datos' });
        }

        res.json(result.recordset[0]);
    } catch (err) {
        console.error('Error al ejecutar la consulta: ' + err);
        res.status(500).json({ error: 'Error al buscar la cédula en la base de datos' });
    }
});

app.post('/api/buscar-cedula', async (req, res) => {
    const { cedula } = req.body;

    try {
        const result = await sql.query`SELECT * FROM Personas WHERE cedula = ${cedula}`;

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
app.listen(port, () => {
    console.log(`Servidor en ejecución en http://localhost:${port}`);
});
