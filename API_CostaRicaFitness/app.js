const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const crypto = require('crypto');

const app = express();
const port = 3020;

app.use(bodyParser.json());

//Global USE

const config = {
    server: 'costa-rica-fitness.database.windows.net',
    database: 'CostaRicaFitness',
    user: 'JaimDavid',
    password: 'Jaim1311*',
    options: {
        encrypt: true,
        trustServerCertificate: false, 
        enableArithAbort: true
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

async function obtenerIdUsuarioPorCedula(CedulaObtenerID) {
    try {
        await conectarBaseDeDatos();
        const request = new sql.Request();
        console.log('Cedula de obtener idusuario por cedula: ',CedulaObtenerID)
        request.input('Cedula', sql.VarChar(50), CedulaObtenerID);
        const result = await request.execute('BuscarUsuarioPorCedula');
        
        if (result.recordset.length > 0) {
            CedulaObtenerID = result.recordset[0].idusuarios;
            console.log('ID de usuario encontrado:', CedulaObtenerID);
            return CedulaObtenerID;
        } else {
            console.log('No se encontró ningún usuario con la cédula proporcionada:', CedulaObtenerID);
            return null;
        }
    } catch (error) {
        console.error('Error al buscar el usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

async function obtenerFechaRegistroUsuario(cedula) {
    try {
        await conectarBaseDeDatos();
        const request = new sql.Request();
        request.input('Cedula', sql.VarChar, cedula);
        const result = await request.execute('ObtenerFechaRegistroUsuario');
        
        if (result.recordset.length > 0) {
            const fechaRegistro = result.recordset[0].FechaRegistro;
            console.log('Fecha de registro del usuario encontrado:', fechaRegistro);
            return fechaRegistro;
        } else {
            console.log('No se encontró la fecha de registro del usuario con la cédula proporcionada:', cedula);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener la fecha de registro del usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

//MODEL MAIN

// Método para encriptar un password con IV
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

app.post('/insertarUsuario', async (req, res) => {
    const { nombre, password, correo, telefono, edad, idUsuario, idMembresia, idEmpresa, question, answer } = req.body;

    if (!nombre || !password || !correo || !telefono || !edad || !idUsuario || !idMembresia || !idEmpresa || !question || !answer) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    // Parsear la fecha de la cadena proporcionada en el cuerpo de la solicitud
    const fechaRegistro = new Date(req.body.fechaRegistro);

    try {
        await insertarUsuario(nombre, password, correo, telefono, edad, fechaRegistro, idUsuario, idMembresia, idEmpresa, question, answer);

        res.status(200).json({ message: 'Usuario insertado correctamente' });
    } catch (error) {
        console.error('Error en la API al insertar usuario:', error);
        res.status(500).json({ error: 'Error en la API al insertar usuario' });
    }
});

//login model

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
app.post('/verificarCredenciales', async (req, res) => {
    const { cedula, password } = req.body;

    if (!cedula || !password) {
        return res.status(400).json({ error: 'La cédula y la contraseña son obligatorias' });
    }

    try {
        const resultado = await verificarCredenciales(cedula, password);
        res.status(200).json({ resultado });
    } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        res.status(500).json({ error: 'Error al verificar las credenciales' });
    }
});

app.post('/actualizarActividadUsuario', async (req, res) => {
    const { cedula, actividad } = req.body;

    if (!cedula || !actividad) {
        return res.status(400).json({ error: 'La cédula y la actividad son obligatorias' });
    }

    try {
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        await pool.request()
            .input('cedula', sql.VarChar, cedula)
            .input('actividad', sql.VarChar, actividad)
            .query(`UPDATE Usuarios SET Actividad = @actividad WHERE cedula = @cedula`);
        console.log('Actividad del usuario actualizada correctamente.');
        res.status(200).json({ message: 'Actividad del usuario actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la actividad del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar la actividad del usuario' });
    } finally {
        await cerrarConexion();
    }
});
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

app.post('/actualizarActividadUsuario', async (req, res) => {
    const { cedula, actividad } = req.body;

    if (!cedula || !actividad) {
        return res.status(400).json({ error: 'La cédula y la actividad son obligatorias' });
    }

    try {
        await actualizarActividadUsuario(cedula, actividad);

        res.status(200).json({ message: 'Actividad del usuario actualizada correctamente' });
    } catch (error) {
        console.error('Error al actualizar la actividad del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar la actividad del usuario' });
    }
});

async function insertarRegistroLog(cedula, actividad) {
    try {
        console.log('Cedula en Function insert registro log: ',cedula)
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);
        console.log('idUsuario: ',idUsuario)
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        await pool.request()
            .input('idUsuario', sql.Int, idUsuario)  
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

app.post('/insertarRegistroLog', async (req, res) => {
    const { cedula, actividad } = req.body;
    console.log('Cedula que llega a la API: ', req.body.cedula)
    if (!cedula || !actividad) {
        return res.status(400).json({ error: 'La cédula y la actividad son obligatorias' });
    }

    try {
        await insertarRegistroLog(cedula, actividad);
        res.status(200).json({ message: 'Registro de log insertado correctamente' });
    } catch (error) {
        console.error('Error al insertar el registro de log:', error);
        res.status(500).json({ error: 'Error al insertar el registro de log' });
    }
});

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
            return null; 
        }
    } catch (error) {
        console.error('Error al buscar actividad por cédula:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

app.post('/buscarActividadPorCedula', async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({ error: 'Se requiere la cédula en el cuerpo de la solicitud' });
    }

    try {
        const actividad = await buscarActividadPorCedula(cedula);
        if (actividad) {
            res.status(200).json({ actividad });
        } else {
            res.status(404).json({ message: 'No se encontró actividad para la cédula especificada' });
        }
    } catch (error) {
        console.error('Error al buscar actividad por cédula:', error);
        res.status(500).json({ error: 'Error al buscar actividad por cédula' });
    }
});

async function buscarCorreoPorCedula(cedula) {
    try {
        await conectarBaseDeDatos();
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('cedula', sql.VarChar(50), cedula)
            .query('SELECT Correo FROM Usuarios WHERE cedula = @cedula');
        
        if (result.recordset.length > 0) {
            return result.recordset[0].Correo;
        } else {
            return null; 
        }
    } catch (error) {
        console.error('Error al buscar el correo por cédula:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

app.post('/buscarCorreoPorCedula', async (req, res) => {
    const { cedula } = req.body;

    if (!cedula) {
        return res.status(400).json({ error: 'Se requiere la cédula en el cuerpo de la solicitud' });
    }

    try {
        const correo = await buscarCorreoPorCedula(cedula);
        if (correo) {
            res.status(200).json({ correo });
        } else {
            res.status(404).json({ message: 'No se encontró correo para la cédula especificada' });
        }
    } catch (error) {
        console.error('Error al buscar el correo por cédula:', error);
        res.status(500).json({ error: 'Error al buscar el correo por cédula' });
    }
});

//clases

async function insertclases(userID, idClase) {
    try {

        const idUsuario = await obtenerIdUsuarioPorCedula(userID);

        if (idUsuario !== null) {
            await conectarBaseDeDatos();
            const request = new sql.Request();
            request.input('idUsuario', sql.Int, idUsuario);
            request.input('idClase', sql.Int, idClase);
            await request.execute('InsertarUserClass');
            
            console.log('Registro insertado correctamente en la tabla User_Class.');
        } else {
            console.log('No se puede insertar el registro en la tabla User_Class porque no se encontró el usuario con la cédula proporcionada.');
        }
    } catch (error) {
        console.error('Error al ejecutar el método principal:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

app.post('/insertarClase', async (req, res) => {
    const { userID, idClase } = req.body;

    if (!userID || !idClase) {
        return res.status(400).json({ error: 'El ID de usuario y el ID de clase son obligatorios' });
    }

    try {
        await insertclases(userID, idClase);
        res.status(200).json({ message: 'Registro insertado correctamente en la tabla User_Class' });
    } catch (error) {
        console.error('Error al insertar la clase:', error);
        res.status(500).json({ error: 'Error al insertar la clase' });
    }
});

async function WatchClass(cedula) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);
        if (idUsuario) {
            console.log(`ID de usuario encontrado para cédula ${cedula}: ${idUsuario}`);
            await conectarBaseDeDatos();
            const request = new sql.Request();
            request.input('idusuarios', sql.Int, idUsuario);
            const result = await request.execute('BuscarClasesPorUsuario');
            if (result.recordset.length > 0) {
                console.log('Clases encontradas:');
                const clasesEncontradas = result.recordset.map(row => row.nombreClase);
                return clasesEncontradas;
            } else {
                console.log('No se encontraron clases para el usuario con idusuarios:', idUsuario);
                return [];
            }
        } else {
            console.log('No se encontró ningún usuario con la cédula proporcionada:', cedula);
            return [];
        }
    } catch (error) {
        console.error('Error al ejecutar WatchClass:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

app.post('/verClases', async (req, res) => {
    const { cedula } = req.body;
    try {
        const clases = await WatchClass(cedula);
        res.json(clases);
    } catch (error) {
        console.error('Error al buscar clases:', error);
        res.status(500).json({ error: 'Error al buscar clases' });
    }
});

//inbody

async function procesarDatosInBody(cedula, data) {
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);
        
        if (idUsuario) {
            await conectarBaseDeDatos();
            console.log("Cédula del usuario:", cedula);
            console.log("Datos de InBody recibidos y procesados:", data);
            console.log("ID de usuario:", idUsuario);
            
            const request = new sql.Request();
            request.input('peso_total', sql.Decimal(10, 2), data.total_weight);
            request.input('masa_muscular', sql.Decimal(10, 2), data.muscle_mass);
            request.input('porcentaje_grasa', sql.Decimal(5, 2), data.body_fat_percentage);
            request.input('porcentaje_masa_muscular', sql.Decimal(5, 2), data.muscle_mass_percentage);
            request.input('agua_corporal_total', sql.Decimal(10, 2), data.total_body_water);
            request.input('imc', sql.Decimal(5, 2), data.bmi);
            request.input('nivel_grasa_visceral', sql.Int, data.visceral_fat_level);
            request.input('idusuarios', sql.Int, idUsuario);
            
            await request.execute('InsertarDatosInBody');
            
            console.log('Datos de InBody insertados correctamente.');
        } else {
            console.log('No se encontró ningún usuario con la cédula proporcionada:', cedula);
        }
    } catch (error) {
        console.error('Error al procesar los datos de InBody:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

app.post('/procesarDatosInBody', async (req, res) => {
    try {
        const cedula = req.body.cedula;
        const data = req.body.data;
        await procesarDatosInBody(cedula, data);
        res.status(200).send('Datos de InBody procesados correctamente.');
    } catch (error) {
        console.error('Error al procesar los datos de InBody:', error);
        res.status(500).send('Ocurrió un error al procesar los datos de InBody.');
    }
});

//contratar entrenador
const contratarEntrenador = async (cedula, idPersonal) => {
    console.log(`Modelo: Contratando entrenador para cédula ${cedula} con ID ${idPersonal}`);
    
    try {
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);

        if (idUsuario) {
            console.log(`ID de usuario encontrada: ${idUsuario}`);
            await conectarBaseDeDatos();
            const request = new sql.Request();
            request.input('idPersonal', sql.Int, idPersonal);
            request.input('idUsuario', sql.Int, idUsuario);
            const result = await request.execute('InsertarTrainingForPersonal');
            console.log('Datos insertados correctamente en TraininigForPersonal.');
        } else {
            console.log('No se pudo encontrar la ID de usuario.');
        }
    } catch (error) {
        console.error('Error al intentar obtener la ID de usuario o al insertar datos en TraininigForPersonal:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
};

app.post('/contratarEntrenador', async (req, res) => {
    try {
        const cedula = req.body.cedula;
        const idPersonal = req.body.idPersonal;
        await contratarEntrenador(cedula, idPersonal);
        res.status(200).send('Entrenador contratado correctamente.');
    } catch (error) {
        console.error('Error al contratar entrenador:', error);
        res.status(500).send('Ocurrió un error al intentar contratar al entrenador.');
    }
});

//WWU

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

// Endpoint para insertar el currículum en la API
app.post('/insertarCV', async (req, res) => {
    try {
        const { nombre, cedula, telefono, correo } = req.body;
        const mensaje = await insertCV(nombre, cedula, telefono, correo);
        res.status(200).json({ mensaje: mensaje });
    } catch (error) {
        console.error('Error al insertar el currículum:', error);
        res.status(500).send('Ocurrió un error al procesar la solicitud.');
    }
});

//ViewUsuario
async function obtenerInformacionUsuario(cedula) {
    try {
        const FechaRegistro = await obtenerFechaRegistroUsuario(cedula);
        const idUsuario = await obtenerIdUsuarioPorCedula(cedula);
        
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
            console.log('No se pudo obtener la idusuarios del usuario con la cédula proporcionada:', cedula);
            return null;
        }
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        throw error;
    } finally {
        await cerrarConexion();
    }
}

app.post('/obtenerInformacionUsuario', async (req, res) => {
    try {
        const { cedula } = req.body;
        const informacionUsuario = await obtenerInformacionUsuario(cedula);
        if (informacionUsuario) {
            res.status(200).json({ informacionUsuario: informacionUsuario });
        } else {
            res.status(404).send('No se encontró información del usuario.');
        }
    } catch (error) {
        console.error('Error al obtener información del usuario:', error);
        res.status(500).send('Ocurrió un error al procesar la solicitud.');
    }
});

/*QA */
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
app.post('/actualizarContrasena', async (req, res) => {
    const { cedula, newPassword } = req.body;
    console.log('Cedula que llega a la API: ', req.body.cedula);
    if (!cedula || !newPassword) {
        return res.status(400).json({ error: 'La cédula y la nueva contraseña son obligatorias' });
    }
    try {
        await UpdatePassword(cedula, newPassword);
        console.log('Contraseña actualizada correctamente')
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.log('Contraseña no actualizada por error')
        console.error('Error al actualizar la contraseña:', error);
        res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }
});
//recovermodel
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

app.post('/buscarPreguntaRespuesta', async (req, res) => {
    const { cedula } = req.body;
    console.log('Cedula que llega a la API: ', req.body.cedula);
    if (!cedula) {
        return res.status(400).json({ error: 'La cédula es obligatoria' });
    }

    try {
        const result = await buscarPreguntaRespuestaPorCedula(cedula);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al buscar pregunta y respuesta por cédula:', error);
        res.status(500).json({ error: 'Error al buscar pregunta y respuesta por cédula' });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});
