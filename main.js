import { ReadableStream, WritableStream } from 'streams';
import { httpRequest } from 'http-request';
import { createResponse } from 'create-response';
import { TextEncoderStream, TextDecoderStream } from 'text-encode-transform';
import { EdgeKV } from './edgekv.js';
import { logger } from 'log';

import { Validator } from './services/validator.js';
import { Extractor } from './services/extractor.js';


export async function responseProvider(request) {
    let error = "None";
    let validationResult = true;
    const inputObject = await request.text();
    const inputText = JSON.stringify(inputObject);

    try {
        const database = new EdgeKVDatabase();
        const validator = new Validator(database);
        const extractor = new Extractor();

        const emailAddress = extractor.getEmailAddress(inputText);
        const phoneNumber = extractor.getPhoneNumber(inputText);

        validationResult = validator.byEmailAndPhoneNumberHistorically(email, )

    } catch (err) {
        error = "Regex matching error " + err.message;
    }
    
    const url = `${request.scheme}://${request.host}${request.url}`;

    if (error !== "None" || !validationResult) {
        return createResponse(
            400,
            { 'Content-Type': ['application/json'] },
            JSON.stringify({ 
                path: request.path,
                text: inputText,
                email: email,
                error: error,
                url: url
            })
        );
    }

    const options = {};
    options.method = request.method;
    options.headers = request.getHeaders();
    options.body = inputObject;

    return httpRequest(url, options).then(
        (response) => {
            return createResponse(
                response.status,
                response.getHeaders(),
                response.body   
            );
        }
    );
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