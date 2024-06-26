const sql = require('mssql');
const axios = require('axios');



async function insertarUsuario(nombre, password, correo, telefono, edad, fechaRegistro, idUsuario, idMembresia, idEmpresa, question, answer) {
    try {
        const response = await fetch('https://api-costaricafitness.onrender.com/insertarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre,
                password,
                correo,
                telefono,
                edad,
                fechaRegistro,
                idUsuario,
                idMembresia,
                idEmpresa,
                question,
                answer
            })
        });

        const data = await response.json();
        console.log('Respuesta del servidor:', data);
    } catch (error) {
        console.error('Error al insertar usuario:', error);
    }
}

async function buscarRegistroPorCedula(cedula) {
    try {
        const response = await fetch('https://api-costaricafitness.onrender.com/api/buscar-cedula', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ cedula: cedula })
        });

        if (!response.ok) {
            throw new Error('Error al buscar el registro por cédula');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error al buscar el registro por cédula:', error);
        throw error;
    }
}

async function processFormData(formData) {
    try {
        console.log('Datos recibidos en el modelo:', formData);
        await insertarUsuario(formData.fullName,formData.password, formData.email, formData.phone, formData.age, formData.fechaRegistro, formData.id, formData.membershipId, formData.company,formData.question,formData.answer);
        console.log('Procesamiento de datos completado en el modelo.');

    } catch (error) {
        console.error('Error al procesar los datos en el modelo:', error);
        throw error;
    }
}

module.exports = {
    processFormData,
};
