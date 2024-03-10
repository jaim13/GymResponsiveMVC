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

        // Validar la contraseña
        const passwordError = validatePassword(password);
        if (passwordError) {
            showError(passwordError);
            return;
        }

        // Confirmar la contraseña
        if (password !== confirmPassword) {
            showError('Las contraseñas no coinciden.');
            return;
        }

        // Si todas las validaciones pasan, enviar el formulario
        form.submit();
    });

    const validatePassword = (password) => {
        if (!password || password.length < 8) {
            return 'La contraseña debe tener al menos 8 caracteres.';
        }
        if (!/[a-z]/.test(password)) {
            return 'La contraseña debe contener al menos una letra minúscula.';
        }
        if (!/[A-Z]/.test(password)) {
            return 'La contraseña debe contener al menos una letra mayúscula.';
        }
        if (!/\d/.test(password)) {
            return 'La contraseña debe contener al menos un número.';
        }
        if (!/[$&+,:;=?@#|'<>.^*()%!-]/.test(password)) {
            return 'La contraseña debe contener al menos un carácter especial.';
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
