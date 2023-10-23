import { ReadableStream, WritableStream } from 'streams';
import { httpRequest } from 'http-request';
import { createResponse } from 'create-response';
import { TextEncoderStream, TextDecoderStream } from 'text-encode-transform';
import { EdgeKV } from './edgekv.js';
import { logger } from 'log';

import { Orchestrator } from './services/orchestrator.js';


export async function responseProvider(request) {
    const database = new EdgeKVDatabase();
    const orchestrator = new Orchestrator(database);

    return orcherstrator.run(request, httpRequest, createResponse);
}

class EdgeKVDatabase {
    constructor () {
        this.store = new EdgeKV({namespace: "formvalidator", group: "default"});
    }

    async getByKey(key) {
        return await this.store.getText({ item: key});
    }

    async set(key, value) {
        await this.store.putText({
            item: key,
            value: value
        });
    }
}