const loginModel = require('../models/loginmodel');

const handleLogin = async (req, res) => {
    try {
        const { cedula, password } = req.body;
        let intentosFallidos = req.cookies.intentosFallidos || 0; // Obtener el contador de intentos fallidos de la cookie o inicializarlo en 0
        let actividad;
        const resultadoVerificacion = await loginModel.verificarCredenciales(cedula, password);
        const actividadBD = await loginModel.buscarActividadPorCedula(cedula);

        if (actividadBD === 'Inactivo') {
            // Si la actividad del usuario está marcada como "Inactivo", redirigir a una página de error o mostrar un mensaje de error apropiado.
            res.redirect('/Recover')
            return res.status(403).send('La actividad de su cuenta está inactiva. Por favor, contacte al administrador.');
        }

        if (resultadoVerificacion === 'Éxito') {
            res.cookie('cedula', cedula);
            // Si el inicio de sesión es exitoso, restablece el contador de intentos fallidos a 0
            res.cookie('intentosFallidos', 0, { maxAge: 0 });
            actividad = 'SuccesfullLog';
            await loginModel.insertarRegistroLog(cedula, actividad);
            res.redirect('/Services');
        } else {
            intentosFallidos++; // Incrementar el contador de intentos fallidos
            actividad = 'FailLog';
            res.cookie('intentosFallidos', intentosFallidos, { maxAge: 900000 }); // Almacenar el contador en la cookie con una duración de 15 minutos (900000 milisegundos)
            await loginModel.insertarRegistroLog(cedula, actividad);
            if (intentosFallidos >= 3) { // Si se excede el límite de intentos fallidos
                const inactivo = "Inactivo";
                actividad = 'BlockedLog';
                await loginModel.insertarRegistroLog(cedula, actividad);
                await loginModel.actualizarActividadUsuario(cedula, inactivo);
            }
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

