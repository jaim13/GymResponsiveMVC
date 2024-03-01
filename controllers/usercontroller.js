const userModel = require('../models/usermodel');

const getUserInfo = async (req, res) => {
    try {

        const cedula = req.cookies.cedula;
        const userInfo = await userModel.obtenerInformacionUsuario(cedula);

        if (userInfo) {
            console.log('Fecha de Registro del Usuario:', userInfo.FechaRegistro); 

            const NextfechaRegistro = new Date(userInfo.FechaRegistro);
            NextfechaRegistro.setMonth(NextfechaRegistro.getMonth() + 1);
            console.log('Fecha de Registro del Usuario más un mes:', NextfechaRegistro); 

            let idMembresia = '';

            if (userInfo.idMembresia === 1) {
                idMembresia = 'You and up to five guests will have access to all of our equipment and a staff member will create a personalized routine for you. Price:35.000';
            } else {
                if (userInfo.idMembresia === 2) {
                    idMembresia = 'You will have access to the all equipment in our establishment, and you can also have 2 guests per month.Price:25.000';
                }
            }

            res.status(200).json({ 
                nombre: userInfo.Nombre, 
                idMembresia: idMembresia, 
                FechaRegistro: userInfo.FechaRegistro, 
                NextfechaRegistro: NextfechaRegistro 
            });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error getting user info:', error);
        res.status(500).send('An error occurred while processing the request');
    }
};

module.exports = {
    getUserInfo
};
