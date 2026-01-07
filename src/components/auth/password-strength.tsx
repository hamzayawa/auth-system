"use client";

import { CheckIcon, XIcon } from "lucide-react";

interface PasswordStrengthProps {
	password: string;
}

interface StrengthResult {
	score: number;
	label: string;
	message: string;
	color: string;
	bgColor: string;
}

export function PasswordStrength({ password }: PasswordStrengthProps) {
	const evaluatePasswordStrength = (password: string): StrengthResult => {
		if (!password) {
			return {
				score: 0,
				label: "",
				message: "",
				color: "",
				bgColor: "",
			};
		}

		let score = 0;
		const checks = {
			length: password.length >= 8,
			longLength: password.length >= 12,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			numbers: /\d/.test(password),
			symbols: /[!@#$%^&*(),.?":{}|<>]/.test(password),
			noCommon: !isCommonPassword(password),
			noPersonal: !hasPersonalInfo(password),
		};

		// Scoring system
		if (checks.length) score += 1;
		if (checks.longLength) score += 1;
		if (checks.lowercase) score += 1;
		if (checks.uppercase) score += 1;
		if (checks.numbers) score += 1;
		if (checks.symbols) score += 1;
		if (checks.noCommon) score += 1;
		if (checks.noPersonal) score += 1;

		// Determine strength level
		if (score <= 2) {
			return {
				score: 1,
				label: "Very Weak",
				message: "Too weak – avoid using common or short passwords.",
				color: "#ef4444",
				bgColor: "#fef2f2",
			};
		} else if (score <= 4) {
			return {
				score: 2,
				label: "Weak",
				message: "Weak – needs to be longer and include a mix of characters.",
				color: "#f97316",
				bgColor: "#fff7ed",
			};
		} else if (score <= 5) {
			return {
				score: 3,
				label: "Moderate",
				message: "Moderate – try adding symbols or upper/lowercase mix.",
				color: "#eab308",
				bgColor: "#fefce8",
			};
		} else if (score <= 6) {
			return {
				score: 4,
				label: "Strong",
				message: "Strong – good job! Your password is hard to guess.",
				color: "#22c55e",
				bgColor: "#f0fdf4",
			};
		} else {
			return {
				score: 5,
				label: "Very Strong",
				message: "Very strong – your password meets all best practices.",
				color: "#16a34a",
				bgColor: "#f0fdf4",
			};
		}
	};

	const isCommonPassword = (password: string): boolean => {
		const commonPasswords = [
			"123456",
			"password",
			"qwerty",
			"abc123",
			"letmein",
			"welcome",
			"admin",
			"login",
			"master",
			"hello",
			"guest",
			"user",
			"test",
			"password123",
			"123456789",
			"qwerty123",
			"1234567890",
			"12345678",
			"654321",
			"87654321",
		];
		return commonPasswords.includes(password.toLowerCase());
	};

	const hasPersonalInfo = (password: string): boolean => {
		const personalPatterns = [
			/hamza/i,
			/sokoto/i,
			/nigeria/i,
			/mydogname/i,
			/birthday/i,
			/\d{4}/, // Years like 2020, 2023
			/name/i,
			/love/i,
			/family/i,
		];
		return personalPatterns.some((pattern) => pattern.test(password));
	};

	const strength = evaluatePasswordStrength(password);

	if (!password) return null;

	return (
		<div className="password-strength-container">
			{/* Strength Bar */}
			<div className="strength-bar-container">
				<div className="strength-bar-background">
					<div
						className="strength-bar-fill"
						style={{
							width: `${(strength.score / 5) * 100}%`,
							backgroundColor: strength.color,
						}}
					/>
				</div>
				<span className="strength-label" style={{ color: strength.color }}>
					{strength.label}
				</span>
			</div>

			{/* Strength Message */}
			<div
				className="strength-message"
				style={{
					backgroundColor: strength.bgColor,
					borderColor: strength.color,
					color: strength.color,
				}}
			>
				{strength.message}
			</div>

			{/* Requirements Checklist */}
			<div className="requirements-list">
				<RequirementItem
					met={password.length >= 8}
					text="At least 8 characters"
				/>
				<RequirementItem
					met={/[a-z]/.test(password)}
					text="One lowercase letter"
				/>
				<RequirementItem
					met={/[A-Z]/.test(password)}
					text="One uppercase letter"
				/>
				<RequirementItem met={/\d/.test(password)} text="One number" />
				<RequirementItem
					met={/[!@#$%^&*(),.?":{}|<>]/.test(password)}
					text="One special character"
				/>
				<RequirementItem
					met={password.length >= 12}
					text="12+ characters (recommended)"
				/>
			</div>
		</div>
	);
}

interface RequirementItemProps {
	met: boolean;
	text: string;
}

function RequirementItem({ met, text }: RequirementItemProps) {
	return (
		<div className={`requirement-item ${met ? "met" : "unmet"}`}>
			<span className="requirement-icon">
				{met ? (
					<CheckIcon className="w-3 h-3" />
				) : (
					<XIcon className="w-3 h-3" />
				)}
			</span>
			<span className="requirement-text">{text}</span>
		</div>
	);
}
