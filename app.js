const express = require('express');
const path = require('path');
const personalController = require('./controllers/personalcontroller'); 
const mainController = require('./controllers/maincontroller');
const logincontroller = require('./controllers/logincontroller');
const paymentController = require('./controllers/paymentcontroller');
const usercontroller = require('./controllers/usercontroller');
const WWUcontroller = require('./controllers/WokwithUscontroller');
const InBodycontroller = require('./controllers/InBodycontroller');
const Companycontroller = require('./controllers/Companycontroller');
const  tokencontroller= require('./controllers/tokencontroller');
const recovercontroller= require("./controllers/recovercontroller");
const QAcontroller = require("./controllers/QAcontroller");
const verification = require("./controllers/2stepcontroller");
const { handleClases, watchSuscriptions } = require('./controllers/clasescontroller');

const cookieParser = require('cookie-parser');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use((err, req, res, next) => {
    console.error('Error interno en el servidor:', err);
    res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Main.html'));
});
app.get('/Recover', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'RestorePassword.html'));
});
app.get('/Verification', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', '2stepverification.html'));
});
app.get('/QA', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Q&A.html'));
});
app.get('/Token', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Token.html'));
});
app.get('/User', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'User.html'));
});
app.get('/Company', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Company.html'));
});
app.get('/InBody', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'InBody.html'));
});
app.get('/WWU', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'WorkwithUs.html'));
});
app.get('/Clases', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Clases.html'));
});

app.get('/pago', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Pago.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Login.html'));
});
app.get('/Services', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Servicios.html'));
})
app.get('/Personal', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Personal.html'));
});

app.post('/submit-form', async (req, res) => {
    try {
        await mainController.handleFormSubmit(req, res);
    } catch (error) {
        console.error('Error al manejar la solicitud:', error);
        // Enviar una respuesta de error solo si hay un error real en la solicitud
        if (error.response && error.response.status === 400) {
            return res.status(400).json({ error: error.response.data.error });
        } else {
            return res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
        }
    }
});

app.post('/token',tokencontroller.handleToken)

app.post('/Verification',verification.handleSecondStep)

app.post('/QA',QAcontroller.handleQA)

app.post('/Recover',recovercontroller.handleRecover)

app.post('/submit_inbody', InBodycontroller.handleInBodyData);

app.post('/submit-login', logincontroller.handleLogin);

app.post('/contratar', personalController.handleContratar);

app.post('/clases', (req, res) => {
    const action = req.body.action;

    if (action === 'watch') {
        watchSuscriptions(req, res);
    } else {
        handleClases(req, res);
    }
});

app.post('/submit_inbody', InBodycontroller.handleInBodyData);

app.post('/WorkwithUs', WWUcontroller.submitCV);
app.post('/Companycontroller', Companycontroller.handleCompanyForm);

app.post('/submit-payment', (req, res) => {

    const userID = req.cookies.userID;
    paymentController.handlePayment(req, res, userID);
});
app.post('/showUserInfoButton', usercontroller.getUserInfo);
app.get('/getUserInfo', usercontroller.getUserInfo);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Para acceder a la aplicación, visita: http://localhost:${PORT}/`);
});
