export class Extractor {
	constructor() {}

	getEmailAddress(text) {
		return this.genericMatcher(text, "email");
	}

	getPhoneNumber(text) {
		return this.genericMatcher(text, "phone");
	}

	genericMatcher(text, type) {
		const rules = { 
			"email": /wpforms\[fields\]\[1\][\\\"nr\s]+(?<email>[a-zA-Z0-9]+@[a-zA-Z0-9]+[\.][a-zA-Z]+)/,
			"phone": /wpforms\[fields\]\[3\][\\\"nr\s]+(?<phone>\(?[0-9]{3}[\)\- ]?[ ]?[0-9]{3}[\- ]?[0-9]{4})/
		}

		let matchResult = text.match(rules[type]);
        if (matchResult) {
            return matchResult.groups[type];
        }
        return "";
	}
}

export default Extractor;