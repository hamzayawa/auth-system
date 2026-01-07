"use client";

import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useState } from "react";

interface AnimatedInputProps {
	id: string;
	type: string;
	label: string;
	value: string;

	onChange?: (value: string) => void; // ✅ OPTIONAL
	onBlur?: () => void;

	error?: string;
	required?: boolean;
	disabled?: boolean;

	showToggle?: boolean;
	showPassword?: boolean;
	onTogglePassword?: () => void;
}

export function AnimatedInput({
	id,
	type,
	label,
	value,
	onChange,
	onBlur,
	error,
	required,
	disabled,
	showToggle,
	showPassword,
	onTogglePassword,
}: AnimatedInputProps) {
	const [isFocused, setIsFocused] = useState(false);

	const handleFocus = () => {
		if (!disabled) setIsFocused(true);
	};

	const handleBlur = () => {
		if (!disabled) {
			setIsFocused(false);
			onBlur?.();
		}
	};

	const isActive = isFocused || value.trim() !== "" || Boolean(disabled);

	return (
		<div className="form-control font-aeonik relative">
			<input
				id={id}
				type={type}
				value={value}
				disabled={disabled}
				required={required}
				onChange={(e) => onChange?.(e.target.value)}
				onFocus={handleFocus}
				onBlur={handleBlur}
				className={`animated-input ${
					disabled ? "opacity-60 cursor-not-allowed" : ""
				}`}
				autoComplete={type === "password" ? "new-password" : "off"}
				autoCorrect="off"
				autoCapitalize="none"
				spellCheck={false}
			/>

			<label
				htmlFor={id}
				className={`animated-label ${
					isActive ? "active" : ""
				} ${disabled ? "text-muted-foreground" : ""}`}
			>
				{label.split("").map((char, index) => (
					<span
						key={`${index}-${char}`}
						style={{ transitionDelay: `${index * 50}ms` }}
					>
						{char === " " ? "\u00A0" : char}
					</span>
				))}
			</label>

			{showToggle && value.trim() !== "" && !disabled && (
				<button
					type="button"
					className="show-hide-btn"
					onClick={onTogglePassword}
				>
					{showPassword ? (
						<EyeOffIcon className="w-4 h-4" />
					) : (
						<EyeIcon className="w-4 h-4" />
					)}
				</button>
			)}

			{error && !disabled && <span className="error-feedback">{error}</span>}
		</div>
	);
}
