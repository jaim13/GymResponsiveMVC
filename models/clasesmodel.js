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

async function insertclases(userID, idClase) {
    try {

        const idUsuario = await obtenerIdUsuarioPorCedula(userID);

        if (idUsuario !== null) {
            await conectarBaseDeDatos();
            const request = new sql.Request();

            request.input('idUsuario', sql.Int, idUsuario);
            request.input('idClase', sql.Int, idClase);

            await request.execute('InsertarUserClass');
            
            console.log('Registro insertado correctamente en la tabla User_Class.');
        } else {
            console.log('No se puede insertar el registro en la tabla User_Class porque no se encontró el usuario con la cédula proporcionada.');
        }
    } catch (error) {
        console.error('Error al ejecutar el método principal:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}
async function WatchClass(cedula) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);
        if (idUsuario) {
            console.log(`ID de usuario encontrado para cédula ${cedula}: ${idUsuario}`);
            await conectarBaseDeDatos();
            const request = new sql.Request();
            request.input('idusuarios', sql.Int, idUsuario);
            const result = await request.execute('BuscarClasesPorUsuario');
            if (result.recordset.length > 0) {
                console.log('Clases encontradas:');
                const clasesEncontradas = result.recordset.map(row => row.nombreClase);
                return clasesEncontradas;
            } else {
                console.log('No se encontraron clases para el usuario con idusuarios:', idUsuario);
                return [];
            }
        } else {
            console.log('No se encontró ningún usuario con la cédula proporcionada:', cedula);
            return [];
        }
    } catch (error) {
        console.error('Error al ejecutar WatchClass:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

module.exports = {
    insertclases,
    WatchClass
};
