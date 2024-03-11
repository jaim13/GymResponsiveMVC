const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mainModel = require('../models/mainModel');
const crypto = require('crypto');


const generateShortToken = (email) => {
    const salt = 'gm';
    const hash = crypto.createHash('sha256');
    hash.update(email + salt); // Agrega el salt al correo electrónico antes de generar el hash
    const token = hash.digest('base64').substring(0, 10); // Tomar los primeros 10 caracteres del hash codificado en Base64
    return token;
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
        html: `<p>Aquí está su token único para el registro: <strong>${token}</strong></p>`
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
            question: req.body.securityQuestion,
            answer: req.body.securityAnswer,
            fechaRegistro: fechaRegistro 
        };

        formData.company = req.body.company === "" ? 1 : req.body.company;

        var pregunta;
        if (formData.question === '1')
            pregunta = "What is the name of your first pet?";
        else if (formData.question === '2') {
            pregunta = "What city were you born in?";
        } else if (formData.question === '3') {
            pregunta = "What is your favorite book?";
        } else {
            pregunta = "Unknown question";
        }


        let membershipId;
        if (req.body.membership === 'topTier') {
            membershipId = 1;
        } else if (req.body.membership === 'midTier') {
            membershipId = 2;
        } else {
            membershipId = null;
        }

        formData.membershipId = membershipId;
        formData.question = pregunta;
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
