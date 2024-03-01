const personalModel = require('../models/personalmodel');

const handleContratar = (req, res) => {
    try {
        const trainer = req.body.trainer;
        const cedula = req.cookies.cedula;
        let idPersonal;
        
        if (trainer === 'Roberth Watson') {
            idPersonal = 1;
        } else if (trainer === 'David Coleman') {
            idPersonal = 2;
        } else if (trainer === 'Jair Lopez') {
            idPersonal = 3;
        } else {
            console.log(`Entrenador no reconocido: ${trainer}`);
            return res.status(400).send('El entrenador seleccionado no es reconocido.');
        }
        
        console.log("Datos recibidos del formulario:");
        console.log("Entrenador:", trainer);
        console.log("Cédula:", cedula);
        console.log("ID Personal:", idPersonal);

        personalModel.contratarEntrenador(cedula, idPersonal);

        res.status(200).json({ message: 'Contratación exitosa' });

    } catch (error) {
        console.error('Error al manejar la solicitud de contratación:', error);
        res.status(500).send('Ocurrió un error al procesar la solicitud de contratación.');
    }
};

module.exports = {
    handleContratar
};
