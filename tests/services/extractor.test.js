import Extractor from '../../services/extractor.js'

let extractor;
const sampleText = `------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][0][first]"

John
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][0][last]"

Doe
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][1]"

email@address.com
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][3]"

(770) 670-9999
------WebKitFormBoundaryrKTVAUIF06uExLdC
Content-Disposition: form-data; name="wpforms[fields][5]"
`;

beforeEach(() => {
	extractor = new Extractor();
});

test('extract the email address from a blob of text', () => {
	const emailAddress = extractor.getEmailAddress(sampleText);
	expect(emailAddress).toBe("email@address.com");
});

test('extract the phone number from a blob of text', () => {
	const phoneNumber = extractor.getPhoneNumber(sampleText);
	expect(phoneNumber).toBe("(770) 670-9999");
});
