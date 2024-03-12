const sql = require('mssql');
const crypto = require('crypto');

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
        console.log('Conexión cerrada.');
    } catch (error) {
        console.log('Error al cerrar la conexión a la base de datos:', error);
        throw error;
    }
}

async function decryptPassword(encryptedPassword) {
    try {
        // Convertir la cadena hexadecimal a un buffer
        const encryptedBuffer = Buffer.from(encryptedPassword, 'hex');

        // Obtener los primeros 16 bytes como IV
        const iv = encryptedBuffer.slice(0, 16);

        // Obtener el resto como datos encriptados
        const encryptedData = encryptedBuffer.slice(16);

        // Generar clave de 256 bits (32 bytes)
        const key = crypto.createHash('sha256').update('gm').digest();

        // Crear el objeto decipher
        const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);

        // Desencriptar los datos
        let decryptedPassword = decipher.update(encryptedData);
        decryptedPassword = Buffer.concat([decryptedPassword, decipher.final()]);

        // Convertir el buffer resultante a una cadena UTF-8
        return decryptedPassword.toString('utf-8');
    } catch (error) {
        console.error('Error al descifrar la contraseña:', error);
        throw error;
    }
}


async function verificarCredenciales(cedula, password) {
    try {
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .query(`SELECT ContraseñaEncriptada FROM Usuarios WHERE cedula = @cedula`);

        const encryptedPasswordFromDB = result.recordset[0].ContraseñaEncriptada;
        console.log('Contraseña encriptada de la base de datos:', encryptedPasswordFromDB);

        const decryptedPasswordFromDB = await decryptPassword(encryptedPasswordFromDB);
        console.log('Contraseña descifrada de la base de datos:', decryptedPasswordFromDB);

        return decryptedPasswordFromDB === password ? 'Éxito' : 'Credenciales inválidas';
    } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}
async function actualizarActividadUsuario(cedula, actividad) {
    try {
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('actividad', sql.VarChar, actividad)
            .query(`UPDATE Usuarios SET Actividad = @actividad WHERE cedula = @cedula`);
        console.log('Actividad del usuario actualizada correctamente.');
    } catch (error) {
        console.error('Error al actualizar la actividad del usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
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
async function insertarRegistroLog(cedula, actividad) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);
        console.log('idUsuario: ',idUsuario)
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        await pool.request()
            .input('idUsuario', sql.Int, idUsuario)  // Corregir nombre del parámetro aquí
            .input('actividad', sql.VarChar(100), actividad)
            .execute('InsertLogs');
        console.log('Registro de log insertado correctamente.');
    } catch (error) {
        console.error('Error al insertar el registro de log:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}
async function buscarActividadPorCedula(cedula) {
    try {
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('cedula', sql.VarChar(50), cedula)
            .query('EXEC BuscarActividadPorCedula @cedula');
        
        if (result.recordset.length > 0) {
            return result.recordset[0].Actividad;
        } else {
            return null; // No se encontró ninguna actividad para la cédula dada
        }
    } catch (error) {
        console.error('Error al buscar actividad por cédula:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}


module.exports = {
    verificarCredenciales,
    actualizarActividadUsuario,
    insertarRegistroLog,
    buscarActividadPorCedula
};