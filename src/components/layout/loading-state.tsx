"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

interface LoadingStateProps {
	isLoading?: boolean;
	text?: string;
}

export function LoadingState({
	isLoading = true,
	text = "YawaTech",
}: LoadingStateProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const spinnerRef = useRef<HTMLDivElement>(null);
	const charactersRef = useRef<HTMLSpanElement[]>([]);
	const sectionLeftRef = useRef<HTMLDivElement>(null);
	const sectionRightRef = useRef<HTMLDivElement>(null);
	const preloaderRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!isLoading) {
			const timeline = gsap.timeline();

			timeline.to(charactersRef.current, { opacity: 0, duration: 0.4 }, 0);
			timeline.to(
				spinnerRef.current,
				{ opacity: 0, scale: 0.8, duration: 0.4 },
				0,
			);

			timeline
				.to(
					sectionLeftRef.current,
					{
						scaleX: 0,
						x: "-100%",
						opacity: 0,
						duration: 0.8,
						ease: "power3.inOut",
					},
					0.2,
				)
				.to(
					sectionRightRef.current,
					{
						scaleX: 0,
						x: "100%",
						opacity: 0,
						duration: 0.8,
						ease: "power3.inOut",
					},
					0.2,
				);

			timeline.to(preloaderRef.current, { pointerEvents: "none" }, ">-0.5");
			return;
		}

		gsap.set(sectionLeftRef.current, { scaleX: 1 });
		gsap.set(sectionRightRef.current, { scaleX: 1 });

		// Spinner rotation animation
		gsap.to(spinnerRef.current, {
			rotation: 360,
			duration: 2,
			repeat: -1,
			ease: "linear",
		});

		// Character animation
		charactersRef.current.forEach((char, index) => {
			const tl = gsap.timeline({ repeat: -1, delay: index * 0.15 });
			tl.fromTo(
				char,
				{ opacity: 0, rotationY: -90, transformOrigin: "50% 50% -20px" },
				{ opacity: 1, rotationY: 0, duration: 0.6, ease: "back.out" },
				0,
			).to(char, { opacity: 0, rotationY: 90, duration: 0.6 }, 2.4);
		});
	}, [isLoading]);

	const characters = text.split("");

	return (
		<div
			ref={preloaderRef}
			id="preloader"
			className={`fixed inset-0 z-50 flex items-center justify-center ${
				isLoading ? "opacity-100" : "opacity-0 pointer-events-none"
			}`}
		>
			<div
				ref={containerRef}
				className="container-preloader relative flex h-full w-full items-center justify-center bg-black"
			>
				<div className="animation-preloader absolute z-10">
					<div
						ref={spinnerRef}
						className="mx-auto mb-14 h-36 w-36 border-[10px] border-white border-t-amber-500 rounded-full"
					/>

					<div className="txt-loading select-none text-center font-bold text-5xl md:text-8xl tracking-wider">
						{characters.map((char, index) => (
							<span
								key={index}
								ref={(el) => {
									if (el) charactersRef.current[index] = el;
								}}
								data-text={char}
								className="characters relative inline-block text-white"
								style={{ perspective: "1000px" }}
							>
								{char}
							</span>
						))}
					</div>
				</div>

				<div
					ref={sectionLeftRef}
					className="loader-section fixed left-0 top-0 h-full w-1/2 bg-black"
					style={{ transformOrigin: "100% 50%", 监测: "transform, opacity" }}
				/>

				<div
					ref={sectionRightRef}
					className="loader-section fixed right-0 top-0 h-full w-1/2 bg-black"
					style={{
						transformOrigin: "0% 50%",
						willChange: "transform, opacity",
					}}
				/>
			</div>
		</div>
	);
}
