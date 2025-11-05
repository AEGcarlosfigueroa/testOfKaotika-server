const connectUrl = 'mqtts://8170107f188a4c6f93244c5cdc6ed241.s1.eu.hivemq.cloud:8883';
import * as dotenv from 'dotenv';
import * as cardService from './../services/cardService.ts'
import mqtt from 'mqtt';
import * as userService from './../services/userService.ts'
const subscribedTopics = ['cardscan']
import { pendingSockets } from '../ioServer/listeners/isInTowerListener.ts';

export default function startMQTT(mqttOptions: any)
{
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
        manageTopicMessage(message);
    }
}

async function manageTopicMessage(message: any)
{
  try
  {
    const player = await cardService.getEntryFromCardID(message.content.toString());
    console.log("Player Found: " + player.email);
    if(player)
    {
      const socketID = player.socketId;
      pendingSockets.push(socketID);
    }
  }
  catch(error)
  {
    console.error(error);
  }
}