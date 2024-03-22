const sql = require('mssql');
const axios = require('axios');
const xml2js = require('xml2js');
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

async function obtenerTipoDeCambio() {
    try {
        
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const fechaActual = `${day}/${month}/${year}`;

        // Parámetros para la solicitud al servicio web del Banco Central de Costa Rica
        const indicador = 318;
        const fechaInicio = fechaActual;
        const fechaFinal = fechaActual;
        const nombre = 'Jaim';
        const subNiveles = 'N';
        const correoElectronico = 'jaimmartinez13@gmail.com';
        const token = 'R3D3M2BIE2';

        // Realizar la solicitud al servicio web del Banco Central de Costa Rica
        const response = await axios.get('https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML', {
            params: {
                indicador: indicador,
                fechaInicio: fechaInicio,
                fechaFinal: fechaFinal,
                nombre: nombre,
                subNiveles: subNiveles,
                correoElectronico: correoElectronico,
                token: token
            }
        });

        // Parsear la respuesta XML
        const xmlData = await xml2js.parseStringPromise(response.data);

        return new Promise((resolve, reject) => {
            if (xmlData && xmlData.string && xmlData.string._) {
                const datos = xmlData.string._;
                const parser = new xml2js.Parser({ explicitArray: false });
                parser.parseString(datos, (err, result) => {
                    if (err) {
                        console.error('Error al parsear la respuesta XML:', err);
                        reject(err);
                    }
                    const valorCompraDolar = parseFloat(result.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.NUM_VALOR);
                    console.log('Valor de compra del dólar: ', valorCompraDolar);
                    resolve(valorCompraDolar);
                });
            } else {
                console.error('Estructura de respuesta XML inesperada:', xmlData);
                reject('Estructura de respuesta XML inesperada');
            }
        });
    } catch (error) {
        console.error('Error al obtener el valor de compra del dólar:', error);
        throw error; // Puedes lanzar el error para manejarlo desde la llamada a la función
    }
}



async function obtenerTipoDeCambioVenta() {
    try {
        
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const fechaActual = `${day}/${month}/${year}`;

        // Parámetros para la solicitud al servicio web del Banco Central de Costa Rica
        const indicador = 317;
        const fechaInicio = fechaActual;
        const fechaFinal = fechaActual;
        const nombre = 'Jaim';
        const subNiveles = 'N';
        const correoElectronico = 'jaimmartinez13@gmail.com';
        const token = 'R3D3M2BIE2';

        // Realizar la solicitud al servicio web del Banco Central de Costa Rica
        const response = await axios.get('https://gee.bccr.fi.cr/Indicadores/Suscripciones/WS/wsindicadoreseconomicos.asmx/ObtenerIndicadoresEconomicosXML', {
            params: {
                indicador: indicador,
                fechaInicio: fechaInicio,
                fechaFinal: fechaFinal,
                nombre: nombre,
                subNiveles: subNiveles,
                correoElectronico: correoElectronico,
                token: token
            }
        });

        // Parsear la respuesta XML
        const xmlData = await xml2js.parseStringPromise(response.data);

        return new Promise((resolve, reject) => {
            if (xmlData && xmlData.string && xmlData.string._) {
                const datos = xmlData.string._;
                const parser = new xml2js.Parser({ explicitArray: false });
                parser.parseString(datos, (err, result) => {
                    if (err) {
                        console.error('Error al parsear la respuesta XML:', err);
                        reject(err);
                    }
                    const valorCompraDolar = parseFloat(result.Datos_de_INGC011_CAT_INDICADORECONOMIC.INGC011_CAT_INDICADORECONOMIC.NUM_VALOR);
                    console.log('Valor de venta del dólar: ', valorCompraDolar);
                    resolve(valorCompraDolar);
                });
            } else {
                console.error('Estructura de respuesta XML inesperada:', xmlData);
                reject('Estructura de respuesta XML inesperada');
            }
        });
    } catch (error) {
        console.error('Error al obtener el valor de compra del dólar:', error);
        throw error; // Puedes lanzar el error para manejarlo desde la llamada a la función
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
    processPayment,
    obtenerTipoDeCambio,
    obtenerTipoDeCambioVenta
};
