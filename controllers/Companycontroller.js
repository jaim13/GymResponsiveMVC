// CompanyController.js

const Empresa = require('../models/Companymodel');

const handleCompanyForm = async (req, res) => {
    try {
        const { nombre, direccion, correo, telefono, contacto, tipo, membresia } = req.body;
        let idmember = 0;
        if (membresia === 'Mid Tier') {
            idmember = 2;
        } else {
            idmember = 1;
        }
        await Empresa.procesarDatosEmpresa(nombre, direccion, correo, telefono, contacto, tipo, membresia, idmember);
        res.send('<script>alert("Succesfully send"); window.location.href = "/";</script>');
    } catch (error) {
        console.error('Error al procesar el formulario de empresa:', error);
        res.status(500).json({ success: false, error: error.message });
    }
};
module.exports = {
    handleCompanyForm
};
