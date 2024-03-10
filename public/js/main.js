
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("showUserInfoButton").addEventListener("click", async function() {
        try {
            const response = await fetch('/getUserInfo');
            const responseData = await response.json();
            if (response.ok) {
                document.getElementById("user-name").textContent = responseData.nombre;
                document.getElementById("membership-level").textContent = responseData.idMembresia;
                document.getElementById("user-name").textContent = responseData.nombre;
                document.getElementById("membership-level").textContent = responseData.idMembresia;
                const firstPaymentDate = new Date(responseData.FechaRegistro);
                const nextPaymentDate = new Date(responseData.NextfechaRegistro);

                document.getElementById("FirstPayment").textContent = firstPaymentDate.toLocaleDateString();
                document.getElementById("NextPayment").textContent = nextPaymentDate.toLocaleDateString();

                document.getElementById("user-info").style.display = "block";
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'An error occurred while retrieving user information.'
                });
            }
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'An error occurred while processing the request.'
            });
        }
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const watchButton = document.getElementById('watchButton');
    const suscriptionsGrid = document.getElementById('suscriptionsGrid');

    watchButton.addEventListener('click', async function (event) {
        event.preventDefault();
        
        try {
            const response = await fetch('/clases', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ action: 'watch' })
            });

            if (!response.ok) {
                throw new Error('Error al obtener las suscripciones');
            }

            const responseData = await response.json();
            const data = responseData.suscriptions;

            console.log('Suscripciones recibidas:', data);

            renderSuscriptions(data);

            suscriptionsGrid.classList.remove('d-none');
        } catch (error) {
            console.error('Error al obtener las suscripciones:', error);
        }
    });

    function renderSuscriptions(data) {
        const suscriptionsGrid = document.getElementById('suscriptionsGrid');
        if (Array.isArray(data) && data.length > 0) {
            suscriptionsGrid.innerHTML = ''; 
            
            const ul = document.createElement('ul');
            data.forEach(suscription => {
                const li = document.createElement('li');
                li.textContent = suscription;
                ul.appendChild(li);
            });
    
            suscriptionsGrid.appendChild(ul); 
        } else {
            console.error('Error: No se encontraron suscripciones.');
        }
    }
    
});


document.addEventListener("DOMContentLoaded", function() {
    var formContratarRoberth = document.getElementById("formContratarRoberth");
    var formContratarDavid = document.getElementById("formContratarDavid");
    var formContratarJair = document.getElementById("formContratarJair");

    formContratarRoberth.addEventListener("submit", function(event) {
        event.preventDefault();
        enviarSolicitud('Roberth Watson');
    });

    formContratarDavid.addEventListener("submit", function(event) {
        event.preventDefault();
        enviarSolicitud('David Coleman');
    });

    formContratarJair.addEventListener("submit", function(event) {
        event.preventDefault();
        enviarSolicitud('Jair Lopez');
    });

    async function enviarSolicitud(trainer) {
        try {
            const response = await fetch('/contratar', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    trainer: trainer
                })
            });

            if (!response.ok) {
                throw new Error('Error al procesar la solicitud');
            }

            const data = await response.json();

            Swal.fire({
                title: 'Contratación exitosa',
                text: data.message,
                icon: 'success',
                confirmButtonText: 'OK'
            });
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error al procesar la solicitud',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
});


