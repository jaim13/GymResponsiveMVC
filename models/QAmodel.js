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

function encryptPasswordWithIV(password) {
    const key = crypto.createHash('sha256').update('gm').digest(); // Generar clave de 256 bits (32 bytes)
    const iv = crypto.randomBytes(16); // IV de 16 bytes
    const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
    let encryptedPassword = cipher.update(password, 'utf-8', 'hex');
    encryptedPassword += cipher.final('hex');
    const encryptedDataWithIV = iv.toString('hex') + encryptedPassword;
    return Buffer.from(encryptedDataWithIV, 'hex'); // Convertir a formato compatible con varbinary
}

async function UpdatePassword(cedula, newPassword) {
    try {
        const newEncryptedPassword = encryptPasswordWithIV(newPassword);
        
        await conectarBaseDeDatos();

        const request = new sql.Request();
        const query = `
            UPDATE Usuarios
            SET ContraseñaEncriptada = @newEncryptedPassword,
                Actividad = 'Activo'
            WHERE cedula = @cedula
        `;
        request.input('newEncryptedPassword', sql.VarBinary, newEncryptedPassword);
        request.input('cedula', sql.NVarChar, cedula);

        const result = await request.query(query);
        console.log(`Contraseña actualizada correctamente para la cédula ${cedula}.`);
        
        await cerrarConexion();
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error);
        throw error;
    }
}


module.exports = {
    UpdatePassword
};
