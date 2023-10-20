export default class FakeKeyValueDatabase {
	constructor () {
		this.store = {};
	}

	getByKey(key) {
		return this.store[key];
	}

	set(key, value) {
		this.store[key] = value;
	}
}