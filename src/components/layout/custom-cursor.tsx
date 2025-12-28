"use client";

import gsap from "gsap";
import { useEffect, useRef } from "react";

export function CustomCursor() {
	const cursor1Ref = useRef<HTMLDivElement>(null);
	const cursor2Ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Set initial position to avoid jump
		gsap.set([cursor1Ref.current, cursor2Ref.current], {
			xPercent: -50,
			yPercent: -50,
		});

		const handleMouseMove = (event: MouseEvent) => {
			const { clientX, clientY } = event;

			// Ring (cursor1) follows with 0.15s delay
			gsap.to(cursor1Ref.current, {
				x: clientX,
				y: clientY,
				duration: 0.15,
				ease: "power2.out",
			});

			// Dot (cursor2) follows with 0.2s delay, creating trailing effect
			gsap.to(cursor2Ref.current, {
				x: clientX,
				y: clientY,
				duration: 0.2,
				ease: "power2.out",
			});
		};

		const handleMouseEnter = () => {
			gsap.to(cursor1Ref.current, { scale: 1.5, duration: 0.3 });
			gsap.to(cursor2Ref.current, { scale: 0.5, opacity: 0.5, duration: 0.3 });
		};

		const handleMouseLeave = () => {
			gsap.to(cursor1Ref.current, { scale: 1, duration: 0.3 });
			gsap.to(cursor2Ref.current, { scale: 1, opacity: 1, duration: 0.3 });
		};

		window.addEventListener("mousemove", handleMouseMove);

		const interactables = document.querySelectorAll(
			'a, button, [role="button"]',
		);
		interactables.forEach((el) => {
			el.addEventListener("mouseenter", handleMouseEnter);
			el.addEventListener("mouseleave", handleMouseLeave);
		});

		return () => {
			window.removeEventListener("mousemove", handleMouseMove);
			interactables.forEach((el) => {
				el.removeEventListener("mouseenter", handleMouseEnter);
				el.removeEventListener("mouseleave", handleMouseLeave);
			});
		};
	}, []);

	return (
		<>
			<div
				ref={cursor1Ref}
				className="cursor1 pointer-events-none fixed top-0 left-0 z-[1000] hidden xl:block"
			/>
			<div
				ref={cursor2Ref}
				className="cursor2 pointer-events-none fixed top-0 left-0 z-[1000] hidden xl:block"
			/>
		</>
	);
}
