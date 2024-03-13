document.addEventListener("DOMContentLoaded", function() {
    console.log("El evento DOMContentLoaded se ha disparado.");
    const form = document.getElementById('joinForm');
    if (form) {
        form.addEventListener('submit', function(event) {
            event.preventDefault(); // Evitar que se envíe el formulario automáticamente

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
