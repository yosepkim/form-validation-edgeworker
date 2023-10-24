import { ReadableStream, WritableStream } from 'streams';
import { httpRequest } from 'http-request';
import { createResponse } from 'create-response';
import { TextEncoderStream, TextDecoderStream } from 'text-encode-transform';
import { EdgeKV } from './edgekv.js';
import { logger } from 'log';

import { Orchestrator } from './services/orchestrator.js';


export async function responseProvider(request) {
    try {
        const database = new EdgeKVDatabase();
        const orchestrator = new Orchestrator(database);

        return orchestrator.run(request, httpRequest, createResponse);
    } catch (exception) {
        return createResponse(
            500,
            { 'Content-Type': ['application/json'] },
            JSON.stringify({ 
                path: request.path,
                errorMessage: exception.message
            })
        );
    }
}

class EdgeKVDatabase {
    constructor () {
        this.store = new EdgeKV({namespace: "formvalidator", group: "EmailPhoneValidation"});
    }

    getByKey(key) {
        return this.store.getText({ item: key });
    }

    set(key, value) {
        this.store.putTextNoWait({
            item: key,
            value: value
        });
    }
}