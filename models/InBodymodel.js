// InBodymodel.js
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
async function procesarDatosInBody(cedula, data) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);
        
        if (idUsuario) {
            await conectarBaseDeDatos();
            console.log("Cédula del usuario:", cedula);
            console.log("Datos de InBody recibidos y procesados:", data);
            console.log("ID de usuario:", idUsuario);
            
            const request = new sql.Request();
            request.input('peso_total', sql.Decimal(10, 2), data.total_weight);
            request.input('masa_muscular', sql.Decimal(10, 2), data.muscle_mass);
            request.input('porcentaje_grasa', sql.Decimal(5, 2), data.body_fat_percentage);
            request.input('porcentaje_masa_muscular', sql.Decimal(5, 2), data.muscle_mass_percentage);
            request.input('agua_corporal_total', sql.Decimal(10, 2), data.total_body_water);
            request.input('imc', sql.Decimal(5, 2), data.bmi);
            request.input('nivel_grasa_visceral', sql.Int, data.visceral_fat_level);
            request.input('idusuarios', sql.Int, idUsuario);
            
            await request.execute('InsertarDatosInBody');
            
            console.log('Datos de InBody insertados correctamente.');
        } else {
            console.log('No se encontró ningún usuario con la cédula proporcionada:', cedula);
        }
    } catch (error) {
        console.error('Error al procesar los datos de InBody:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

module.exports = {
    procesarDatosInBody
};
