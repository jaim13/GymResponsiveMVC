const sql = require('mssql');
const axios = require('axios');



async function insertarUsuario(nombre, password, correo, telefono, edad, fechaRegistro, idUsuario, idMembresia, idEmpresa, question, answer) {
    try {
        const response = await fetch('http://localhost:3020/insertarUsuario', {
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
