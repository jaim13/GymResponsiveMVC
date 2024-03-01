// InBodycontroller.js

const InBodyModel = require('../models/InBodymodel');

const handleInBodyData = async (req, res) => {
    try {
        const cedula = req.cookies.cedula;

        const { total_weight, muscle_mass, body_fat_percentage, muscle_mass_percentage, total_body_water, bmi, visceral_fat_level } = req.body;
        
        await InBodyModel.procesarDatosInBody(cedula, {
            total_weight,
            muscle_mass,
            body_fat_percentage,
            muscle_mass_percentage,
            total_body_water,
            bmi,
            visceral_fat_level
        });

        res.send('<script>alert("Succesfully send"); window.location.href = "/Services";</script>');
    } catch (error) {
        console.error('Error al procesar los datos de InBody:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    handleInBodyData
};
