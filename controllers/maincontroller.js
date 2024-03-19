const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const mainModel = require('../models/mainmodel');
const crypto = require('crypto');


const generateShortToken = (email) => {
    const salt = 'gm';
    const hash = crypto.createHash('sha256');
    hash.update(email + salt);
    const token = hash.digest('base64').substring(0, 10); 
    return token;
};


const sendTokenEmail = async (email, res) => {
    const token = generateShortToken(email);

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
        subject: 'Unique Token to register',
        html: `<p>This is your token,thanks for join us: <strong>${token}</strong></p>`
    };

    await transporter.sendMail(mailOptions);

    res.cookie('token', token, { httpOnly: true, maxAge: 3600000 }); 
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

        await sendTokenEmail(formData.email, res);

        res.cookie('userID', formData.id);
        res.redirect('/Token');

    } catch (error) {
        console.error('Error al procesar los datos en el controlador:', error);
        res.status(500).json({ success: false, error: 'Ocurrió un error al procesar el formulario' });
    }
};
const getProvinces = async (req, res) => {
    try {
        
        const data = await mainModel.getSelectData();
        const provinces = data.provinces;
        res.json({ provinces });
        console.log('Provincias: ', provinces);
    } catch (error) {
        console.error('Error al obtener las provincias:', error);
        res.status(500).json({ success: false, error: 'Ocurrió un error al obtener las provincias' });
    }
};

const getCantones = async (req, res) => {
    try {
        
        const { province } = req.query;

        const data = await mainModel.getSelectData(province);
        const cantones = data.cantones;
        res.json({ cantones });
        console.log('Cantones: ', cantones);
    } catch (error) {
        console.error('Error al obtener los cantones:', error);
        res.status(500).json({ success: false, error: 'Ocurrió un error al obtener los cantones' });
    }
};

const getDistritos = async (req, res) => {
    try {
        const { canton } = req.query;

        const data = await mainModel.getSelectData(canton);
        const distritos = data.distritos;
        res.json({ distritos });
        console.log('Distritos: ', distritos);
    } catch (error) {
        console.error('Error al obtener los distritos:', error);
        res.status(500).json({ success: false, error: 'Ocurrió un error al obtener los distritos' });
    }
};

module.exports = {
    handleFormSubmit,
    getProvinces,
    getCantones,
    getDistritos
};
