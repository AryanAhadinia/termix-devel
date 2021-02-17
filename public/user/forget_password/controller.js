function alert(type, message) {
    $('#alert-placeholder').html(`
        <div id="alr" class="alert alert-${type} alert fade show" role="alert">
            ${message}
        </div>
    `);
}

document.getElementById("request").onclick = function () {
    const parameters = {
        "email": document.getElementById("email").value
    }
    if (parameters.email == "") {
        return;
    }
    $('#alr').alert('close');
    const params = getURL_Encoded(parameters);
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 1) {
            $('#request').html('<span class="spinner-border spinner-border-sm" style="width: 1rem; height: 1rem;" id="spinner" role="status" aria-hidden="true"></span>');
            $('#email').attr('disabled', 'disabled');
            $('#request').attr('disabled', 'disabled');
        } else if (this.readyState == 4) {
            if (this.status == 200) {
                $('#request').html('لینک بازیابی ارسال شد.');
            } else {
                $('#request').html('ارسال لینک بازیابی');
                $('#request').removeAttr('disabled');
                $('#email').removeAttr('disabled');
                if (this.status == 400) {
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
    }
    req.open('POST', '/api/user/forget_password/request');
    req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    req.send(params);
}

