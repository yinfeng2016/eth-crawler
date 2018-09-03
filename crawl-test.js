'use strict'

const request = require('request')
const fs = require('fs')
const Json2csvParser = require('json2csv').Parser

const mainUrl = 'https://api.etherscan.io/api?module=account&action=tokentx&contractaddress=0x05f4a42e251f2d52b8ed15e9fedaacfcef1fad27&offset=600&sort=asc&page='

async function processCrawl() {
    let page = 1
    while (true) {
        let url = mainUrl + page.toString()
        console.log('Crawl url: ', url)
        let b = await crawlUrl(url)
        let body = JSON.parse(b)

        


        if (body.status === '0') {
            console.log('Finish crawl')
            break
        }

        for (let i=0; i < body.result.length; i++) {
            let transaction = body.result[i]
            let content = JSON.stringify(transaction);
            fs.appendFile("Zilliqa.json", content, 'utf8', function (err) {
                if (err) {
                    return console.log(err);
                }
            }); 
        }

        page++

    }



}

function crawlUrl(url) {
    return new Promise(function (resolve, reject) {
        request(url, function (error, res, body) {
            if (!error && res.statusCode == 200) {
                resolve(body);
            } else {
                reject(error);
            }
        });
    });
}


processCrawl()