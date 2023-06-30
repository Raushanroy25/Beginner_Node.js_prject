window.onload = () => {
    function _(id) {
        return document.querySelector('#' + id)
    }

    let btn = _('btn')

    let ajax = ep =>
        new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    if (this.responseText == false) {
                        reject(false)
                    } else {
                        resolve(true)
                    }
                }
            }
            xhttp.open('POST', '/accounts_create?q=' + ep, true)
            xhttp.send()
        })

    btn.addEventListener('click', () => {
        let fname = _('fname').value
        let email = _('email').value
        let npass = _('npass').value
        let re_npass = _('re_npass').value
        let mobile = _('mobile').value

        if (fname && email && npass && re_npass && mobile == '') {
            swal(
                'All field are Required',
                'fill all the blank field',
                'error',
            )
        }
        if (npass != re_npass) {
            swal(
                'password not Matched',
                'Enter correct password please',
                'error',
            )
        } else {
            let format = `${fname}+${email}+${npass}+${re_npass}+${mobile}`
            let r = ajax(format)
            r.then(x => {
                if (x == true) {
                    swal(
                        'Account Created',
                        'Now you redirected to Login Page',
                        'success',
                    )
                    setTimeout(() => {
                        location.href =
                            window.location.origin + '/signin'
                    }, 1000)
                } else {
                    swal('Account Not Created', 'Try Again', 'error')
                }
            })
        }
    })
}
