//app.js
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const paypal = require('paypal-rest-sdk');

const app = express();
const PORT = 5000;

// Configurar bodyParser para manejar solicitudes JSON
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

async function conectarBaseDeDatos() {
    try {
        await sql.connect(config);
        console.log('Conexión establecida correctamente.');
    } catch (error) {
        console.log('Error al conectar a la base de datos:', error);
        throw error;
    }
}

async function cerrarConexion() {
    try {
        await sql.close();
        console.log('Conexión cerrada.');
    } catch (error) {
        console.log('Error al cerrar la conexión a la base de datos:', error);
        throw error;
    }
}

// Configurar las credenciales de la API de PayPal
paypal.configure({
  'mode': 'sandbox', // Modo sandbox para pruebas
  'client_id': 'AbPtpDRgqWRbuvFRgp3Pvdt5_ZpiR9s5Re6lXK_exutyOLUopWgzhaD1NUF5Xu-IKjbpvb-8EMUSmjkY',
  'client_secret': 'EDn6wx4gqFULIaeiEKdPseH1a5bQmXioHbW0HuLgDhGS6nfmLaTPkQTzL_JA6-b-N3tssJVD68drU4dh' 
});

// Ruta para realizar un pago a través de PayPal
app.post('/realizar_pago_paypal', (req, res) => {
    const { monto, descripcion, correo_destinatario } = req.body;

    // Crear un objeto de pago
    const pago = {
        'intent': 'sale',
        'payer': {
            'payment_method': 'paypal'
        },
        'transactions': [{
            'amount': {
                'total': monto.toString(),
                'currency': 'USD'
            },
            'description': descripcion
        }],
        'redirect_urls': {
            'return_url': 'http://localhost:5000/pago_exitoso',
            'cancel_url': 'http://localhost:5000/pago_cancelado'
        }
    };

    // Crear el pago a través de la API de PayPal
    paypal.payment.create(pago, (error, payment) => {
        if (error) {
            return res.status(400).json({ 'resultado': false, 'mensaje': error.message });
        } else {
            // Redireccionar al usuario a la página de PayPal para completar el pago
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === 'approval_url') {
                    return res.json({ 'resultado': true, 'redirect_url': payment.links[i].href });
                }
            }
        }
    });
});

// Rutas para el manejo de pagos exitosos y cancelados
app.get('/pago_exitoso', (req, res) => {
    res.redirect('http://localhost:3001/login');
});

app.get('/pago_cancelado', (req, res) => {
    res.redirect('http://localhost:3001/pago');
});
// Ruta para restar monto de una cuenta
app.post('/restar_monto', async (req, res) => {
    try {
        await conectarBaseDeDatos(); // Conectar a la base de datos

        const { numero_cuenta, cantidad } = req.body;

        // Ejecutar consulta para obtener la cuenta
        const result = await sql.query`SELECT * FROM Cuenta WHERE NumeroCuenta = ${numero_cuenta}`;

        if (!result.recordset.length) {
            return res.status(404).json({ resultado: false, mensaje: 'La cuenta no existe' });
        }

        const cuenta = result.recordset[0];

        if (cuenta.Monto >= cantidad) {
            // Restar el monto de la cuenta
            await sql.query`UPDATE Cuenta SET Monto = Monto - ${cantidad} WHERE idCuenta = ${cuenta.idCuenta}`;
            await sql.close(); // Cerrar la conexión a la base de datos
            return res.status(200).json({ resultado: true, mensaje: 'Monto restado exitosamente' });
        } else {
            await sql.close(); // Cerrar la conexión a la base de datos
            return res.status(400).json({ resultado: false, mensaje: 'La cuenta no tiene suficiente saldo' });
        }
    } catch (error) {
        console.log('Error:', error);
        await sql.close(); // Cerrar la conexión a la base de datos en caso de error
        return res.status(500).json({ resultado: false, mensaje: 'Error al procesar la solicitud' });
    }
});

// Ruta para validar una tarjeta
app.post('/validar_tarjeta', async (req, res) => {
    try {
        await conectarBaseDeDatos(); // Conectar a la base de datos

        const { numero_tarjeta, expira, codigo, monto } = req.body;

        // Ejecutar consulta para obtener la tarjeta
        const result = await sql.query`SELECT * FROM Tarjeta WHERE Numero = ${numero_tarjeta} AND Expira = ${expira} AND Codigo = ${codigo}`;

        if (!result.recordset.length) {
            return res.status(404).json({ resultado: false, mensaje: 'La tarjeta no existe' });
        }

        const tarjeta = result.recordset[0];

        if (tarjeta.Monto >= monto) {
            // Restar el monto de la tarjeta
            await sql.query`UPDATE Tarjeta SET Monto = Monto - ${monto} WHERE idTarjeta = ${tarjeta.idTarjeta}`;
            await sql.close(); // Cerrar la conexión a la base de datos
            return res.status(200).json({ resultado: true, mensaje: 'Tarjeta validada y monto restado exitosamente' });
        } else {
            await sql.close(); // Cerrar la conexión a la base de datos
            return res.status(400).json({ resultado: false, mensaje: 'La tarjeta no tiene suficiente saldo' });
        }
    } catch (error) {
        console.log('Error:', error);
        await sql.close(); // Cerrar la conexión a la base de datos en caso de error
        return res.status(500).json({ resultado: false, mensaje: 'Error al procesar la solicitud' });
    }
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`);
});
