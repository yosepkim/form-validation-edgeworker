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
		this.store[key] = value;
	}
}