import Orchestrator from '../../services/orchestrator.js'
import FakeKeyValueDatabase from '../doubles/fakeKeyValueDatabase.js'

let orchestrator;

beforeEach(() => {
	orchestrator = new Orchestrator(new FakeKeyValueDatabase());
});

test('handles both happy and bad scenarios', async() => {
	const baseMockRequest = {
		scheme: 'https',
		host: 'host.com',
		url: 'some-url',
		path: '/path',
		method: 'POST',
		getHeaders: () => {
			return {
				header1: 'value1',
				header2: 'value2'
			}
				
		}
	}

	const mockRequest1 = {
		...baseMockRequest,
		text: async () => { 
			return new Promise((resolve, reject) => {
				resolve(`------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][1]"

email1234@address.com
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][3]"

(770) 670-9999
------WebKitFormBoundaryrKTVAUIF06uExLdC"`);
			})
		}
	}
	const mockRequest2 = {
		...baseMockRequest,
		text: async () => { 
			return new Promise((resolve, reject) => {
				resolve(`------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][1]"

email2323@address.com
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][3]"

(770) 670-9999
------WebKitFormBoundaryrKTVAUIF06uExLdC`);
			})
		}
	}

	const mockRequest3 = {
		...baseMockRequest,
		text: async () => { 
			return new Promise((resolve, reject) => {
				resolve(`------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][1]"

differentEmail99923@address.com
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][3]"

(770) 670-9999
------WebKitFormBoundaryrKTVAUIF06uExLdC`);
			})
		}
	}

	const mockRequest4 = {
		...baseMockRequest,
		text: async () => { 
			return new Promise((resolve, reject) => {
				resolve(`------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][1]"

email999@address.com
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][3]"

(770) 670-9999
------WebKitFormBoundaryrKTVAUIF06uExLdC`);
			})
		}
	}

	const mockRequest5 = {
		...baseMockRequest,
		text: async () => { 
			return new Promise((resolve, reject) => {
				resolve(`------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][1]"

differentEmail999@address.com
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][3]"

(770) 670-9999
------WebKitFormBoundaryrKTVAUIF06uExLdC`);
			})
		}
	}

	const mockRequest6 = {
		...baseMockRequest,
		text: async () => { 
			return new Promise((resolve, reject) => {
				resolve(`------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][1]"

differentEmail1234@address.com
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][3]"

(770) 670-9999
------WebKitFormBoundaryrKTVAUIF06uExLdC`);
			})
		}
	}

	const mockHttpRequest = (url, options) => {
		return new Promise((resolve, reject) => {
			resolve({ 
				status: 200,
				body: 'response body',
				getHeaders: () => {
					return {
						header1: 'some-value'
					}
				}
			})
		})
	};

	const mockCreateResponse = (status, headers, body) => {
		return new Promise((resolve, reject) => {
			resolve({
				status: status,
				body: body
			})

		});
	}

	let result = await orchestrator.run(mockRequest1, mockHttpRequest, mockCreateResponse);
	expect(result.status).toBe(200);
	result = await orchestrator.run(mockRequest2, mockHttpRequest, mockCreateResponse);
	expect(result.status).toBe(200);
	result = await orchestrator.run(mockRequest3, mockHttpRequest, mockCreateResponse);
	expect(result.status).toBe(200);
	result = await orchestrator.run(mockRequest4, mockHttpRequest, mockCreateResponse);
	expect(result.status).toBe(400);
	result = await orchestrator.run(mockRequest5, mockHttpRequest, mockCreateResponse);
	expect(result.status).toBe(200);
	result = await orchestrator.run(mockRequest6, mockHttpRequest, mockCreateResponse);
	expect(result.status).toBe(400);
});