const paymentModel = require('../models/paymentmodel');

const handlePayment = async (req, res, userID) => {
    try {
        let monto = req.body.monto; 

        if (req.body.metodoPago === 'tarjeta') {
            monto = 3000;
        }

        const paymentData = {
            idUsuario: userID,
            fechaPago: new Date(),
            monto: monto,
            metodoPago: req.body.metodoPago
        };

        const result = await paymentModel.processPayment(paymentData, userID);

        console.log(result.message);

        res.redirect('/login');
    } catch (error) {
        console.error('Error al procesar el pago en el controlador:', error);
        res.status(500).send('Ocurrió un error al procesar el pago.');
    }
};

module.exports = {
    handlePayment
};
