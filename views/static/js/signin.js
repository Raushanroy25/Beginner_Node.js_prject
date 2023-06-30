window.onload = () => {
    function _(id) {
        // return the value
        return document.querySelector('#' + id)
    }

    let btn = _('btn')

    let ajax = ep =>
        new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText == 'true') {
                        resolve('true')
                    } else {
                        reject('false')
                    }
                }
            }
            xhttp.open('POST', '/verify?q=' + ep, true)
            xhttp.send()
        })

    btn.addEventListener('click', () => {
        let email = _('email').value
        let pass = _('pass').value

        if (email == '') {
            return false
        }
        if (pass == '') {
            return false
        } else {
            let emailpass = `${email}+${pass}`

            ajax(emailpass)
                .then(check => {
                    if (check == 'true') {
                        swal(
                            'Login Success',
                            'Login Granted redirected to dashboard',
                            'success',
                        )

                        setTimeout(() => {
                            location.href =
                                window.location.origin + '/dashboard'
                        }, 1000)
                    } else {
                        swal(
                            'Login Failed',
                            'Not login because some error',
                            'error',
                        )
                    }
                })
                .catch(err => {
                    swal(
                        'Login Failed',
                        'username or password may be wrong you can forgot password or create new account',
                        'error',
                    )
                })
        }
    })
}
