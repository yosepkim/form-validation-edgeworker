import { ReadableStream, WritableStream } from 'streams';
import { httpRequest } from 'http-request';
import { createResponse } from 'create-response';
import { TextEncoderStream, TextDecoderStream } from 'text-encode-transform';
import { logger } from 'log';

const EMAIL_REGEX = /wpforms\[fields\]\[1\][\\\"nr\s]+(?<email>[a-zA-Z0-9]+@[a-zA-Z0-9]+[\.][a-zA-Z]+)/;

export async function responseProvider(request) {
    let error = "None";

    const inputObject = await request.text();
    const inputText = JSON.stringify(inputObject);
    let email = "Not found";
    

    try {
        let emailMatch = inputText.match(EMAIL_REGEX);
        if (emailMatch) {
            email = emailMatch.groups.email;
        }
        if (email === "bad@actor.com") {
            error = "Hacker detected";
        }
    } catch (err) {
        error = "Regex matching error " + err.message;
    }
    
    const url = `${request.scheme}://${request.host}${request.url}`;


    if (error !== "None") {
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