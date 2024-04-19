const sql = require('mssql');
const axios = require('axios');
const xml2js = require('xml2js');
import('node-fetch').then(fetch => {
    // Aquí puedes usar la función fetch
}).catch(err => {
    console.error('Error al importar el módulo node-fetch:', err);
});

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

async function obteneridmembresia(idUsuario) {
    try {
        await conectarBaseDeDatos();
        const request = new sql.Request();
        request.input('idUsuario', sql.Int, idUsuario);
        const result = await request.query(`SELECT [idMembresia] FROM [Proyecto1_PrograV].[dbo].[Usuarios] WHERE [idusuarios] = @idUsuario`);
        
        if (result.recordset.length > 0) {
            const idMembresia = result.recordset[0].idMembresia;
            console.log('ID de membresía encontrado:', idMembresia);
            return idMembresia;
        } else {
            console.log('No se encontró ninguna membresía para el usuario con ID:', idUsuario);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener la membresía del usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
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
async function PaymentPaypal(Description, Correo, userID) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(userID);
        const idMembresia = await obteneridmembresia(idUsuario);
        let montoAPagar = 0;
        if (idMembresia === 1) {
            montoAPagar = 35000;
        } else {
            montoAPagar = 25000;
        }

        const data = {
            monto: montoAPagar,
            descripcion: Description,
            correo_destinatario: Correo
        };

        const response = await fetch('https://api-costaricafitness.onrender.com/realizar_pago_paypal', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (response.ok) {
            const responseData = await response.json();
            if (responseData.resultado && responseData.redirect_url) {
                // Devuelve la URL de redireccionamiento proporcionada por PayPal
                return responseData.redirect_url;
            } else {
                console.error('Error al procesar el pago:', responseData);
                throw new Error('Error al procesar el pago en la API de PayPal.');
            }
        } else {
            console.error('Error al procesar el pago:', response.statusText);
            throw new Error('Error al procesar el pago en la API de PayPal.');
        }
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        throw error;
    }
}


async function PagoTransferencia(numero_cuenta,userID) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(userID);
        const idMembresia = await obteneridmembresia(idUsuario);
        let montoAPagar = 0;
        if (idMembresia === 1) {
            montoAPagar = 35000;
        } else {
            montoAPagar = 25000;
        }

        const data = {
            numero_cuenta: numero_cuenta,
            cantidad: montoAPagar
        };

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };

        const apiUrl = 'https://api-costaricafitness.onrender.com/restar_monto';

        const response = await fetch(apiUrl, requestOptions);
        const responseData = await response.json();

        return responseData.resultado; // Devolver el valor booleano resultado

    } catch (error) {
        console.error('Error al procesar el pago:', error);
        return false; // En caso de error, devolver false
    }
}

async function PagoTarjeta(numeroTarjeta, cvv, expiracion,userID) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(userID);
        const idMembresia = await obteneridmembresia(idUsuario);
        let montoAPagar = 0;
        if (idMembresia === 1) {
            montoAPagar = 35000;
        } else {
            montoAPagar = 25000;
        }

        const response = await fetch('https://api-costaricafitness.onrender.com/validar_tarjeta', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        numero_tarjeta: numeroTarjeta,
        expira: expiracion,
        codigo: cvv,
        monto: montoAPagar
    })
});

        

        const responseData = await response.json();

        return responseData.resultado; // Devolver el valor booleano resultado

    } catch (error) {
        console.error('Error al procesar el pago:', error);
        return false; // En caso de error, devolver false
    }
}


async function processPayment(paymentData, userID) {
    try {
        console.log('Datos del pago recibidos en el modelo:', paymentData);
        console.log('ID de usuario obtenido de la cookie:', userID);

        const idUsuario = await obtenerIdUsuarioPorCedula(userID);
        const idMembresia = await obteneridmembresia(idUsuario);
        var  montoAPagar = 0;
        if (idMembresia === 1){
            montoAPagar= 35000;
        }else{
            montoAPagar = 25000;
        } 
        console.log('ID de usuario obtenido de la base de datos:', idUsuario);
        console.log('Monto a pagar: ',montoAPagar);
        await insertarPagoEnBaseDeDatos(paymentData.fechaPago, montoAPagar, paymentData.metodoPago, idUsuario);
        return { success: true, message: 'Pago procesado correctamente' };

    } catch (error) {
        console.error('Error al procesar el pago en el modelo:', error);
        throw error;
    }
}
module.exports = {
    processPayment,
    obtenerTipoDeCambio,
    obtenerTipoDeCambioVenta,
    PagoTransferencia,
    PagoTarjeta,
    PaymentPaypal
};
