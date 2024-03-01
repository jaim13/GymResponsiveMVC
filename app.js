const express = require('express');
const path = require('path');
const personalController = require('./controllers/personalcontroller'); 
const mainController = require('./controllers/mainController');
const logincontroller = require('./controllers/logincontroller');
const paymentController = require('./controllers/paymentcontroller');
const usercontroller = require('./controllers/usercontroller');
const WWUcontroller = require('./controllers/WokwithUscontroller');
const InBodycontroller = require('./controllers/InBodycontroller');
const Companycontroller = require('./controllers/Companycontroller');
const { handleClases, watchSuscriptions } = require('./controllers/clasescontroller');

const cookieParser = require('cookie-parser');
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'Main.html'));
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

app.post('/submit-form', mainController.handleFormSubmit);

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
Companycontroller
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
