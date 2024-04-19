
async function insertarRegistroLog(cedula, actividad) {
    try {
        const response = await fetch('https://api-costaricafitness.onrender.com/insertarRegistroLog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula,
                actividad: actividad
            })
        });

        if (!response.ok) {
            throw new Error('Error al insertar el registro de log');
        }

        const data = await response.json();
        console.log(data.message); // Mensaje de éxito del servidor
    } catch (error) {
        console.error('Error al insertar el registro de log:', error.message);
    }
}
async function UpdatePassword(cedula, newPassword) {
    try {
        const response = await fetch('https://api-costaricafitness.onrender.com/actualizarContrasena', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula,
                newPassword: newPassword
            })
        });

        if (!response.ok) {
            throw new Error('Error al actualizar la contraseña. Código de estado: ' + response.status);
        }

        const data = await response.json();
        console.log(data.message); // Mensaje de éxito del servidor
    } catch (error) {
        console.error('Error al actualizar la contraseña:', error.message);
    }
}




module.exports = {
    UpdatePassword,
    insertarRegistroLog
};
