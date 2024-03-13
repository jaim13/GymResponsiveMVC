// tokencontroller.js

const handleToken = (req, res) => {
    const tokenIngresado = req.body.token; 
    const tokenCookie = req.cookies.token; 

    // Verificar si el token ingresado coincide con el de la cookie
    if (tokenIngresado === tokenCookie) {
        console.log('Token válido:', tokenIngresado);
        console.log('Token válido');
        res.redirect('/pago')
    } else {
        console.log('Token inválido:', tokenIngresado);
        res.send('<script>alert("Wrong Token!"); window.location.href = "/";</script>');
        return;
    }
};

module.exports = {
    handleToken
};
