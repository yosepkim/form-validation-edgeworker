export default class FakeKeyValueDatabase {
	constructor () {
		this.store = {};
	}

	getByKey(key) {
		const returned = this.store[key];
		if (returned === undefined) return null;
		return returned;
	}

	set(key, value) {
		if (/[^a-zA-Z0-9\-_]/.test(key)) { 
			throw "Item is not valid. Must be 512 characters or less, consisting of A-Z a-z 0-9 _ or -";
		}
		this.store[key] = value;
	}
}