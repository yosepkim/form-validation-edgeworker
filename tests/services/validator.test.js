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

test('allows a valid email address and phone number', () => {
	let result = validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '111-222-3333');
	expect(result).toBe(true);
});

test('invalidates a malformed email address and phone number', () => {
	let result = validator.byEmailAndPhoneNumberHistorically('email0001mail.com', '111-222-3333');
	expect(result).toBe(false);

	result = validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '111-222a333');
	expect(result).toBe(false);
});

test('allows the same email address and phone number entries', () => {
	let result = validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-3333');
	expect(result).toBe(true);

	result = validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-5555');
	expect(result).toBe(true);

	result = validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-3333');
	expect(result).toBe(true);
});

test('invalidates email addresses entries with long usernames with the same phone number', () => {
	let result = validator.byEmailAndPhoneNumberHistorically('1LoGSqqulmepMdkuFpvfm3p3L@gmail.com', '(111) 222-3333');
	expect(result).toBe(false);

	result = validator.byEmailAndPhoneNumberHistorically('cMTrI0a1KkMBtTQ60AnGshkqR@gmail.com', '(111) 222-3333');
	expect(result).toBe(false);
});

test('invalidates entries with similar email address pattern and the same phone number', () => {
	let result = validator.byEmailAndPhoneNumberHistorically('email0001@mail.com', '(111) 222-3333');
	expect(result).toBe(true);

	result = validator.byEmailAndPhoneNumberHistorically('email0002@mail.com', '(111) 222-3333');
	expect(result).toBe(true);

	result = validator.byEmailAndPhoneNumberHistorically('anotherOne0002@mail.com', '(111) 222-3333');
	expect(result).toBe(true);

	result = validator.byEmailAndPhoneNumberHistorically('email0003@mail.com', '(111) 222-3333');
	expect(result).toBe(false);

	result = validator.byEmailAndPhoneNumberHistorically('email004@mail.com', '(111) 222-3333');
	expect(result).toBe(false);

	result = validator.byEmailAndPhoneNumberHistorically('anotherOne0202@mail.com', '(111) 222-3333');
	expect(result).toBe(true);

	result = validator.byEmailAndPhoneNumberHistorically('anotherOne022@mail.com', '(111) 222-3333');
	expect(result).toBe(false);

	result = validator.byEmailAndPhoneNumberHistorically('email004@mail.com', '(111) 222-3333');
	expect(result).toBe(false);

	result = validator.byEmailAndPhoneNumberHistorically('anotherOne9999902@mail.com', '(111) 222-3333');
	expect(result).toBe(false);
});