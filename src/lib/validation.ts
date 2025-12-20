export function validateName(value: string): string | null {
	if (!value || value.trim().length < 1) {
		return "Name is required";
	}
	return null;
}

// export function validateLastName(value: string): string | null {
//   if (!value || value.trim().length < 1) {
//     return "Last name is required"
//   }
//   return null
// }

// export function validateUsername(value: string): string | null {
//   if (!value) {
//     return "Username is required"
//   }
//   if (value.length < 3) {
//     return "Username must be at least 3 characters"
//   }
//   return null
// }

export function validateEmail(value: string): string | null {
	if (!value) {
		return "Email is required";
	}
	const emailRegex = /\S+@\S+\.\S+/;
	if (!emailRegex.test(value)) {
		return "Please enter a valid email address";
	}
	return null;
}

export function validatePassword(value: string): string | null {
	if (!value) {
		return "Password is required";
	}
	if (value.length < 8) {
		return "Password must be at least 8 characters";
	}
	if (!/[a-z]/.test(value)) {
		return "Password must contain a lowercase letter";
	}
	if (!/[A-Z]/.test(value)) {
		return "Password must contain an uppercase letter";
	}
	if (!/[0-9]/.test(value)) {
		return "Password must contain a number";
	}
	if (!/[!@#$%^&*]/.test(value)) {
		return "Password must contain a special character (!@#$%^&*)";
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

export type PasswordStrength = "Weak" | "Medium" | "Strong";

export function getPasswordStrength(value: string): PasswordStrength {
	let score = 0;

	if (!value) return "Weak";

	// Length
	if (value.length >= 8) score += 1;
	if (value.length >= 12) score += 1;

	// Character types
	if (/[a-z]/.test(value)) score += 1;
	if (/[A-Z]/.test(value)) score += 1;
	if (/[0-9]/.test(value)) score += 1;
	if (/[!@#$%^&*]/.test(value)) score += 1;

	// Determine strength
	if (score <= 3) return "Weak";
	if (score <= 5) return "Medium";
	return "Strong";
}

export function validatePasswordWithStrength(value: string): {
	error: string | null;
	strength: PasswordStrength;
} {
	const error = validatePassword(value);
	const strength = getPasswordStrength(value);
	return { error, strength };
}
