const processor = require('./processor')
const express = require('express'),
    bodyParser = require('body-parser')
const { WebhookClient } = require('dialogflow-fulfillment')
const { Card, Suggestion } = require('dialogflow-fulfillment')

const PORT = process.env.PORT || 4200


const app = express(bodyParser.json())

app.use(bodyParser.json())

app.get('/', (request, response) => response.send({"msg": "Hello world!"}))

app.post('/', (req, res) => {
    console.log("Request Header: " + JSON.stringify(req.headers))
    console.log("Request Body: " + JSON.stringify(req.body))

    req = processor(req)

    const agent = new WebhookClient({request: req, response: res})

    function welcome(agent) {
        agent.add(`สวัสดีครับ มีอะไรให้อุ่นใจช่วยครับ`)
    }

    function fallback(agent) {
        agent.add(`I don't understand`)
        agent.add(`I am sorry. Can you repeat again`)
    }

    function sim2fly(agent) {
        agent.add("อุ่นใจแนะนำ Sim 2 Fly ราคาประหยัดครับ")
        agent.add(new Card({
            title: `Sim 2 Fly`,
            imageUrl: `https://store.ais.co.th/media/wysiwyg/product/product-description/Sim/SIM2Fly_LINEHome1040x1040_Compress.jpg`,
            text: `Sim 2 Fly โรมมิ่ง ราคาประหยัด`,
            buttonText: `ดูข้อมูลเพิ่มเติม`,
            buttonUrl: `http://www.ais.co.th/roaming/sim2fly/?gclid=CjwKCAjww6XXBRByEiwAM-ZUIFrTKb_iEnZqewsMkYG8kFvliueHR1sX3-cFfQPo_hvcGtiRbo_68RoC1SIQAvD_BwE&s_kwcid=AL!897!3!259718486577!e!!g!!sim2fly&ef_id=WnKrygAAAdEwtceS:20180502080316:s`,
        }))
    }

    let intentMap = new Map()

    intentMap.set('Default Welcome Intent', welcome)
    intentMap.set('Default Fallback Intent', fallback)
    intentMap.set('MaoMao', sim2fly)
    
    agent.handleRequest(intentMap)
})

app.listen(PORT, (error) => {
    if (error) {
        console.log(error)
    }
    else {
        console.log(`listening at port ${PORT}`)
    }
})
