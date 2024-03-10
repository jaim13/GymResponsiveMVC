// tokencontroller.js

const handleToken = (req, res) => {
    const tokenIngresado = req.body.token; // Obtener el token ingresado en el cuerpo de la solicitud
    const tokenCookie = req.cookies.token; // Obtener el token almacenado en la cookie

    // Verificar si el token ingresado coincide con el de la cookie
    if (tokenIngresado === tokenCookie) {
        console.log('Token válido:', tokenIngresado);
        console.log('Token válido');
        res.redirect('/pago')
    } else {
        console.log('Token inválido:', tokenIngresado);
        res.status(400).send('Token inválido');
    }
};

module.exports = {
    handleToken
};
