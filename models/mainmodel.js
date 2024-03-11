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
    return encryptedDataWithIV;
}


async function insertarUsuario(nombre, password, correo, telefono, edad, fechaRegistro, idUsuario, idMembresia, idEmpresa, question, answer) {
    let contraseñaEncriptada;
    try {
        await conectarBaseDeDatos();
        const actividad = "Activo";
        const fechaISO = fechaRegistro.toISOString();
        contraseñaEncriptada = encryptPasswordWithIV(password);
        const clave = Buffer.from('...clave generada anteriormente...', 'hex');
        console.log("Contraseña encriptada:", contraseñaEncriptada);
        const contraseñaBinaria = Buffer.from(contraseñaEncriptada, 'hex');

        await sql.query`INSERT INTO Usuarios (cedula, Nombre, ContraseñaEncriptada, Telefono, Edad, Correo, FechaRegistro, idMembresia, idEmpresa, Pregunta, Respuesta, Actividad)
            VALUES (${idUsuario}, ${nombre}, ${contraseñaBinaria}, ${telefono}, ${edad}, ${correo}, ${fechaISO}, ${idMembresia}, ${idEmpresa}, ${question}, ${answer}, ${actividad})`;

        await cerrarConexion();

        console.log('Usuario insertado correctamente.');
    } catch (error) {
        console.error('Error al insertar usuario en la base de datos:', error);
        throw error;
    }
}

async function processFormData(formData) {
    try {
        console.log('Datos recibidos en el modelo:', formData);
        await insertarUsuario(formData.fullName,formData.password, formData.email, formData.phone, formData.age, formData.fechaRegistro, formData.id, formData.membershipId, formData.company,formData.question,formData.answer);

        console.log('Procesamiento de datos completado en el modelo.');
    } catch (error) {
        console.error('Error al procesar los datos en el modelo:', error);
        throw error;
    }
}


module.exports = {
    processFormData
};
