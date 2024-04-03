import pyodbc
from flask import Flask, request, jsonify, redirect, url_for
from flask_sqlalchemy import SQLAlchemy
import paypalrestsdk

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'mssql+pyodbc://JaimDavid:1234@localhost/Banco?driver=ODBC+Driver+17+for+SQL+Server'
db = SQLAlchemy(app)


class Tarjeta(db.Model):
    idTarjeta = db.Column(db.Integer, primary_key=True)
    Numero = db.Column(db.String(100), unique=True, nullable=False)
    Expira = db.Column(db.Date, nullable=False)
    Codigo = db.Column(db.String(10), nullable=False)
    Monto = db.Column(db.Float, nullable=False)

class Cuenta(db.Model):
    idCuenta = db.Column(db.Integer, primary_key=True)
    NumeroCuenta = db.Column(db.String(100), unique=True, nullable=False)
    Monto = db.Column(db.Float, nullable=False)

# Configurar las credenciales de la API de PayPal
paypalrestsdk.configure({
  "mode": "sandbox",  # Modo sandbox para pruebas
  "client_id": "AbPtpDRgqWRbuvFRgp3Pvdt5_ZpiR9s5Re6lXK_exutyOLUopWgzhaD1NUF5Xu-IKjbpvb-8EMUSmjkY",
  "client_secret": "EDn6wx4gqFULIaeiEKdPseH1a5bQmXioHbW0HuLgDhGS6nfmLaTPkQTzL_JA6-b-N3tssJVD68drU4dh" 
})

@app.route('/realizar_pago_paypal', methods=['POST'])
def realizar_pago_paypal():
    data = request.get_json()
    monto = data.get('monto')
    descripcion = data.get('descripcion')
    correo_destinatario = data.get('correo_destinatario')

    # Crear un objeto de pago
    pago = paypalrestsdk.Payment({
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "transactions": [{
            "amount": {
                "total": str(monto),
                "currency": "USD"
            },
            "description": descripcion
        }],
        "redirect_urls": {
            "return_url": "http://localhost:5000/pago_exitoso",
            "cancel_url": "http://localhost:5000/pago_cancelado"
        }
    })

    if pago.create():
        # Si el pago se crea correctamente, redireccionar al usuario a la página de PayPal para completar el pago
        for link in pago.links:
            if link.method == 'REDIRECT':
                return jsonify({'resultado': True, 'redirect_url': link.href}), 200
    else:
        return jsonify({'resultado': False, 'mensaje': pago.error}), 400

@app.route('/pago_exitoso', methods=['GET'])
def pago_exitoso():
    # Aquí puedes manejar la lógica después de que el usuario haya completado el pago exitosamente
    return redirect('http://localhost:3001/login'), 302

@app.route('/pago_cancelado', methods=['GET'])
def pago_cancelado():
    # Aquí puedes manejar la lógica si el usuario cancela el pago
    return redirect('http://localhost:3001/pago'), 302


@app.route('/restar_monto', methods=['POST'])
def restar_monto():
    data = request.get_json()
    numero_cuenta = data.get('numero_cuenta')
    cantidad_a_restar = data.get('cantidad')

    cuenta = Cuenta.query.filter_by(NumeroCuenta=numero_cuenta).first()

    if cuenta is None:
        return jsonify({'resultado': False, 'mensaje': 'La cuenta no existe'}), 404
    
    if cuenta.Monto >= cantidad_a_restar:
        cuenta.Monto -= cantidad_a_restar
        db.session.commit()
        return jsonify({'resultado': True, 'mensaje': 'Monto restado exitosamente'}), 200
    else:
        return jsonify({'resultado': False, 'mensaje': 'La cuenta no tiene suficiente saldo'}), 400
    
@app.route('/validar_tarjeta', methods=['POST'])
def validar_tarjeta():
    data = request.get_json()
    numero_tarjeta = data.get('numero_tarjeta')
    expira = data.get('expira')
    codigo = data.get('codigo')
    monto_a_restar = data.get('monto')

    # Buscar la tarjeta en la base de datos
    tarjeta = Tarjeta.query.filter_by(Numero=numero_tarjeta, Expira=expira, Codigo=codigo).first()

    if tarjeta is None:
        return jsonify({'resultado': False, 'mensaje': 'La tarjeta no existe'}), 404
    
    # Verificar si la tarjeta tiene suficientes fondos
    if tarjeta.Monto >= monto_a_restar:
        # Realizar la resta del monto
        tarjeta.Monto -= monto_a_restar
        db.session.commit()
        return jsonify({'resultado': True, 'mensaje': 'Tarjeta validada y monto restado exitosamente'}), 200
    else:
        return jsonify({'resultado': False, 'mensaje': 'La tarjeta no tiene suficiente saldo'}), 400


if __name__ == '__main__':
    app.run(debug=True)
