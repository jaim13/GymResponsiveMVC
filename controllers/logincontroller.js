const loginModel = require('../models/loginmodel');
const Swal = require('sweetalert2');

const handleLogin = async (req, res) => {
    try {
        const { cedula, password } = req.body;
        const resultadoVerificacion = await loginModel.verificarCredenciales(cedula, password);

        if (resultadoVerificacion === 'Éxito') {
            res.cookie('cedula', cedula);
            res.redirect('/Services');
        } else {
            res.redirect('/login');
        }
    } catch (error) {
        console.error('Error al manejar la solicitud de inicio de sesión:', error);
        res.status(500).send('Ocurrió un error al procesar la solicitud de inicio de sesión.');
    }
};

module.exports = {
    handleLogin
};
