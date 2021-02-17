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