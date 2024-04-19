
async function buscarPreguntaRespuestaPorCedula(cedula) {
    try {
        const response = await fetch('http://tu-servidor.com/buscarPreguntaRespuesta', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula
            })
        });

        if (!response.ok) {
            throw new Error('Error al buscar pregunta y respuesta');
        }

        const data = await response.json();
        console.log('Pregunta:', data[0].Pregunta);
        console.log('Respuesta:', data[0].Respuesta);
        console.log('Correo:', data[0].Correo);
    } catch (error) {
        console.error('Error al buscar pregunta y respuesta:', error.message);
    }
}


module.exports = {
    buscarPreguntaRespuestaPorCedula
};
