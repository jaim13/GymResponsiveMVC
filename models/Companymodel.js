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

const procesarDatosEmpresa = async (nombre, direccion, correo, telefono, contacto, tipo, membresia, idmember) => {
    try {
        await conectarBaseDeDatos();
        
        const request = new sql.Request();
        request.input('Nombre', sql.NVarChar(100), nombre);
        request.input('Direccion', sql.NVarChar(100), direccion);
        request.input('CorreoElectronico', sql.NVarChar(100), correo);
        request.input('Telefono', sql.NVarChar(20), telefono);
        request.input('PersonaContacto', sql.NVarChar(100), contacto);
        request.input('TipoEmpresa', sql.NVarChar(50), tipo);
        request.input('idMembresia', sql.Int, idmember);
        
        const result = await request.execute('InsertarEmpresa');
        const nuevoIdEmpresa = result.recordset[0].NuevoIdEmpresa;
        
        console.log('Nueva empresa insertada con ID:', nuevoIdEmpresa);
    } catch (error) {
        console.error('Error al procesar los datos de la empresa en el modelo:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
};

module.exports = {
    procesarDatosEmpresa
};
