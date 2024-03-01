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
async function obtenerFechaRegistroUsuario(userID) {
    try {
        await conectarBaseDeDatos();
        const request = new sql.Request();
        request.input('Cedula', sql.VarChar, userID);
        const result = await request.execute('ObtenerFechaRegistroUsuario');
        
        if (result.recordset.length > 0) {
            const fechaRegistro = result.recordset[0].FechaRegistro;
            console.log('Fecha de registro del usuario encontrado:', fechaRegistro);
            return fechaRegistro;
        } else {
            console.log('No se encontró la fecha de registro del usuario con la cédula proporcionada:', userID);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener la fecha de registro del usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}


async function obtenerInformacionUsuario(userID) {
    try {
        const FechaRegistro = await obtenerFechaRegistroUsuario(userID);
        const idUsuario = await obtenerIdUsuarioPorCedula(userID);
        
        if (idUsuario) {
            await conectarBaseDeDatos();
            const request = new sql.Request();
            request.input('idusuarios', sql.Int, idUsuario);
            const result = await request.query('SELECT idMembresia, Nombre FROM Usuarios WHERE idusuarios = @idusuarios');
            
            if (result.recordset.length > 0) {
                const informacionUsuario = {
                    idMembresia: result.recordset[0].idMembresia,
                    Nombre: result.recordset[0].Nombre,
                    FechaRegistro: FechaRegistro
                };
                console.log('Información del usuario encontrada:', informacionUsuario);
                return informacionUsuario;
            } else {
                console.log('No se encontró información del usuario con la idusuarios proporcionada:', idUsuario);
                return null;
            }
        } else {
            console.log('No se pudo obtener la idusuarios del usuario con la cédula proporcionada:', userID);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}
module.exports = {
    obtenerInformacionUsuario
};
