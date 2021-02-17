function myValidator() {
    'use strict';
    window.addEventListener('load', function () {
        const forms = document.getElementsByClassName('needs-validation');
        const validation = Array.prototype.filter.call(forms, function (form) {
            form.addEventListener('submit', function (event) {
                if (form.checkValidity() === false) {
                    event.preventDefault();
                    event.stopPropagation();
                }
                form.classList.add('was-validated');
            }, false);
        });
    }, false);
}
myValidator();

function getURL_Encoded(object) {
    const elements = [];
    for (let property in object) {
        elements.push(encodeURIComponent(property) + "=" + encodeURIComponent(object[property]));
    }
    return elements.join("&");
}

function redirectToPanel(role) {
    if (role === 'admin') {
        window.location.href = "/admin";
    } else {
        console.log("std");
    }
}