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

async function insertCV(nombre, cedula, telefono, correo) {
    try {
        await conectarBaseDeDatos();
        console.log("Datos recibidos en el modelo:", { nombre, cedula, telefono, correo }); 
        const request = new sql.Request();
        request.input('Nombre', sql.VarChar(100), nombre);
        request.input('Cedula', sql.VarChar(20), cedula);
        request.input('Telefono', sql.VarChar(20), telefono);
        request.input('Correo', sql.VarChar(100), correo);
        const result = await request.execute('InsertarenCV');
        return result.recordset[0].Mensaje; 
    } catch (error) {
        throw error;
    } finally {
        await cerrarConexion();
    }
}

module.exports = {
    insertCV
};
