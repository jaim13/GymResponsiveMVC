const clasesmodel = require('../models/clasesmodel');

const handleClases = async (req, res) => {
    try {
        const Clases = req.body.Clases;
        const cedula = req.cookies.cedula;
        let idClases;
        
        if (Clases === 'Boxing') {
            idClases = 1;
        } else if (Clases === 'Yoga') {
            idClases = 2;
        } else if (Clases === 'Cardio Dance') {
            idClases = 3;
        } else {
            console.log(`Clases no reconocida: ${Clases}`);
            throw new Error('Clases no reconocida');
        }
        
        console.log("Datos recibidos del formulario:");
        console.log("Clase:", Clases);
        console.log("Cédula:", cedula);
        console.log("ID Personal:", idClases);
        
        await clasesmodel.insertclases(cedula, idClases);

        res.send('<script>alert("Succesfully suscribe"); window.location.href = "/Clases";</script>');

    } catch (error) {
        console.error('Error al manejar la solicitud de contratación:', error);
        res.status(500).send('Ocurrió un error al procesar la solicitud de Clases.');
    }
};
const watchSuscriptions = async (req, res) => {
    try {
        const cedula = req.cookies.cedula;
        const suscriptions = await clasesmodel.WatchClass(cedula);

        console.log('Suscripciones obtenidas:', suscriptions);
        res.status(200).json({ suscriptions: suscriptions });
        
    } catch (error) {
        console.error('Error al ejecutar el método del modelo:', error);
        res.status(500).send('Ocurrió un error al procesar la solicitud.');
    }
};


module.exports = {
    handleClases,
    watchSuscriptions
};
