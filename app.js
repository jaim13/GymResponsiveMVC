const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');
const favicon = require('serve-favicon');
const cors = require('cors');

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

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

const faviconPath = path.join(__dirname, 'public', 'images', 'faviconicono.png');
app.use(favicon(faviconPath));


app.use((err, req, res, next) => {
    console.error('Error interno en el servidor:', err);
    res.status(500).json({ error: 'Ocurrió un error interno en el servidor' });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Main.html'));
});
app.get('/Recover', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'RestorePassword.html'));
});
app.get('/Verification', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', '2stepverification.html'));
});
app.get('/QA', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Q&A.html'));
});
app.get('/Token', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Token.html'));
});
app.get('/User', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'User.html'));
});
app.get('/Company', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Company.html'));
});
app.get('/InBody', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'InBody.html'));
});
app.get('/WWU', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'WorkwithUs.html'));
});
app.get('/Clases', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Clases.html'));
});

app.get('/pago', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Pago.html'));
});

app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Login.html'));
});
app.get('/Services', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Servicios.html'));
})
app.get('/Personal', (req, res) => {
    res.sendFile(path.join(__dirname, 'Views', 'Personal.html'));
});

const data = JSON.parse(fs.readFileSync('provincias_cantones_distritos_costa_rica.json', 'utf8'));

app.get('/provincias', async (req, res) => {
    try {
        const provincias = Object.values(data.provincias).map(provincia => ({ nombre: provincia.nombre }));
        console.log(provincias);
        res.json(provincias);
    } catch (error) {
        console.error('Error al obtener las provincias:', error);
        res.status(500).json({ success: false, error: 'Ocurrió un error al obtener las provincias' });
    }
});
function obtenerIdProvincia(nombreProvincia) {
    const mapeoProvincias = {
        'San José': 1,
        'Alajuela': 2,
        'Cartago': 3,
        'Heredia': 4,
        'Guanacaste': 5,
        'Puntarenas': 6,
        'Limón': 7
    };
    return mapeoProvincias[nombreProvincia];
}
app.get('/cantones/:provinciaId', async (req, res) => {
    try {
        const provinciaNombre = req.params.provinciaId;
        const provinciaId = obtenerIdProvincia(provinciaNombre);
        console.log('Provincia ID:', provinciaId);
        if (data.provincias.hasOwnProperty(provinciaId)) {
            const cantones = Object.values(data.provincias[provinciaId].cantones);
            res.json(cantones);
        } else {
            res.status(404).json({ success: false, error: 'La provincia especificada no existe' });
        }
    } catch (error) {
        console.error('Error al obtener los cantones:', error);
        res.status(500).json({ success: false, error: 'Ocurrió un error al obtener los cantones' });
    }
});
function obtenerIdCanton(idProvincia, nombreCanton) {
    const cantones = {
        1: {
            "Central": 1,
            "Escazú": 2,
            "Desamparados": 3,
            "Puriscal": 4,
            "Tarrazú": 5,
            "Aserrí": 6,
            "Mora": 7,
            "Goicoechea": 8,
            "Santa Ana": 9,
            "Alajuelita": 10,
            "Vázquez De Coronado": 11,
            "Acosta": 12,
            "Tibás": 13,
            "Moravia": 14,
            "Montes De Oca": 15,
            "Turrubares": 16,
            "Dota": 17,
            "Curridabat": 18,
            "Pérez Zeledón": 19,
            "León Cortés Castro": 20
        },
        2: {
            "Central": 1,
            "San Ramón": 2,
            "Grecia": 3,
            "San Mateo": 4,
            "Atenas": 5,
            "Naranjo": 6,
            "Palmares": 7,
            "Poás": 8,
            "Orotina": 9,
            "San Carlos": 10,
            "Zarcero": 11,
            "Sarchí": 12,
            "Upala": 13,
            "Los Chiles": 14,
            "Guatuso": 15,
            "Río Cuarto": 16
        },
        3: {
            "Central": 1,
            "Paraíso": 2,
            "La Unión": 3,
            "Jiménez": 4,
            "Turrialba": 5,
            "Alvarado": 6,
            "Oreamuno": 7,
            "El Guarco": 8
        },
        4: {
            "Central": 1,
            "Barva": 2,
            "Santo Domingo": 3,
            "Santa Barbara": 4,
            "San Rafael": 5,
            "San Isidro": 6,
            "Belén": 7,
            "Flores": 8,
            "San Pablo": 9,
            "Sarapiquí": 10
        },
        5: {
            "Liberia": 1,
            "Nicoya": 2,
            "Santa Cruz": 3,
            "Bagaces": 4,
            "Carrillo": 5,
            "Cañas": 6,
            "Abangares": 7,
            "Tilarán": 8,
            "Nandayure": 9,
            "La Cruz": 10,
            "Hojancha": 11
        },
        6: {
            "Central": 1,
            "Esparza": 2,
            "Buenos Aires": 3,
            "Montes De Oro": 4,
            "Osa": 5,
            "Quepos": 6,
            "Golfito": 7,
            "Coto Brus": 8,
            "Parrita": 9,
            "Corredores": 10,
            "Garabito": 11
        }
    };
    const canton = cantones[idProvincia];
    if (canton) {
        const idCanton = ('0' + canton[nombreCanton]).slice(-2);
        console.log('ID del cantón:', idCanton);
        return idCanton !== undefined ? idCanton : null;
    } else {
        console.log('La provincia no tiene cantones definidos.');
        return null;
    }
}
app.get('/distritos/:provincia/:canton', async (req, res) => {
    try {
        const nombreProvincia = req.params.provincia;
        console.log('Nombre de la provincia:', nombreProvincia);

        const idProvincia = obtenerIdProvincia(nombreProvincia);
        console.log('ID de la provincia:', idProvincia);

        const nombreCanton = req.params.canton;
        console.log('Nombre del cantón:', nombreCanton);

        const idCanton = obtenerIdCanton(idProvincia, nombreCanton);
        console.log('ID del cantón:', idCanton);
        const provincias = data.provincias;
        if (provincias.hasOwnProperty(idProvincia)) {
            console.log('Provincia encontrada en el JSON');
            const provincia = provincias[idProvincia];
            const cantones = provincia.cantones;
            if (cantones.hasOwnProperty(idCanton)) {
                console.log('Cantón encontrado en el JSON');
                const distritos = Object.values(cantones[idCanton].distritos);
                console.log('Distritos encontrados:', distritos);
                res.json(distritos);
            } else {
                console.log('Cantón no encontrado en el JSON');
                res.status(404).json({ success: false, error: 'El cantón especificado no existe' });
            }
        } else {
            console.log('Provincia no encontrada en el JSON');
            res.status(404).json({ success: false, error: 'La provincia especificada no existe' });
        }
    } catch (error) {
        console.error('Error al obtener los distritos:', error);
        res.status(500).json({ success: false, error: 'Ocurrió un error al obtener los distritos' });
    }
});


