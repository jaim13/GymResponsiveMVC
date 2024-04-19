
const contratarEntrenador = async (cedula, idPersonal) => {
    try {
        const response = await fetch('https://api-costaricafitness.onrender.com/contratarEntrenador', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula,
                idPersonal: idPersonal
            })
        });

        if (!response.ok) {
            throw new Error('Error al contratar entrenador');
        }

        console.log('Entrenador contratado correctamente.');
    } catch (error) {
        console.error('Error al contratar entrenador:', error.message);
    }
};

module.exports = {
    contratarEntrenador
};
