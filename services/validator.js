export class Validator {
	constructor(database) {
		this.database = database;
	}

	isValidEmailAddress(emailAddress) {
		const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return EMAIL_REGEX.test(emailAddress);
	}

	getUserNameFromEmailAddress(emailAddress) {
		return emailAddress.substring(0, emailAddress.indexOf('@'));
	}

	isValidPhoneNumber(phoneNumber) {
		const PHONE_NUMBER_REGEX = /^\(?[0-9]{3}[\)\- ]?[ ]?[0-9]{3}[\- ]?[0-9]{4}$/;
		return PHONE_NUMBER_REGEX.test(phoneNumber);
	}

	extractAlphaNumbericPattern(text) {
		const ALPHANUMBER_REGEX = /^(?<firstPart>[a-zA-Z]{3,})(?<secondPart>[0-9]{2,})$/
		const matchResult = text.match(ALPHANUMBER_REGEX);

		return matchResult.groups;
	}

	byEmailAndPhoneNumberHistorically(emailAddress, phoneNumber) {
		if (!this.isValidEmailAddress(emailAddress) || !this.isValidPhoneNumber(phoneNumber)) return false;

		const username = this.getUserNameFromEmailAddress(emailAddress);
		if (username.length >= 24) return false;

		const usernameGoups = this.extractAlphaNumbericPattern(username);

		if (usernameGoups) {
			const key = `${usernameGoups.firstPart}|${phoneNumber}`;
			const previousEntries = this.database.getByKey(key);

			if (previousEntries === undefined) { 
				this.database.set(key, 1);
				return true;
			} else if (previousEntries < 2) {
				this.database.set(key, previousEntries + 1);
				return true;
			}
			this.database.set(key, previousEntries + 1);
			return false;
		}
		return true;
		
	}
}

export default Validator;