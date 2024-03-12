const recoverModel = require('../models/recovermodel');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

const generateShortToken = (pregunta,respuesta) => {
    const salt = 'gm';
    const hash = crypto.createHash('sha256');
    hash.update(pregunta+respuesta + salt); // Agrega el salt al correo electrónico antes de generar el hash
    const token = hash.digest('base64').substring(0, 10); // Tomar los primeros 10 caracteres del hash codificado en Base64
    return token;
};
async function sendTokenByEmail(email, pregunta,token) {
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
            subject: 'Unique Token for Password Recovery',
            html: `
                <p>Dear user,</p>
                <p>A password recovery has been requested for your account. Here is the necessary information:</p>
                <p>Security Question: <strong>${pregunta}</strong></p>
                <p>Unique Token for Recovery: <strong>${token}</strong></p>
                <p>Please use this token along with the question and the answer to complete the password recovery process.</p>
                <p>Thank you.</p>
            `
        };
        const info = await transporter.sendMail(mailOptions);
        console.log('Correo enviado:', info.response);
        return true; // Envío exitoso
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        return false; // Envío fallido
    }
}
async function handleRecover(req, res) {
    try {
        const { id } = req.body;
        console.log('Cedula del controller:', id);

        const result = await recoverModel.buscarPreguntaRespuestaPorCedula(id);

        if (result.length > 0) {
            const pregunta = result[0].Pregunta;
            const respuesta = result[0].Respuesta;
            const Correo = result[0].Correo;
            console.log('Correo: ',Correo);
            const token = generateShortToken(pregunta,respuesta)
            console.log("Token generado", token);
            sendTokenByEmail(Correo, pregunta, token)
            console.log('Pregunta:', pregunta);
            console.log('Respuesta:', respuesta);
            res.cookie('recoveryData', { pregunta, respuesta, token, id }, { httpOnly: true });
            res.redirect('/QA');
        } else {
            res.status(404).json({ message: 'No se encontró la cédula en la base de datos.' });
        }
    } catch (error) {
        console.error('Error al manejar la solicitud de recuperación de contraseña:', error);
        res.status(500).json({ message: 'Ocurrió un error al procesar la solicitud de recuperación de contraseña.' });
    }
}

module.exports = {
    handleRecover
};
