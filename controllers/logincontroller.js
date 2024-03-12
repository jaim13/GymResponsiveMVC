const loginModel = require('../models/loginmodel');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateShortToken = (cedula,password) => {
    const salt = 'gm';
    const hash = crypto.createHash('sha256');
    hash.update(cedula+password + salt); // Agrega el salt al correo electrónico antes de generar el hash
    const token = hash.digest('base64').substring(0, 10); // Tomar los primeros 10 caracteres del hash codificado en Base64
    return token;
};

async function sendTokenByEmail(email,token) {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'jaimmartinez13@gmail.com',
                pass: 'envb ycip opre wfbi'
            }
        });

        const mailOptions = {
            from: 'jaimmartinez13@gmail.com',
            to: email,
            subject: 'Verification',
            html: `
                <p>Dear user,</p>
                <p>The next information is needed for your safety, please write this token in the selected field.</p>
                <p>Unique Token for Verification: <strong>${token}</strong></p>
                <p>Thank you.</p>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return true; 
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false; 
    }
}
const handleLogin = async (req, res) => {
    try {
        const { cedula, password } = req.body;
        let intentosFallidos = req.cookies.intentosFallidos || 0;
        let actividad;
        const resultadoVerificacion = await loginModel.verificarCredenciales(cedula, password);
        const actividadBD = await loginModel.buscarActividadPorCedula(cedula);
        const CorreoBD = await loginModel.buscarCorreoPorCedula(cedula);
        console.log('Correo en Base de datos: ', CorreoBD);

        if (actividadBD === 'Inactivo') {
            res.redirect('/Recover')
            return res.status(403).send('La actividad de su cuenta está inactiva. Por favor, contacte al administrador.');
        }

        if (resultadoVerificacion === 'Éxito') {
            res.cookie('cedula', cedula);
            res.cookie('intentosFallidos', 0, { maxAge: 0 });
            actividad = 'SuccesfullLog';
            const token = generateShortToken(cedula, password);
            res.cookie('token', token); 
            await loginModel.insertarRegistroLog(cedula, actividad);
            sendTokenByEmail(CorreoBD, token);
            res.redirect('/Verification');
        } else {
            intentosFallidos++;
            actividad = 'FailLog';
            res.cookie('intentosFallidos', intentosFallidos, { maxAge: 900000 });
            await loginModel.insertarRegistroLog(cedula, actividad);
            if (intentosFallidos >= 3) { 
                const inactivo = "Inactivo";
                actividad = 'BlockedLog';
                await loginModel.insertarRegistroLog(cedula, actividad);
                await loginModel.actualizarActividadUsuario(cedula, inactivo);
            }
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error al manejar la solicitud de inicio de sesión:', error);
        res.status(500).send('Ocurrió un error al procesar la solicitud de inicio de sesión.');
    }
};

module.exports = {
    handleLogin
};

