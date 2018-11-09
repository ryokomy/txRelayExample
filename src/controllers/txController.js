const txRelay = async (req, res, next) => {
    console.log('request: /txRelay')

    let tx = req.body.tx

    let result = {tx: tx}

    return res.json(result)
}

module.exports.txRelay = txRelay