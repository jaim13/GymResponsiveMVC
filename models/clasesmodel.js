
async function insertclases(userID, idClase) {
    try {
        const response = await fetch('http://localhost:3020/insertarClase', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                userID: userID,
                idClase: idClase
            })
        });

        if (!response.ok) {
            throw new Error('Error al insertar la clase');
        }

        const data = await response.json();
        console.log(data.message); // Mensaje de éxito del servidor
    } catch (error) {
        console.error('Error al insertar la clase:', error.message);
    }
}

async function WatchClass(cedula) {
    try {
        const response = await fetch('http://localhost:3020/verClases', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula
            })
        });

        if (!response.ok) {
            throw new Error('Error al obtener las clases');
        }

        const clases = await response.json();
        console.log('Clases encontradas:', clases);
        return clases; // Agregar el retorno de las clases obtenidas
    } catch (error) {
        console.error('Error al obtener las clases:', error.message);
        throw error;
    }
}


module.exports = {
    insertclases,
    WatchClass
};
