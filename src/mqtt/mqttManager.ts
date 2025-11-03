const connectUrl = 'mqtts://8170107f188a4c6f93244c5cdc6ed241.s1.eu.hivemq.cloud:8883';
import * as dotenv from 'dotenv';
import * as cardService from './../services/cardService.ts'
import mqtt from 'mqtt';
const subscribedTopics = ['cardscan', 'isintower']

export default function startMQTT(mqttOptions: any)
{
    console.log(process.env.HIVEMQ_PASSWORD)
    const client = mqtt.connect(mqttOptions.url, {
      username: mqttOptions.user,
      password: mqttOptions.password
    })

    client.on('connect', () => {
      console.log('MQTT Connected');

      client.subscribe(subscribedTopics, () => {
        console.log("subscribed to topics: ");
        for(let i=0; i<subscribedTopics.length; i++)
        {
            console.log(subscribedTopics[i]);
        }
      });

      client.on('message', (topic, payload) => {
        console.log('Received Message:', topic, payload.toString());
        const message = {
            topic: topic,
            content: payload,
        };

        manageResponse(message);

      });
    })

    client.on('error', (error) => {
      console.error('connection failed', error)
    })
}

async function manageResponse(message: any)
{
    if(message.topic === subscribedTopics[0])
    {
        const card = await cardService.getEntryFromCardID(message.content.toString());
        console.log(card);
    }
}