app.post('/submit-form', async (req, res) => {
    try {
        await mainController.handleFormSubmit(req, res);
    } catch (error) {
        console.error('Error al manejar la solicitud:', error);
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

app.post('/submit-payment', async (req, res) => {
    try {
        const userID = req.cookies.userID;
        await paymentController.handlePayment(req, res, userID);
    } catch (error) {
        console.error('Error al procesar el pago:', error);
        res.status(500).send('Ocurrió un error al procesar el pago.');
    }
});

app.get('/obtener-tipo-cambio', async (req, res) => {
    try {
        const tipoDeCambio = await paymentController.obtenerTipoDeCambio();
        console.log('Tipo de cambio de compra en el server: ',  tipoDeCambio);
        res.json({ tipoDeCambio });
    } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error);
        res.status(500).send('Ocurrió un error al obtener el tipo de cambio.');
    }
});
app.get('/obtener-tipo-cambio-Venta', async (req, res) => {
    try {
        const tipoDeCambio = await paymentController.obtenerTipoDeCambioVenta();
        console.log('Tipo de cambio de venta en el server: ',  tipoDeCambio);
        res.json({ tipoDeCambio });
    } catch (error) {
        console.error('Error al obtener el tipo de cambio:', error);
        res.status(500).send('Ocurrió un error al obtener el tipo de cambio.');
    }
});

app.post('/showUserInfoButton', usercontroller.getUserInfo);
app.get('/getUserInfo', usercontroller.getUserInfo);


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
    console.log(`Para acceder a la aplicación, visita: http://localhost:${PORT}/`);
});
