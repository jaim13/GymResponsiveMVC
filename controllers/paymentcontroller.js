const paymentModel = require('../models/paymentmodel');

const obtenerTipoDeCambio = async () => {
    try {
        // Obtener el tipo de cambio desde el modelo
        const tipoDeCambio = await paymentModel.obtenerTipoDeCambio();
        console.log('Tipo de cambio de compra sacado del controller: ',  tipoDeCambio);
        return tipoDeCambio;
    } catch (error) {
        console.error('Error al obtener el tipo de cambio en el controlador:', error);
        throw error;
    }
};
const obtenerTipoDeCambioVenta = async () => {
    try {
        // Obtener el tipo de cambio desde el modelo
        const tipoDeCambio = await paymentModel.obtenerTipoDeCambioVenta();
        console.log('Tipo de cambio de venta sacado del controller: ',  tipoDeCambio);
        return tipoDeCambio;
    } catch (error) {
        console.error('Error al obtener el tipo de cambio en el controlador:', error);
        throw error;
    }
};
// Función para manejar el pago
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
        
        // Redirigir al usuario a /login después de procesar el pago
        res.redirect('/login');
        
    } catch (error) {
        console.error('Error al procesar el pago en el controlador:', error);
        res.status(500).send('Ocurrió un error al procesar el pago.');
    }
};

module.exports = {
    obtenerTipoDeCambio,
    handlePayment,
    obtenerTipoDeCambioVenta
};
