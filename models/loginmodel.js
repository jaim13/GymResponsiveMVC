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
module.exports = {
    verificarCredenciales
};
