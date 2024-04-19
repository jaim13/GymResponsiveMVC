
async function buscarPreguntaRespuestaPorCedula(cedula) {
    try {
        const response = await fetch('https://api-costaricafitness.onrender.com/buscarPreguntaRespuesta', {
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
        console.log('Pregunta en recover model:', data[0].Pregunta);
        console.log('Respuesta en recover model:', data[0].Respuesta);
        console.log('Correo en recover model:', data[0].Correo);
        return data;
    } catch (error) {
        console.error('Error al buscar pregunta y respuesta:', error.message);
    }
}


module.exports = {
    buscarPreguntaRespuestaPorCedula
};
