"use client";

interface LoadingSpinnerProps {
	className?: string;
	barColor?: string;
	size?: number; // overall spinner diameter in px
	barWidth?: number; // width of each bar in px
	barLength?: number; // length of each bar in px
	numBars?: number;
	animationDuration?: number; // in seconds
}

export function LoadingSpinner({
	className,
	barColor = "white", // Default to white as per the image
	size = 24,
	barWidth = 2,
	barLength = 6,
	numBars = 12,
	animationDuration = 1.2,
}: LoadingSpinnerProps) {
	const bars = Array.from({ length: numBars }).map((_, i) => {
		const rotation = (360 / numBars) * i;
		const delay = (animationDuration / numBars) * i;

		return (
			<div
				key={`bar-${rotation}`}
				className="absolute"
				style={{
					width: `${barWidth}px`,
					height: `${barLength}px`,
					backgroundColor: barColor,
					borderRadius: "1px",
					left: `calc(50% - ${barWidth / 2}px)`,
					top: `calc(50% - ${barLength / 2}px)`,
					transform: `rotate(${rotation}deg) translateY(-${size / 2 - barLength / 2}px)`,
					transformOrigin: "center center",
					animation: `spinner-fade ${animationDuration}s linear infinite`,
					animationDelay: `${delay}s`,
				}}
			/>
		);
	});

	return (
		<div
			className={`relative flex items-center justify-center ${className}`}
			style={{ width: `${size}px`, height: `${size}px` }}
		>
			{bars}
		</div>
	);
}
