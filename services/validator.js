export class Validator {
	constructor(database) {
		this.database = database;
	}

	isValidEmailAddress(emailAddress) {
		const EMAIL_REGEX = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
		return EMAIL_REGEX.test(emailAddress);
	}

	isValidPhoneNumber(phoneNumber) {
		const PHONE_NUMBER_REGEX = /^\(?[0-9]{3}[\)\- ]?[ ]?[0-9]{3}[\- ]?[0-9]{4}$/;
		return PHONE_NUMBER_REGEX.test(phoneNumber);
	}

	getUserNameAndDomainFromEmailAddress(emailAddress) {
		const parts = emailAddress.split('@');
		return {
			username: parts[0],
			domain: parts[1]
		}
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
		const emailParts = this.getUserNameAndDomainFromEmailAddress(emailAddress);
		if (emailParts.username.length >= 24) {
			return this.buildResponse(false, "Username of the email too long");
		}

		const usernameGroups = this.extractAlphaNumbericPattern(emailParts.username);

		if (usernameGroups) {
			const key = this.buildEdgeKVKey(usernameGroups.firstPart, emailParts.domain, phoneNumber);
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
	buildEdgeKVKey(usernameAlphabetPart, emailDomain, phoneNumber) {
		return `${usernameAlphabetPart}-${emailDomain}-${phoneNumber}`.replaceAll(/[^a-zA-Z0-9-_]/g, '-')
	}
}

export default Validator;