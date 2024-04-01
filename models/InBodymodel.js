// InBodymodel.js
async function procesarDatosInBody(cedula, data) {
    try {
        const response = await fetch('http://localhost:3020/procesarDatosInBody', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula,
                data: data
            })
        });

        if (!response.ok) {
            throw new Error('Error al enviar los datos de InBody');
        }

        console.log('Datos de InBody enviados correctamente.');
    } catch (error) {
        console.error('Error al enviar los datos de InBody:', error.message);
        throw error;
    }
}

module.exports = {
    procesarDatosInBody
};
