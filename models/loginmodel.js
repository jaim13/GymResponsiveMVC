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

async function verificarCredenciales(cedula, password) {
    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('password', sql.VarChar, password)
            .query(`SELECT COUNT(*) AS Count FROM Usuarios WHERE cedula = @cedula AND Contraseña = @password`);

        const count = result.recordset[0].Count;

        return count > 0 ? 'Éxito' : 'Credenciales inválidas';
    } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        throw error;
    } finally {
        await sql.close();
    }
}


module.exports = {
    verificarCredenciales
};


module.exports = {
    verificarCredenciales
};
