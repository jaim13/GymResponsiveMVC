async function obtenerInformacionUsuario(cedula) {
    try {
        const response = await fetch('http://localhost:3020/obtenerInformacionUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                cedula: cedula
            })
        });

        if (!response.ok) {
            throw new Error('Error al obtener información del usuario');
        }

        const data = await response.json();
        console.log('Información del usuario:', data.informacionUsuario);
        return data.informacionUsuario;
    } catch (error) {
        console.error('Error al obtener información del usuario:', error.message);
        return null;
    }
}
module.exports = {
    obtenerInformacionUsuario
};
