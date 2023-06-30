let cookie = document.cookie.split('=')[1]
let mark_like = false

function _i(id) {
    return document.getElementById(id)
}

let ajax = (link, ep) =>
    new Promise((resolve, reject) => {
        let xhttp = new XMLHttpRequest()
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                resolve(this.responseText)
            }
        }
        xhttp.open('POST', link + ep, true)
        xhttp.send()
    })

function check_like(r, e) {
    let obj = {
        filedata: r,
    }

    return ajax('/liked_?q=', JSON.stringify(obj))
}

function showProfile(username) {
    window.location.href = '/showprofile/' + username
}

function visibleItem(filename_id) {
    let json = {
        filename: filename_id,
        visible_set: null,
    }
    let check_vis = _i(filename_id + 'vis')

    console.log(check_vis.className)
    if (check_vis.className == 'fa fa-eye') {
        json.visible_set = false
    } else {
        json.visible_set = true
    }
    let del = ajax('/visible?q=', JSON.stringify(json))

    del.then(d => {
        let con_j = JSON.parse(d)
        console.log(con_j)
        if (con_j.vis == true) {
            check_vis.className = 'fa fa-eye'
        } else {
            check_vis.className = 'fa fa-eye-slash'
        }
    })
}

function delete_items(filename_id) {
    let json = {
        filename: filename_id,
    }
    let del = ajax('/delete_f?q=', JSON.stringify(json))

    del.then(d => {
        let img_ref = _i(filename_id + 'deleteitemcnf')

        let del_flag = JSON.parse(d)
        if (del_flag.del == true) {
            swal('Item Deleted', filename_id, 'success')
            img_ref.innerHTML = ''
        } else {
            swal('Error', '', 'error')
        }
    })
}

function download(filename_id) {
    let json = {
        filename: filename_id,
    }
    location.href =
        window.location.origin + '/download?q=' + JSON.stringify(json)
}

function liked(name, emails) {
    let json = {
        filename: name,
        email: emails,
    }

    let check_liked_ordislike = _i(`${name}likebutton`)

    if (check_liked_ordislike.style.color == 'blue') {
        let unlike = ajax('/unlike?q=', JSON.stringify(json))

        unlike.then(o => {
            let json_c = JSON.parse(o)
            let span_like = _i(`${name}`)

            span_like.innerText = `${json_c.likes} likes`

            let btn_like = _i(`${name}likebutton`)

            btn_like.style.color = 'black'
        })
    } else {
        let r = ajax('/like?q=', JSON.stringify(json))

        r.then(async d => {
            let flag = await check_like(JSON.parse(d))

            let json_c = JSON.parse(flag)

            let r = _i(`${name}`)
            let json_data = JSON.parse(d)

            r.innerText = `${json_data.likes} likes`

            let ids_like = _i(`${name}likebutton`)

            if (json_c.liked == true) {
                ids_like.style.color = 'blue'
            } else {
                ids_like.style.color = 'black'
            }
        }).catch(errr => {
            console.log(errr)
        })
    }
}
