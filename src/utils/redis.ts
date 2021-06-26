import redis, { RedisClient } from 'redis';

import { promisify } from 'util';
interface Client extends RedisClient {
    get: any,
    set: any,
    del: any,
    setUser: any,
    getUser: any,
    delUser: any
}

const client: Client = redis.createClient() as Client;

client.on('error', function (error) {
    console.error(error);
});

client.on('ready', function () {
    console.error('Successfully connected to redis server');
});

client.get = promisify(client.get).bind(client);

client.set = promisify(client.set).bind(client);

client.del = promisify(client.del).bind(client);

// Handles user operations
client.setUser = (id: string, data: object) => client.set(`user_${id}`, JSON.stringify(data));
client.getUser = (id: string) => client.get(`user_${id}`);
client.delUser = (id: string) => client.del(`user_${id}`);

export default client;
