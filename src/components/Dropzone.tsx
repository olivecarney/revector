import { FileCode, Upload } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface DropzoneProps {
	onFileSelect: (content: string, name: string) => void;
}

export function Dropzone({ onFileSelect }: DropzoneProps) {
	const [isDragging, setIsDragging] = useState(false);

	const handleDragOver = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(true);
	}, []);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragging(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragging(false);

			const file = e.dataTransfer.files[0];
			if (file && file.type === "image/svg+xml") {
				const reader = new FileReader();
				reader.onload = (event) => {
					if (typeof event.target?.result === "string") {
						onFileSelect(event.target.result, file.name);
					}
				};
				reader.readAsText(file);
			} else if (file) {
				// Handle non-SVG file drop attempt (optional user feedback)
				console.warn("Please drop an SVG file");
			}
		},
		[onFileSelect],
	);

	const handlePaste = useCallback(
		(e: React.ClipboardEvent) => {
			const text = e.clipboardData.getData("text");
			if (text.trim().startsWith("<svg") || text.includes("<svg")) {
				// Simple heuristic to extract SVG content
				const match = text.match(/<svg[^>]*>[\s\S]*<\/svg>/);
				if (match) {
					onFileSelect(match[0], "Pasted Icon");
				} else {
					// Fallback: try to treat the whole text as SVG if it looks like one
					onFileSelect(text, "Pasted Icon");
				}
			}
		},
		[onFileSelect],
	);

	useEffect(() => {
		const handleWindowPaste = (e: ClipboardEvent) => {
			// @ts-expect-error
			handlePaste(e as unknown as React.ClipboardEvent);
		};
		window.addEventListener("paste", handleWindowPaste);
		return () => window.removeEventListener("paste", handleWindowPaste);
	}, [handlePaste]);

	const inputId = "file-input";

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" || e.key === " ") {
			// Trigger file input click
			document.getElementById(inputId)?.click();
		}
	};

	return (
		// rome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
		<div
			role="button"
			tabIndex={0}
			onKeyDown={handleKeyDown}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
			onClick={() => document.getElementById(inputId)?.click()}
			className={cn(
				"relative border-2 border-dashed rounded-xl p-12 transition-all duration-200 ease-in-out flex flex-col items-center justify-center text-center cursor-pointer min-h-[300px] outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900",
				isDragging
					? "border-cyan-500 bg-cyan-500/10 scale-[1.01]"
					: "border-slate-700 hover:border-slate-600 bg-slate-800/50",
			)}
		>
			{/* Hidden File Input for clicking */}
			<input
				id={inputId}
				type="file"
				accept=".svg"
				className="hidden"
				onChange={(e) => {
					const file = e.target.files?.[0];
					if (file) {
						const reader = new FileReader();
						reader.onload = (event) => {
							if (typeof event.target?.result === "string") {
								onFileSelect(event.target.result, file.name);
							}
						};
						reader.readAsText(file);
					}
				}}
			/>

			<div className="p-4 bg-slate-800 rounded-full mb-4 ring-1 ring-slate-700 shadow-xl">
				{isDragging ? (
					<FileCode className="w-8 h-8 text-cyan-400 animate-pulse" />
				) : (
					<Upload className="w-8 h-8 text-gray-400" />
				)}
			</div>
			<h3 className="text-lg font-semibold text-white mb-2">
				{isDragging ? "Drop SVG here" : "Click or Drag SVG here"}
			</h3>
			<p className="text-sm text-gray-400 max-w-xs">
				Upload an .svg file or paste SVG code directly (Cmd+V)
			</p>
		</div>
	);
}
