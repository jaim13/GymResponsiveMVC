document.addEventListener("DOMContentLoaded", function() {
    console.log("El evento DOMContentLoaded se ha disparado.");
    document.getElementById("provincia").addEventListener("change", async function() {
        try {
            const selectedProvince = this.value;
            console.log("Provincia seleccionada:", selectedProvince);

            const response = await fetch(`/cantones/${selectedProvince}`);
            console.log("Respuesta de getCantones:", response); // Verifica si la respuesta está llegando correctamente

            const responseData = await response.json();
            console.log("Datos de getCantones:", responseData); // Verifica si los datos devueltos son correctos

            const cantonesSelect = document.getElementById("canton");
            cantonesSelect.innerHTML = ""; 
            responseData.forEach(canton => {
                const option = document.createElement("option");
                option.value = canton;
                option.textContent = canton;
                cantonesSelect.appendChild(option);
            });

            cantonesSelect.style.display = "block";
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al obtener los cantones.'
            });
        }
    });

    document.getElementById("canton").addEventListener("change", async function() {
        try {
            const selectedCanton = this.value;
            console.log("Cantón seleccionado:", selectedCanton);

            const selectedProvince = document.getElementById("provincia").value;
            const response = await fetch(`/distritos/${selectedProvince}/${selectedCanton}`);
            console.log("Respuesta de getDistritos:", response); // Verifica si la respuesta está llegando correctamente

            const responseData = await response.json();
            console.log("Datos de getDistritos:", responseData); // Verifica si los datos devueltos son correctos

            const distritosSelect = document.getElementById("distrito");
            distritosSelect.innerHTML = "";
            responseData.forEach(distrito => {
                const option = document.createElement("option");
                option.value = distrito;
                option.textContent = distrito;
                distritosSelect.appendChild(option);
            });

            distritosSelect.style.display = "block";
        } catch (error) {
            console.error('Error:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Ocurrió un error al obtener los distritos.'
            });
        }
    });
    const form = document.getElementById('joinForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            const age = parseInt(document.getElementById('age').value);
            const passwordError = validatePassword(password);
            if (passwordError) {
                showError(passwordError);
                return;
            }

            if (password !== confirmPassword) {
                showError('Confirm password doesn´t match.');
                return;
            }
            form.submit();
        });

        const validatePassword = (password) => {
            if (!password || password.length < 8) {
                return 'The password must be at least 8 characters long.';
            }
            if (!/[a-z]/.test(password)) {
                return 'The password must contain at least one lowercase letter.';
            }
            if (!/[A-Z]/.test(password)) {
                return 'The password must contain at least one uppercase letter.';
            }
            if (!/\d/.test(password)) {
                return 'The password must contain at least one number.';
            }
            if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
                return 'The password must contain at least one special character.';
            }
            return '';
        };

        const showError = (errorMessage) => {
            const passwordErrorElement = document.getElementById('passwordError');
            if (passwordErrorElement) {
                passwordErrorElement.textContent = errorMessage;
            } else {
                console.error("No se encontró el elemento 'passwordError' en el HTML.");
            }
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: errorMessage
            });
        };
    } else {
        console.error("El elemento con ID 'joinForm' no fue encontrado en el HTML.");
    }

    const passwordIcon = document.querySelector('#passwordIcon i');

    passwordIcon.addEventListener('click', function() {
        const passwordHelp = document.getElementById('passwordHelp');
        passwordHelp.innerHTML = `
            <p>The password must meet the following criteria:</p>
            <ul>
                <li>At least 8 characters long</li>
                <li>Contain at least one lowercase letter</li>
                <li>Contain at least one uppercase letter</li>
                <li>Contain at least one number</li>
                <li>Contain at least one special character</li>
            </ul>
        `;
        passwordHelp.style.display = (passwordHelp.style.display === 'block') ? 'none' : 'block';
    });

    var botonTopTier = document.getElementById("btntoptier");
    botonTopTier.addEventListener("click", function() {
        Swal.fire({
            title: 'Top Tier',
            text: 'You and up to five guests will have access to all of our equipment and a staff member will create a personalized routine for you. Price:35.000',
            icon: 'info', 
            confirmButtonText: 'Done' 
        });
    });

    var botonMidTier = document.getElementById("btnmidtier");
    botonMidTier.addEventListener("click", function() {
        Swal.fire({
            title: 'Mid Tier',
            text: 'You will have access to the all equipment in our establishment, and you can also have 2 guests per month.Price:25.000',
            icon: 'info', 
            confirmButtonText: 'Done' 
        });
    });

    var ageSlider = document.getElementById("age");
    var ageValueDisplay = document.getElementById("ageValue");
    ageValueDisplay.textContent = ageSlider.value;
    ageSlider.addEventListener("input", function() {
        ageValueDisplay.textContent = this.value;
    });
});
