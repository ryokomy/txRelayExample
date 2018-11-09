const request = require('request');
const util = require('util');
request.post = util.promisify(request.post)

const base_url = 'http://localhost:8080'

async function post(api, form) {
    let headers = {
        'Content-Type':'application/json'
    }

    var options = {
        url: base_url + api,
        headers: headers,
        json: true,
        form: form
    }

    let result = await request.post(options);
    if(result.error) {
        console.log('game server error: ' + base_url + api)
        return result.error;
    }
    else if (result.body) {
        console.log('game server done: ' + base_url + api)
        return result.body
    }
}

async function postTxRelay() {
    let api = '/txRelay'
    let form = {
        tx: 'test string'
    }

    let result = await post(api, form)
    .catch(err => {
        console.error(err)
    })

    return result
}

async function test() {
    let result = await postTxRelay()
    .catch(err => {
        console.error(err)
    })
    console.log(result)
    return
}

test()