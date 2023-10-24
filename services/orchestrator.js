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

	    try {
	    	const emailAddress = this.extractor.getEmailAddress(inputText);
	    	const phoneNumber = this.extractor.getPhoneNumber(inputText);

	    	const result = await this.validator.byEmailAndPhoneNumberHistorically(emailAddress, phoneNumber);
			if (!result.isValid) {
		        return createResponse(
		            400,
		            { 'Content-Type': ['application/json'] },
		            JSON.stringify({ 
		                path: request.path,
		                text: inputText,
		                url: url,
		                reason: result.reason,
		                emailAddress: emailAddress,
		                phoneNumber: phoneNumber
		            })
		        );
		    }
		} catch (exception) {
			return createResponse(
	            500,
	            { 'Content-Type': ['application/json'] },
	            JSON.stringify({ 
	                path: request.path,
	                text: inputText,
	                url: url,
	                error: exception,
	                errorMessage: exception.message,
	                stacktrace: exception.stack
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
}

export default Orchestrator;