const sql = require('mssql');

const config = {
    user: 'JaimDavid',
    password: '1234',
    server: 'localhost',
    database: 'Proyecto1_PrograV',
    options: {
        encrypt: true,
        trustServerCertificate: true
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
        console.log('Conexión cerrada correctamente.');
    } catch (error) {
        console.log('Error al cerrar la conexión a la base de datos:', error);
        throw error;
    }
}
async function obtenerIdUsuarioPorCedula(userID) {
    try {
        await conectarBaseDeDatos();
        const request = new sql.Request();
        request.input('Cedula', sql.VarChar, userID);
        const result = await request.execute('BuscarUsuarioPorCedula');
        
        if (result.recordset.length > 0) {
            const idUsuario = result.recordset[0].idusuarios;
            console.log('ID de usuario encontrado:', idUsuario);
            return idUsuario;
        } else {
            console.log('No se encontró ningún usuario con la cédula proporcionada:', userID);
            return null;
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}
async function insertarPagoEnBaseDeDatos(FechaPago, Monto, MetodoPago, idUsuario) {
    try {
        await conectarBaseDeDatos();
        const request = new sql.Request();

        await request.input('FechaPago', sql.DateTime, FechaPago);
        await request.input('Monto', sql.Decimal(10, 2), Monto);
        await request.input('MetodoPago', sql.VarChar(50), MetodoPago);
        await request.input('idUsuario', sql.Int, idUsuario);

        const result = await request.execute('InsertarPago');
        console.log('Pago insertado correctamente.');
    } catch (error) {
        console.error('Error al insertar el pago:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

async function processPayment(paymentData, userID) {
    try {
        console.log('Datos del pago recibidos en el modelo:', paymentData);
        console.log('ID de usuario obtenido de la cookie:', userID);

        const idUsuario = await obtenerIdUsuarioPorCedula(userID);
        console.log('ID de usuario obtenido de la base de datos:', idUsuario);

        await insertarPagoEnBaseDeDatos(paymentData.fechaPago, paymentData.monto, paymentData.metodoPago, idUsuario);
        return { success: true, message: 'Pago procesado correctamente' };

    } catch (error) {
        console.error('Error al procesar el pago en el modelo:', error);
        throw error;
    }
}
module.exports = {
    processPayment
};
