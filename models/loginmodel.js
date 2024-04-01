
async function verificarCredenciales(cedula, password) {
    try {
        const response = await fetch('http://localhost:3020/verificarCredenciales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cedula, password })
        });

        const data = await response.json();
        console.log('Recibido de la API: ',data)
        return data.resultado;
    } catch (error) {
        console.error('Error al verificar las credenciales:', error);
        throw error;
    }
}

async function actualizarActividadUsuario(cedula, actividad) {
    try {
        const response = await fetch('http://localhost:3020/actualizarActividadUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cedula, actividad })
        });

        const data = await response.json();
        return data.message; // Suponiendo que la API envía un mensaje de confirmación
    } catch (error) {
        console.error('Error al actualizar la actividad del usuario:', error);
        throw error;
    }
}

async function insertarRegistroLog(cedula, actividad) {
    try {
        const response = await fetch('http://localhost:3020/insertarRegistroLog', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cedula, actividad })
        });

        if (!response.ok) {
            throw new Error('Error al insertar el registro de log');
        }

        console.log('Registro de log insertado correctamente.');
    } catch (error) {
        console.error('Error al insertar el registro de log:', error);
        throw error;
    }
}

async function buscarActividadPorCedula(cedula) {
    try {
        const response = await fetch('http://localhost:3020/buscarActividadPorCedula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cedula })
        });

        if (!response.ok) {
            throw new Error('Error al buscar la actividad por cédula');
        }

        const data = await response.json();
        return data.actividad; // Devuelve la actividad encontrada
    } catch (error) {
        console.error('Error al buscar la actividad por cédula:', error);
        throw error;
    }
}

async function buscarCorreoPorCedula(cedula) {
    try {
        const response = await fetch('http://localhost:3020/buscarCorreoPorCedula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cedula })
        });

        if (!response.ok) {
            throw new Error('Error al buscar el correo por cédula');
        }

        const data = await response.json();
        return data.correo; // Devuelve el correo encontrado
    } catch (error) {
        console.error('Error al buscar el correo por cédula:', error);
        throw error;
    }
}



module.exports = {
    verificarCredenciales,
    actualizarActividadUsuario,
    insertarRegistroLog,
    buscarActividadPorCedula,
    buscarCorreoPorCedula
};