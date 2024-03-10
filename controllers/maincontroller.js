const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mainModel = require('../models/mainModel');
const crypto = require('crypto');


const generateShortToken = (email) => {
    const hash = crypto.createHash('sha256');
    hash.update(email);
    return hash.digest('hex').substring(0, 10); // Tomamos los primeros 10 caracteres del hash como token
};

const sendTokenEmail = async (email, res) => {
    const token = generateShortToken(email);

    // Configuración del transportista de correo electrónico con Gmail
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
        subject: 'Token único para registro',
        text: `Aquí está su token único para el registro: ${token}`
    };

    // Envío del correo electrónico
    await transporter.sendMail(mailOptions);

    // Establecer la cookie del token
    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); // La cookie expira en 1 hora
};

const handleFormSubmit = async (req, res) => {
    try {
        const fechaRegistro = new Date();

        const formData = {
            id: req.body.id,
            password: req.body.password,
            fullName: req.body.fullName,
            email: req.body.email,
            age: req.body.age,
            phone: req.body.phone,
            company: req.body.company,
            fechaRegistro: fechaRegistro 
        };

        formData.company = req.body.company === "" ? 1 : req.body.company;

        let membershipId;
        if (req.body.membership === 'topTier') {
            membershipId = 1;
        } else if (req.body.membership === 'midTier') {
            membershipId = 2;
        } else {
            membershipId = null;
        }

        formData.membershipId = membershipId;

        const message = 'Enviando datos al modelo desde el controlador:';
        console.log(message, formData);

        await mainModel.processFormData(formData);

        // Envío del token por correo electrónico y como cookie
        await sendTokenEmail(formData.email, res);
        
        // Establecer la cookie de userID
        res.cookie('userID', formData.id);

        // Enviar una respuesta de éxito
        res.redirect('/Token');

    } catch (error) {
        console.error('Error al procesar los datos en el controlador:', error);
        // Enviar una respuesta de error genérica en caso de cualquier otro error
        res.status(500).json({ success: false, error: 'Ocurrió un error al procesar el formulario' });
    }
};

module.exports = {
    handleFormSubmit
};
