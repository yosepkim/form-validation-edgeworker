import Validator from '../../services/validator.js'
import FakeKeyValueDatabase from '../doubles/fakeKeyValueDatabase.js'

let database;
let validator;

beforeEach(() => {
	database = new FakeKeyValueDatabase();
	validator = new Validator(database);
});


test('validates a single email address', () => {
	expect(validator.isValidEmailAddress('email0001@mail.com')).toBe(true);
	expect(validator.isValidEmailAddress('email0001@mail')).toBe(false);
	expect(validator.isValidEmailAddress('email000mail.com')).toBe(false);
	expect(validator.isValidEmailAddress('email0001mailcom')).toBe(false);
});

test('validates a single phone number', () => {
	expect(validator.isValidPhoneNumber('(770) 678-9999')).toBe(true);
	expect(validator.isValidPhoneNumber('(770)678-9999')).toBe(true);
	expect(validator.isValidPhoneNumber('770-678-9999')).toBe(true);
	expect(validator.isValidPhoneNumber('7706789999')).toBe(true);
	expect(validator.isValidPhoneNumber('770 678 9999')).toBe(true);
	expect(validator.isValidPhoneNumber('7x00002000')).toBe(false);
	expect(validator.isValidPhoneNumber('770000000')).toBe(false);
	expect(validator.isValidPhoneNumber('2292=12333')).toBe(false);
});

test('extracts username by the alpha-numberic pattern', () => {
	expect(validator.extractAlphaNumbericPattern('myname12345')).toMatchObject({"firstPart": "myname", "secondPart": "12345"});
	expect(validator.extractAlphaNumbericPattern('john')).toBeNull();
});


test('allows a valid email address and phone number', async () => {
	let result = await validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '111-222-3333');
	expect(result.isValid).toBe(true);
});

test('invalidates a malformed email address and phone number', async () => {
	let result = await validator.byEmailAndPhoneNumberHistorically('email0001mail.com', '111-222-3333');

	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Invalid email");

	result = await validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '111-222a333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Invalid phone");
});

test('allows the same email address and phone number entries', async () => {
	let result = await validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(true);

	result = await validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-5555');
	expect(result.isValid).toBe(true);

	result = await validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(true);
});

test('invalidates email addresses entries with long usernames', async () => {
	let result = await validator.byEmailAndPhoneNumberHistorically('1LoGSqqulmepMdkuFpvfm3p3L@gmail.com', '(111) 222-3333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Username of the email too long");

	result = await validator.byEmailAndPhoneNumberHistorically('cMTrI0a1KkMBtTQ60AnGshkqR@gmail.com', '(111) 222-3333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Username of the email too long");
});

test('invalidates entries starting with the same alphabet characters in the email address and the same phone number after two tries', async () => {
	let result = await validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(true);

	result = await validator.byEmailAndPhoneNumberHistorically('email0002@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(true);

	result = await validator.byEmailAndPhoneNumberHistorically('anotherOne0002@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(true);

	result = await validator.byEmailAndPhoneNumberHistorically('email0003@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Repeated email and phone number detected: 2");

	result = await validator.byEmailAndPhoneNumberHistorically('email004@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Repeated email and phone number detected: 3");

	result = await validator.byEmailAndPhoneNumberHistorically('anotherOne0202@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(true);

	result = await validator.byEmailAndPhoneNumberHistorically('anotherOne022@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Repeated email and phone number detected: 2");

	result = await validator.byEmailAndPhoneNumberHistorically('email004@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Repeated email and phone number detected: 4");

	result = await validator.byEmailAndPhoneNumberHistorically('anotherOne9999902@mail.com', '(111) 222-3333');
	expect(result.isValid).toBe(false);
	expect(result.reason).toBe("Repeated email and phone number detected: 3");

	result = await validator.byEmailAndPhoneNumberHistorically('anotherOne9999902@mail.com232', '(111) 222-3333');
	expect(result.isValid).toBe(true);
});