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

        if (req.body.metodoPago === "transferencia") {
            let numero_cuenta = req.body.numeroCuenta;
            const resultadoAPI = await paymentModel.PagoTransferencia(numero_cuenta,userID);
            if (resultadoAPI) {
                console.log('Cuenta validada y monto restado exitosamente');
            } else {
                res.send('<script>alert("We are sorry, but We had a problem with your payment!"); window.location.href = "/pago";</script>');
                return;
            }
        } else if (req.body.metodoPago === "tarjeta") {
            let numeroTarjeta = req.body.numeroTarjeta;
            let cvv = req.body.codigoSeguridad;
            let Expira = req.body.fechaExpiracion;
            const resultadoAPI = await paymentModel.PagoTarjeta(numeroTarjeta, cvv, Expira, userID);
            if (resultadoAPI) {
                console.log('Tarjeta validada y monto restado exitosamente');
            } else {
                res.send('<script>alert("We are sorry, but We had a problem with your payment!"); window.location.href = "/pago";</script>');
                return;
            }
        }else{
            let Description = req.body.DescriptionPaypal
            let CorreoPaypal = req.body.emailPaypal
            const redirectUrl = await paymentModel.PaymentPaypal(Description, CorreoPaypal, userID);

            res.redirect(redirectUrl);
            return;
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
