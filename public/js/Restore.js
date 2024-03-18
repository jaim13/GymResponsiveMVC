document.addEventListener("DOMContentLoaded", function() {
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
});