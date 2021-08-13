const express = require("express")
const expressip = require("express-ip")
const useragent = require('express-useragent')
const jimp = require("jimp")
const promisify = require('bluebird').promisify
const path = require('path')

const port = 1337

const app = express()
app.use(expressip().getIpInfoMiddleware)
app.use(useragent.express())

app.get('/', async (req, res) => {
    res.sendFile(path.resolve('./index.html'))
})

app.get('/index.html', async (req, res) => {
    res.sendFile(path.resolve('./index.html'))
})

app.get('/lol.png', async (req, res) => {
    let ip = req.ipInfo.ip.split(":").pop()
    console.log(req.useragent.source)
    if (req.useragent.source.includes("Discordbot")) {
        res.sendFile(path.resolve("./discord.png"))
    } else if (req.useragent.source.includes("Macintosh; Intel Mac OS X 10.10; rv:38.0) Gecko/20100101 Firefox/38.0")) {
        res.sendFile(path.resolve("./discord.png"))
    } else {
        let image = await jimp.read("./heroes.png") 
        let font64 = await jimp.loadFont(jimp.FONT_SANS_64_BLACK)
        let font32 = await jimp.loadFont(jimp.FONT_SANS_32_BLACK)
    
        //i fucking can't write good code
        let part1 = await image.print(font64, 35, 1, "We have your IP")
        let part2 = await image.print(font32, 135, 70, `(It's ${ip})`)
        let part3 = await image.print(font64, 15, 625, "See you in 5 mins!")
    
        let result_promise = promisify(part3.getBuffer.bind(part3))
        let result = await result_promise('image/png')

        res.set('Content-Type', 'image/png')
        res.send(result)
    }
})

app.listen(port, function () {
    console.log(`Express started on http://localhost:${port}; press Ctrl-C to terminate.`)
})