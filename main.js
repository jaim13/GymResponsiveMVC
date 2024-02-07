document.addEventListener("DOMContentLoaded", function() {
    var boton = document.getElementById("btntoptier");
    boton.addEventListener("click", function() {
        Swal.fire({
            title: 'Top Tier',
            text: 'You and up to five guests will have access to all of our equipment and a staff member will create a personalized routine for you.',
            icon: 'info', 
            confirmButtonText: 'Done' 
        });
    });
});
document.addEventListener("DOMContentLoaded", function() {
    var boton = document.getElementById("btnmidtier");
    boton.addEventListener("click", function() {
        Swal.fire({
            title: 'Mid Tier',
            text: 'You will have access to the all equipment in our establishment, and you can also have 2 guests per month',
            icon: 'info', 
            confirmButtonText: 'Done' 
        });
    });
});