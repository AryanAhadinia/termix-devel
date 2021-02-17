function setEmail() {
    $('#email').attr('disabled', 'disabled');
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            if (this.status == 200) {
                $('#email').val(JSON.parse(this.responseText).email);
            } else {
                $('#change-form').addClass('d-none');
                $('#access-denied-alert').removeClass('d-none');
            }
        }
    }
    req.open("GET", '/api/user/my_account');
    req.send();
}
setEmail();

function alert(type, message) {
    $('#alert-placeholder').html(`
        <div id="alr" class="alert alert-${type} alert fade show" role="alert">
            ${message}
        </div>
    `);
}

document.getElementById("change").onclick = function () {
    const parameters = {
        "password": document.getElementById("password").value
    }
    if (parameters.password == "") {
        return;
    }
    $('#alr').alert('close');
    const params = getURL_Encoded(parameters);
    const req = new XMLHttpRequest();
    const url = '/api/account/change_password';
    req.onreadystatechange = function () {
        if (this.readyState == 1) {
            $('#change').html('<span class="spinner-border spinner-border-sm" style="width: 1rem; height: 1rem;" id="spinner" role="status" aria-hidden="true"></span>');
            $('#change').attr('disabled', 'disabled');
        } else if (this.readyState == 4) {
            $('#change').html('دگرش گذرواژه');
            $('#change').removeAttr('disabled');
            if (this.status == 200) {
                window.location.href = '/index'
            } else if (this.status == 400) {
                alert('danger', JSON.parse(this.responseText).msg);
            } else if (this.status == 403) {
                alert('danger', 'دسترسی لازم برای انجام اینکار را ندارید.');
            } else if (this.status == 500) {
                alert('warning', 'سرور اختلالاتی را تجربه می کند. چند دقیقه دیگر تلاش کنید')
            } else {
                alert('danger', JSON.parse(this.responseText).msg);
            }
        }
    }
    req.open('POST', '/api/user/change_password');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send(params);
}

