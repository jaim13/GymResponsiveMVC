const mainModel = require('../models/mainModel');

const handleFormSubmit = async (req, res) => {
    try {
        const fechaRegistro = new Date();

        const formData = {
            id: req.body.id,
            password: req.body.Password,
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
        
        res.cookie('userID', formData.id);
        res.redirect('/pago');

    } catch (error) {
        console.error('Error al procesar los datos en el controlador:', error);
        res.status(500).send('Ocurrió un error al procesar el formulario.');
    }
};

module.exports = {
    handleFormSubmit
};
