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

async function buscarPreguntaRespuestaPorCedula(cedula) {
    try {
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('cedula', sql.VarChar(50), cedula)
            .query('SELECT Pregunta, Respuesta, Correo FROM Usuarios WHERE cedula = @cedula');
        cerrarConexion();
        return result.recordset;
    } catch (error) {
        console.error('Error al buscar pregunta y respuesta por cédula:', error);
        throw error;
    }
}

module.exports = {
    buscarPreguntaRespuestaPorCedula
};
