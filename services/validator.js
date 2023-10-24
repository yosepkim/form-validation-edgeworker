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

		return (matchResult === null) ? null : matchResult.groups;
	}

	async byEmailAndPhoneNumberHistorically(emailAddress, phoneNumber) {
		if (!this.isValidEmailAddress(emailAddress)) {
			return this.buildResponse(false, "Invalid email");
		}
		if (!this.isValidPhoneNumber(phoneNumber)) {
			return this.buildResponse(false, "Invalid phone");
		}
		const username = this.getUserNameFromEmailAddress(emailAddress);
		if (username.length >= 24) {
			return this.buildResponse(false, "Username of the email too long");
		}

		const usernameGroups = this.extractAlphaNumbericPattern(username);

		if (usernameGroups) {
			const key = `${usernameGroups.firstPart}-${phoneNumber}`;
			const previousEntries = await this.database.getByKey(key);

			if (previousEntries === null) { 
				this.database.set(key, "1");
				return this.buildResponse(true, "");
			}

			const currentCount = parseInt(previousEntries);
			if (currentCount < 2) {
				this.database.set(key, currentCount + 1);
				return this.buildResponse(true, "");
			}

			this.database.set(key, currentCount + 1);
			return this.buildResponse(false, `Repeated email and phone number detected: ${previousEntries}`);
		}
		return this.buildResponse(true, "");
		
	}
	buildResponse(isValid, reason) {
		return {
			isValid: isValid,
			reason: reason
		}
	}
}

export default Validator;