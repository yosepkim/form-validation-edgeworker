import { Validator } from './validator.js';
import { Extractor } from './extractor.js';

export class Orchestrator {
	constructor(database) {
		this.validator = new Validator(database);
	    this.extractor = new Extractor();
	}

	async run(request, httpRequest, createResponse) {
		const inputObject = await request.text();
	    const inputText = JSON.stringify(inputObject);
	    const url = `${request.scheme}://${request.host}${request.url}`;

		if (!this.extractAndValidate(inputText)) {
	        return createResponse(
	            400,
	            { 'Content-Type': ['application/json'] },
	            JSON.stringify({ 
	                path: request.path,
	                text: inputText,
	                url: url
	            })
	        );
	    }

	    const options = {
	        method: request.method,
	        headers: request.getHeaders(),
	        body: inputObject
	    };

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

	extractAndValidate(inputText) {
        const emailAddress = this.extractor.getEmailAddress(inputText);
        const phoneNumber = this.extractor.getPhoneNumber(inputText);

        return this.validator.byEmailAndPhoneNumberHistorically(emailAddress, phoneNumber);
	}
}

export default Orchestrator;