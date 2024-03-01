//WokwithUscontroller
const cvModel = require('../models/WWUmodel');

const submitCV = async (req, res) => {
    try {
        const { nombre, cedula, telefono, correo } = req.body;
        console.log("Datos recibidos en el controlador:", { nombre, cedula, telefono, correo }); 
        await cvModel.insertCV(nombre, cedula, telefono, correo);
        
        res.send('<script>alert("Thanks for choosen us!"); window.location.href = "/Services";</script>');
    } catch (error) {
        console.error('Error al registrar CV:', error);
        res.status(500).json({ success: false });
    }
};

module.exports = {
    submitCV
};
