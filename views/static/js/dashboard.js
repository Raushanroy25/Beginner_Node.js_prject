window.onload = () => {
    function _(id) {
        return document.querySelector('#' + id)
    }

    let upload_btn = _('upload_btn')

    upload_btn.addEventListener('click', () => {
        let files = _('inputGroupFile01').files[0]

        var formdata = new FormData()

        let cardt = _('card_t').value
        let cardd = _('card_d').value
        let pbars = _('pbar')

        let json = {
            card_title: cardt,
            card_detail: cardd,
        }
        let jsonString = JSON.stringify(json)

        formdata.append('avatar', files)

        var ajax = new XMLHttpRequest()

        ajax.upload.addEventListener('progress', progressHandler, false)

        ajax.addEventListener('load', completeHandler, false)

        ajax.addEventListener('error', errorHandler, false)

        ajax.addEventListener('abort', abortHandler, false)

        ajax.open('POST', '/upload?q=' + jsonString)

        ajax.send(formdata)

        ajax.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                setTimeout(() => {
                    let removeimg = (_('preimg').src = '')

                    updateList(JSON.parse(this.responseText))
                }, 2000)
            }
        }

        function progressHandler(event) {
            let per = Math.round((event.loaded / event.total) * 100)
            pbars.style.width = per + '%'
            pbars.innerHTML = per + '/ 100 ' + '%'
        }

        function completeHandler(event) {
            swal('File Uploaded', '', 'success')
        }

        function errorHandler(event) {
            swal('Error', '', 'error')
        }

        function abortHandler(event) {
            swal('Handler Aborted', '', 'error')
        }
    })

    // take list of data

    let ajax = () =>
        new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(this.responseText)
                }
            }
            xhttp.open('POST', '/list_logged_user', true)
            xhttp.send()
        })

    let a = ajax()
    a.then(s => {
        let json = JSON.parse(s)
        json.arr.map(i => {
            updateList(JSON.parse(i))
        })
    })

    /**
     * updateList for upating dom elem with photo link
     * @param {*} json - obj file that photo information
     */
    async function updateList(json) {
        let flag = await check_like(json)
        let like_s = JSON.parse(flag)

        let s_oflike = `color : black`
        let visible_item_flag = `fa fa-eye`

        if (like_s.liked == true) {
            s_oflike = `color : blue`
        }

        if (json.visible == false) {
            visible_item_flag = `fa fa-eye-slash`
        }

        let ids = `${json.filename}likebutton`

        let divs_photos = `<center id="${json.filename}deleteitemcnf">
            <hr>
            <div class="d-inline-block">
                <center>
                    <h5>${json.whoupload}</h3>
                </center>
                <hr>
                <div class="card col-lg-9" style="">
                    <img style="width:auto;height:auto" src="/image/${json.filename}"
                        class="card-img-top img-fluid" alt="image/jpg">
                    <div class="card-body">
                        <h5 class="card-title">${json.card_title}</h5>
                        <p class="card-text">${json.card_decs}</p>
                        <i id="${ids}" onclick="liked('${json.filename}' , '${json.whoupload}')" style="font-size: 25px; float : left;cursor:pointer; ${s_oflike}" class="fa fa-thumbs-up"></i>
                        <i id="${ids}" onclick="download('${json.filename}')" style="font-size: 25px; float : right;cursor:pointer" class="fa fa-download"></i>

                        <i id="${ids}" onclick="delete_items('${json.filename}')" style="font-size: 25px; float : right;cursor:pointer;margin-right:40px" class="fa fa-trash"></i>

                        <i id="${json.filename}vis" onclick="visibleItem('${json.filename}')" style="font-size: 25px; float : right;cursor:pointer;margin-right:40px;" class="${visible_item_flag}"></i>

                        <h5 id="${json.filename}" class="card-title"> ${json.likes} likes </h5>
                        
                    </div>
                </div>
            </div>
            <br>
            <br>
            </center>`

        let update_dom = _('list_of_file')

        update_dom.innerHTML += divs_photos
    }
}
