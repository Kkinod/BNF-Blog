"use client";

import React, { useRef, useEffect, useState } from "react";

interface CanvasProps {
	draw: () => void;
	fps?: number;
	establishContext?: (context: CanvasRenderingContext2D) => void;
	establishCanvasWidth?: (width: number) => void;
	width?: string | number;
	height?: string | number;
	onMouseMove?: (event: React.MouseEvent<HTMLCanvasElement>) => void;
}

export const Canvas = ({
	draw,
	fps = 20,
	establishContext,
	establishCanvasWidth,
	width = "100%",
	height = "100%",
	...rest
}: CanvasProps) => {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

	const resizeCanvas = (context: CanvasRenderingContext2D) => {
		const canvas = context.canvas;
		const { width, height } = canvas.getBoundingClientRect();

		if (canvas.width !== width || canvas.height !== height) {
			const { devicePixelRatio: ratio = 1 } = window;
			canvas.width = width * ratio;
			canvas.height = height * ratio;
			if (establishCanvasWidth) {
				establishCanvasWidth(canvas.width);
			}
			context.scale(ratio, ratio);
			return true;
		}
		return false;
	};

	useEffect(() => {
		if (canvasRef.current) {
			const canvas = canvasRef.current;
			const ctx = canvas.getContext("2d");
			if (ctx) {
				setContext(ctx);
				resizeCanvas(ctx);
				if (establishContext) {
					establishContext(ctx);
				}
			}
		} else {
			setContext(null);
		}
	}, []);

	useEffect(() => {
		let frameCount = 0;
		let animationFrameId: number, fpsInterval: number, now: number, then: number, elapsed: number;

		if (context) {
			const render = () => {
				animationFrameId = window.requestAnimationFrame(render);
				now = Date.now();
				elapsed = now - then;
				if (elapsed > fpsInterval) {
					then = now - (elapsed % fpsInterval);
					frameCount++;
					draw();
				}
			};
			const startRendering = (fps: number) => {
				fpsInterval = 1000 / fps;
				then = Date.now();
				render();
			};
			startRendering(fps);
		}
		return () => {
			window.cancelAnimationFrame(animationFrameId);
		};
	}, [draw, context, resizeCanvas]);
	return (
		<canvas
			ref={canvasRef}
			{...rest}
			style={{ backgroundColor: "black", width, height, position: "fixed" }}
		/>
	);
};
