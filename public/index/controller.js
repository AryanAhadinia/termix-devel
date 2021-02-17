$(window).resize(setSize);
$(document).ready(setSize);

function setSize() {
    $('#pills-signin').removeClass('show').removeClass('active');
    $('#pills-home').removeClass('show').removeClass('active');
    $('#pills-signup').removeClass('show').removeClass('active');
    $('#pills-signin-tab').removeClass('active');
    $('#pills-home-tab').removeClass('active');
    $('#pills-signup-tab').removeClass('active');
    if ($(window).width() < 1125) {
        $('#right-side').addClass('d-none');
        $('#left-side').removeClass('col-6').addClass('col-12');
        $('#pills-home').removeClass('d-none');
        $('#pills-home-tab').removeClass('d-none');
        $('#pills-home').addClass('show').addClass('active');
        $('#pills-home-tab').addClass('active');
    } else {
        $('#left-side').removeClass('col-12').addClass('col-6');
        $('#right-side').removeClass('d-none');
        $('#pills-home').addClass('d-none');
        $('#pills-home-tab').addClass('d-none');
        $('#pills-signin').addClass('show').addClass('active');
        $('#pills-signin-tab').addClass('active');
    }
}

function alert(placeholder, type, message) {
    $(placeholder).html(`
        <div id="alr" class="alert alert-${type} alert fade show" role="alert">
            ${message}
        </div>
    `);
}

document.getElementById("signin").onclick = function () {
    const parameters = {
        "email": $('#email-signin').val(),
        "password": $('#password-signin').val()
    }
    if (parameters.email == "" || parameters.password == "") {
        return;
    }
    $('#alr').alert('close');
    const params = getURL_Encoded(parameters);
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 1) {
            $('#signin').html('<span class="spinner-border spinner-border-sm" style="width: 1rem; height: 1rem;" id="spinner" role="status" aria-hidden="true"></span>');
            $('#signin').attr('disabled', 'disabled');
        } else if (this.readyState == 4) {
            $('#signin').html('درون‌شد');
            $('#signin').removeAttr('disabled');
            if (this.status == 200) {
                redirectToPanel(this.responseText);
            } else if (this.status == 400) {
                alert('#alert-placeholder-signin', 'danger', JSON.parse(this.responseText).msg || 'درخواست ارسال شده معتبر نیست');
            } else if (this.status == 401) {
                alert('#alert-placeholder-signin', 'danger', 'پارامتر های ورودی را کنترل کنید.');
            } else if (this.status == 500) {
                alert('#alert-placeholder-signin', 'warning', 'سرور اختلالاتی را تجربه می کند. چند دقیقه دیگر تلاش کنید')
            } else {
                alert('#alert-placeholder-signin', 'danger', this.responseText);
            }
        }
    }
    req.open("POST", '/api/user/signin');
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send(params);
}

document.getElementById("signup").onclick = function () {
    const parameters = {
        "email": $('#email-signup').val(),
        "password": $('#password-signup').val()
    }
    if (parameters.email == "" || parameters.password == "") {
        return;
    }
    $('#alr').alert('close');
    const params = getURL_Encoded(parameters);
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 1) {
            $('#signup').html('<span class="spinner-border spinner-border-sm" style="width: 1rem; height: 1rem;" id="spinner" role="status" aria-hidden="true"></span>');
            $('#signup').attr('disabled', 'disabled');
        } else if (this.readyState == 4) {
            $('#signup').html('نام‌نویسی');
            $('#signup').removeAttr('disabled');
            if (this.status == 200) {
                redirectToPanel('std');
            } else if (this.status == 400) {
                alert('#alert-placeholder-signup', 'danger', JSON.parse(this.responseText).msg || 'درخواست ارسال شده معتبر نیست.');
            } else if (this.status == 409) {
                alert('#alert-placeholder-signup', 'danger', 'شما پیشتر نام‌نویسی کرده اید.');
            } else if (this.status == 500) {
                alert('#alert-placeholder-signup', 'warning', 'سرور اختلالاتی را تجربه می کند. چند دقیقه دیگر تلاش کنید.')
            } else {
                alert('#alert-placeholder-signup', 'danger', this.responseText);
            }
        }
    }
    req.open("POST", '/api/user/signup');
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send(params);
}
