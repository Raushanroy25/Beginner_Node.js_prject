window.onload = () => {
    function _(id) {
        return document.querySelector('#' + id)
    }

    // take list of data

    let ajax = ep =>
        new Promise((resolve, reject) => {
            let xhttp = new XMLHttpRequest()
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    resolve(this.responseText)
                }
            }
            xhttp.open('POST', '/send_profile_user?q=' + ep, true)
            xhttp.send()
        })

    let a = ajax(_('idsofuser').innerHTML)
    a.then(s => {
        let json = JSON.parse(s)
        let temparr = []

        for (let i of json.arr) {
            temparr.push(i)
        }
        let sorted_arr = sort_to_most(temparr)

        sorted_arr.map(i => {
            updateList(i)
        })
    })

    function sort_to_most(arr) {
        let temparrcheck = []
        let tempcheck

        for (let i = 0; i < arr.length; i++) {
            for (let j = 0; j < arr.length - 1; j++) {
                if (arr[j].likes > arr[j + 1].likes) {
                } else {
                    tempcheck = arr[j]
                    arr[j] = arr[j + 1]
                    arr[j + 1] = tempcheck
                }
            }
        }
        return arr
    }

    async function updateList(json) {
        if (json.visible == false) {
            return
        }

        let flag = await check_like(json)
        let like_s = JSON.parse(flag)

        let s_oflike = `color : black`

        if (like_s.liked == true) {
            s_oflike = `color : blue`
        }
        let ids = `${json.filename}likebutton`

        let divs_photos = `<center>
            <hr>
            <div class="d-inline-block">
                <center>
                    <h5>${json.whoupload}</h3>
                </center>
                <hr>
                <div class="card col-lg-9" style="width: 54rem;">
                    <img src="/image/${json.filename}"
                        class="card-img-top img-fluid" alt="image/jpg">
                    <div class="card-body">
                        <h5 class="card-title">${json.card_title}</h5>
                        <p class="card-text">${json.card_decs}</p>
                        <i id="${ids}" onclick="liked('${json.filename}' , '${json.whoupload}')" style="font-size: 25px; float : left;cursor:pointer; ${s_oflike}" class="fa fa-thumbs-up"></i>
                        <i id="${ids}" onclick="download('${json.filename}')" style="font-size: 25px; float : right;cursor:pointer" class="fa fa-download"></i>
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
