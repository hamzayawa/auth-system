"use client";

import gsap from "gsap";
import { useEffect, useMemo, useRef, useState } from "react";

interface LoadingStateProps {
	text?: string;
}

export function LoadingState({ text = "YawaTech" }: LoadingStateProps) {
	const [isLoading, setIsLoading] = useState(true);

	const containerRef = useRef<HTMLDivElement>(null);
	const spinnerRef = useRef<HTMLDivElement>(null);
	const charactersRef = useRef<HTMLSpanElement[]>([]);
	const sectionLeftRef = useRef<HTMLDivElement>(null);
	const sectionRightRef = useRef<HTMLDivElement>(null);
	const preloaderRef = useRef<HTMLDivElement>(null);

	// Stable characters (no index as key)
	const characters = useMemo(
		() =>
			Array.from(text).map((char) => ({
				id: crypto.randomUUID(),
				value: char,
			})),
		[text],
	);

	// 5-second loading timer
	useEffect(() => {
		const timer = setTimeout(() => {
			setIsLoading(false);
		}, 5000);

		return () => clearTimeout(timer);
	}, []);

	// GSAP animations
	useEffect(() => {
		if (!isLoading) {
			const tl = gsap.timeline();

			tl.to(charactersRef.current, { opacity: 0, duration: 0.3 }, 0);
			tl.to(spinnerRef.current, { opacity: 0, scale: 0.8, duration: 0.3 }, 0);

			tl.to(
				sectionLeftRef.current,
				{
					xPercent: -100,
					scaleX: 0.8,
					opacity: 0,
					duration: 0.7,
					ease: "power3.inOut",
				},
				0.1,
			).to(
				sectionRightRef.current,
				{
					xPercent: 100,
					scaleX: 0.8,
					opacity: 0,
					duration: 0.7,
					ease: "power3.inOut",
				},
				0.1,
			);

			tl.set(preloaderRef.current, { pointerEvents: "none" }).set(
				preloaderRef.current,
				{ display: "none" },
			);

			return;
		}

		gsap.set(sectionLeftRef.current, {
			xPercent: 0,
			scaleX: 1,
			opacity: 1,
		});
		gsap.set(sectionRightRef.current, {
			xPercent: 0,
			scaleX: 1,
			opacity: 1,
		});

		gsap.to(spinnerRef.current, {
			rotation: 360,
			duration: 2,
			repeat: -1,
			ease: "linear",
		});

		charactersRef.current.forEach((char, index) => {
			const tl = gsap.timeline({ repeat: -1, delay: index * 0.15 });

			tl.fromTo(
				char,
				{ opacity: 0, rotationY: -90, transformOrigin: "50% 50% -20px" },
				{ opacity: 1, rotationY: 0, duration: 0.6, ease: "back.out" },
			).to(char, { opacity: 0, rotationY: 90, duration: 0.6 }, 2.4);
		});
	}, [isLoading]);

	return (
		<div
			ref={preloaderRef}
			className={`fixed inset-0 z-50 flex items-center justify-center ${
				isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<div
				ref={containerRef}
				className="relative flex h-full w-full items-center justify-center bg-black"
			>
				<div className="absolute z-10">
					<div
						ref={spinnerRef}
						className="mx-auto mb-14 h-36 w-36 rounded-full border-[10px] border-white border-t-black"
					/>

					<div className="select-none text-center text-5xl font-heading tracking-wider md:text-8xl">
						{characters.map((item, i) => (
							<span
								key={item.id}
								ref={(el) => {
									if (el) charactersRef.current[i] = el;
								}}
								className="inline-block text-white"
								style={{ perspective: "1000px" }}
							>
								{item.value}
							</span>
						))}
					</div>
				</div>

				<div
					ref={sectionLeftRef}
					className="fixed left-0 top-0 h-full w-1/2 bg-black"
					style={{ transformOrigin: "100% 50%" }}
				/>

				<div
					ref={sectionRightRef}
					className="fixed right-0 top-0 h-full w-1/2 bg-black"
					style={{ transformOrigin: "0% 50%" }}
				/>
			</div>
		</div>
	);
}
