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

const contratarEntrenador = async (cedula, idPersonal) => {
    console.log(`Modelo: Contratando entrenador para cédula ${cedula} con ID ${idPersonal}`);
    
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);

        if (idUsuario) {
            console.log(`ID de usuario encontrada: ${idUsuario}`);
            await conectarBaseDeDatos();
            const request = new sql.Request();
            request.input('idPersonal', sql.Int, idPersonal);
            request.input('idUsuario', sql.Int, idUsuario);
            const result = await request.execute('InsertarTrainingForPersonal');
            console.log('Datos insertados correctamente en TraininigForPersonal.');
        } else {
            console.log('No se pudo encontrar la ID de usuario.');
        }
    } catch (error) {
        console.error('Error al intentar obtener la ID de usuario o al insertar datos en TraininigForPersonal:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
};

module.exports = {
    contratarEntrenador
};
