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
        console.log('Conexión cerrada.');
    } catch (error) {
        console.log('Error al cerrar la conexión a la base de datos:', error);
        throw error;
    }
}

async function insertarUsuario(nombre,password, correo, telefono, edad, fechaRegistro, idUsuario, idMembresia, idEmpresa) {
    try {
        await conectarBaseDeDatos();
        const fechaISO = fechaRegistro.toISOString();

        await sql.query`INSERT INTO Usuarios (cedula, Nombre, Contraseña, Telefono, Edad, Correo, FechaRegistro, idMembresia, idEmpresa)
            VALUES (${idUsuario}, ${nombre}, ${password}, ${telefono}, ${edad}, ${correo}, ${fechaISO}, ${idMembresia}, ${idEmpresa})`;

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
        await insertarUsuario(formData.fullName,formData.password, formData.email, formData.phone, formData.age, formData.fechaRegistro, formData.id, formData.membershipId, formData.company);

        console.log('Procesamiento de datos completado en el modelo.');
    } catch (error) {
        console.error('Error al procesar los datos en el modelo:', error);
        throw error;
    }
}


module.exports = {
    processFormData
};
