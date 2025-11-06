const connectUrl = 'mqtts://8170107f188a4c6f93244c5cdc6ed241.s1.eu.hivemq.cloud:8883';
import * as dotenv from 'dotenv';
import * as cardService from './../services/cardService.ts'
import mqtt from 'mqtt';
import * as userService from './../services/userService.ts'
const subscribedTopics = ['cardscan', 'authorization']
import { pendingSockets } from '../ioServer/listeners/isInTowerListener.ts';
import isInTowerEntranceRequest from '../ioServer/events/isInTowerEntranceRequest.ts';

export let mqttClient = null;

export default function startMQTT(mqttOptions: any)
{
    const client = mqtt.connect(mqttOptions.url, {
      username: mqttOptions.user,
      password: mqttOptions.password
    })

    mqttClient = client

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
    const player = await userService.getPlayerFromCardID(message.content.toString());
    if(player)
    {
      console.log("Player Found: " + player.email);
      const socketID = player.socketId;
      let socketAlreadyPending = false;
      for(let i=0; i<pendingSockets.length; i++)
      {
        if(socketID === pendingSockets[i])
        {
          socketAlreadyPending = true;
        }
      }

      if(!socketAlreadyPending && socketID !== null)
      {
        pendingSockets.push(socketID);
        isInTowerEntranceRequest(socketID);
      }
      else if(socketAlreadyPending)
      {
        isInTowerEntranceRequest(socketID);
      }
      else
      {
        mqttClient.publish('authorization', `${false}`, { qos: 0, retain: false }, (error) => {
          if (error) {
            console.error(error)
          }
        });
      }
      console.log(pendingSockets);
    }
  }
  catch(error)
  {
    console.error(error);
  }
}