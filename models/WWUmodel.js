async function insertCV(nombre, cedula, telefono, correo) {
    try {
        const response = await fetch('http://localhost:3020/insertarCV', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nombre: nombre,
                cedula: cedula,
                telefono: telefono,
                correo: correo
            })
        });

        if (!response.ok) {
            throw new Error('Error al insertar el currículum');
        }

        const data = await response.json();
        console.log('Mensaje del servidor:', data.mensaje);
    } catch (error) {
        console.error('Error al insertar el currículum:', error.message);
    }
}

module.exports = {
    insertCV
};
