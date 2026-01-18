/* =========================
   Regex constants
========================= */

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;
const LOWERCASE_REGEX = /[a-z]/;
const UPPERCASE_REGEX = /[A-Z]/;
const NUMBER_REGEX = /[0-9]/;
const SPECIAL_CHAR_REGEX = /[!@#$%^&*]/;

/* =========================
   Basic field validators
========================= */

export function validateName(value: string): string | null {
	if (!value || value.trim().length === 0) {
		return "Name is required";
	}
	return null;
}

export function validateEmail(value: string): string | null {
	if (!value) {
		return "Email is required";
	}

	if (!EMAIL_REGEX.test(value.trim())) {
		return "Please enter a valid email address";
	}

	return null;
}

/* =========================
   Password validators
========================= */

/**
 * Strong password validation
 * Use for sign-up, change password, reset password
 */
export function validatePassword(value: string): string | null {
	if (!value) {
		return "Password is required";
	}

	if (value.length < 8) {
		return "Password must be at least 8 characters";
	}

	if (!LOWERCASE_REGEX.test(value)) {
		return "Password must contain a lowercase letter";
	}

	if (!UPPERCASE_REGEX.test(value)) {
		return "Password must contain an uppercase letter";
	}

	if (!NUMBER_REGEX.test(value)) {
		return "Password must contain a number";
	}

	if (!SPECIAL_CHAR_REGEX.test(value)) {
		return "Password must contain a special character (!@#$%^&*)";
	}

	return null;
}

/**
 * Lightweight password validation
 * Use for sign-in
 */
export function validateSignInPassword(value: string): string | null {
	if (!value) {
		return "Password is required";
	}

	if (value.length < 8) {
		return "Password must be at least 8 characters";
	}

	return null;
}

export function validateConfirmPassword(
	value: string,
	password: string,
): string | null {
	if (!value) {
		return "Please confirm your password";
	}

	if (value !== password) {
		return "Passwords do not match";
	}

	return null;
}

/* =========================
   Password strength
========================= */

export type PasswordStrength = "Weak" | "Medium" | "Strong";

export function getPasswordStrength(value: string): PasswordStrength {
	if (!value) return "Weak";

	let score = 0;

	// Length
	if (value.length >= 8) score += 1;
	if (value.length >= 12) score += 1;

	// Character types
	if (LOWERCASE_REGEX.test(value)) score += 1;
	if (UPPERCASE_REGEX.test(value)) score += 1;
	if (NUMBER_REGEX.test(value)) score += 1;
	if (SPECIAL_CHAR_REGEX.test(value)) score += 1;

	if (score <= 3) return "Weak";
	if (score <= 5) return "Medium";
	return "Strong";
}

export function validatePasswordWithStrength(value: string): {
	error: string | null;
	strength: PasswordStrength;
} {
	return {
		error: validatePassword(value),
		strength: getPasswordStrength(value),
	};
}
