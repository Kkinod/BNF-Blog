"use client";

import React, { useState } from "react";
import { Canvas } from "./components/Canvas";

export const MatrixBackground = () => {
	const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
	const [canvasWidth, setCanvasWidth] = useState<number | null>(null);

	const establishContext = (context: CanvasRenderingContext2D) => {
		setCtx(context);
	};

	const establishCanvasWidth = (width: number) => {
		setCanvasWidth(width);
	};

	const chars = "L34ndr0CaladoFullStackDeveloperWithFrontEndMBA/|ANGULAR?REACT?Vue";
	const letters = chars.split("");

	const fontSize = 12;
	const columns = canvasWidth ? canvasWidth / fontSize : 28;

	const drops: number[] = [];
	for (let i = 0; i < columns; i++) {
		drops[i] = 1;
	}

	const convertMousePosToRowsAndCols = (x: number, y: number) => {
		const col = Math.floor(x / fontSize);
		const row = ctx?.canvas ? Math.min(Math.ceil(y / fontSize), Math.floor(ctx.canvas.height)) : 0;
		return { row, col };
	};

	let disturbanceRow = -1;
	let disturbanceCol = -1;
	let timeout: ReturnType<typeof setTimeout>;

	const disturbanceEffect = (e: React.MouseEvent<HTMLCanvasElement>) => {
		clearTimeout(timeout);
		const bounds = e.currentTarget.getBoundingClientRect();
		const x = e.clientX - bounds.left;
		const y = e.clientY - bounds.top;
		const { row, col } = convertMousePosToRowsAndCols(x, y);
		disturbanceRow = row;
		disturbanceCol = col;
		timeout = setTimeout(() => {
			disturbanceRow = -1;
			disturbanceCol = -1;
		}, 50);
	};

	const isDisturbanceAffectedPosition = (dropIndex: number) => {
		return drops[dropIndex] * fontSize > disturbanceRow && dropIndex === disturbanceCol;
	};

	const draw = () => {
		if (ctx) {
			ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
			ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
			for (let i = 0; i < drops.length; i++) {
				const text = letters[Math.floor(Math.random() * letters.length)];

				const brightness = Math.random();
				if (brightness > 0.98) {
					ctx.fillStyle = "#0ff";
				} else if (brightness > 0.93) {
					ctx.fillStyle = "#0f0";
				} else {
					ctx.fillStyle = "#050";
				}

				ctx.fillText(text, i * fontSize, drops[i] * fontSize);
				drops[i]++;
				if (drops[i] * fontSize > ctx.canvas.height && Math.random() > 0.95) {
					drops[i] = 0;
				}
				if (isDisturbanceAffectedPosition(i)) {
					const h = Math.max(i - 1, 0);
					const j = Math.min(i + 1, Math.floor(columns));
					drops[h] = disturbanceRow;
					drops[i] = disturbanceRow;
					drops[j] = disturbanceRow;
				}
			}
		}
	};

	return (
		<Canvas
			draw={draw}
			onMouseMove={disturbanceEffect}
			establishContext={establishContext}
			establishCanvasWidth={establishCanvasWidth}
		/>
	);
};
