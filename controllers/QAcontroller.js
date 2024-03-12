//QAcontroller
const QAModel = require('../models/QAmodel');

async function handleQA(req, res) {
    try {
        const recoveryDataCookie = req.cookies.recoveryData;

        if (recoveryDataCookie) {
            const { pregunta, respuesta, token, id } = recoveryDataCookie;
            console.log('Datos de recuperación recibidos:');
            console.log('Pregunta:', pregunta);
            console.log('Respuesta:', respuesta);
            console.log('Token:', token);
            console.log('Cedula:', id);
            const userAnswer = req.body.answer;
            const userToken = req.body.token;
            const newpassword = req.body.newpassword;
            console.log('Datos ingresados por usuario:');
            console.log('Respuesta:', userAnswer);
            console.log('Token:', userToken);
            if (userAnswer.toLowerCase() === respuesta.toLowerCase() && token == userToken) {
                console.log('La respuesta del usuario coincide con la respuesta almacenada.');
                console.log('newpassword: ', newpassword);
                console.log('id: ', id);
                await QAModel.UpdatePassword(id, newpassword);
                res.redirect('/login')
            } else {
                console.log('La respuesta del usuario no coincide con la respuesta almacenada.');
                res.redirect('/QA')
            }
        } else {
            console.log('No se encontraron datos de recuperación en la cookie.');
            // Aquí puedes manejar el caso en el que no se encuentren datos de recuperación en la cookie
        }

        // Aquí puedes continuar con el resto de la lógica del controlador QA
    } catch (error) {
        console.error('Error al manejar la solicitud QA:', error);
        res.status(500).json({ message: 'Ocurrió un error al procesar la solicitud QA.' });
    }
}

module.exports = {
    handleQA
};

