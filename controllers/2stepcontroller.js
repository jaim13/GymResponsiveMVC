// 2stepController.js

const handleSecondStep = (req, res) => {
    try {
        const tokenRecibido = req.cookies.token;
        const tokenIngresado = req.body.token; // Suponiendo que el token ingresado se envía en el cuerpo de la solicitud
        if (tokenRecibido === tokenIngresado) {
            console.log('Token recibido:', tokenRecibido);
            res.redirect('/Services')
        } else {
            res.redirect('/login')
        }
    } catch (error) {
        console.error('Error en el segundo paso:', error);
        res.status(500).send('Ocurrió un error en el segundo paso.');
    }
};

module.exports = {
    handleSecondStep
};
