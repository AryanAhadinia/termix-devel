document.getElementById('signout').onclick = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 4) {
            window.location.href = '/'
        }
    }
    req.open("POST", '/api/user/signup');
    req.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    req.send();
}

function sAlert(location, id, type, message) {
    $(`${location}`).html(`
        <div id="${id}" class="alert alert-${type} collapse">
            ${message}
        </div>
    `);
    $(`#${id}`).show('fade');
}

document.getElementById("crawl").onclick = () => {
    $('#crawlalr').alert('close');
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 1) {
            $('#crawl').html('<span class="spinner-border spinner-border-sm" style="width: 2rem; height: 2rem;" id="spinner" role="status" aria-hidden="true"></span>');
            $('#crawl').attr('disabled', 'disabled');
        } else if (this.readyState == 4) {
            $('#crawl').html('دریافت از سامانه آموزش');
            $('#crawl').removeAttr('disabled');
            if (this.status == 200) {
                sAlert('#alr-crawl', 'crawlalr', 'success', 'عملیات با موفقیت انجام شد.');
            } else {
                sAlert('#alr-crawl', 'crawlalr', 'warning', 'سرور اختلالاتی را تجربه می کند. چند دقیقه دیگر تلاش کنید.');
            }
        }
    }
    req.open('PUT', '/api/crawl');
    req.send();
}

document.getElementById('delete').onclick = () => {
    const req = new XMLHttpRequest();
    req.onreadystatechange = function () {
        if (this.readyState == 1) {
            $('#dbdropButton').html('<span class="spinner-border spinner-border-sm" style="width: 2rem; height: 2rem;" id="spinner" role="status" aria-hidden="true"></span>');
            $('#dbdropButton').attr('disabled', 'disabled');
        } else if (this.readyState == 4) {
            $('#dbdropButton').html('حذف پایگاه داده');
            $('#dbdropButton').removeAttr('disabled');
            if (this.status == 200) {
                sAlert('#alr-delete', 'deletealr', 'success', 'عملیات با موفقیت انجام شد.');
            } else {
                sAlert('#alr-delete', 'deletealr', 'warning', 'سرور اختلالاتی را تجربه می کند. چند دقیقه دیگر تلاش کنید.');
            }
        }
    }
    req.open('DELETE', '/api/admin/dropsemester');
    req.send();
    $('#dbdropModal').modal('hide');
}