import { createFileRoute } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Toaster, toast } from "sonner";
import { Dropzone } from "@/components/Dropzone";
import { Preview } from "@/components/Preview";
import { SettingsPanel } from "@/components/SettingsPanel";
import {
	type OptimizeOptions,
	optimizeSvg,
} from "@/features/optimize/optimize-svg";

export const Route = createFileRoute("/")({
	component: SVGComponentOptimizer,
});

function SVGComponentOptimizer() {
	const [svgContent, setSvgContent] = useState<string>("");
	const [fileName, setFileName] = useState<string>("Icon");
	const [settings, setSettings] = useState<OptimizeOptions>({
		rawSvg: "", // Will be updated
		fileName: "Icon",
		framework: "react",
		typescript: true,
		jsxOnly: false,
	});

	const [result, setResult] = useState<{
		optimizedSvg: string;
		componentCode: string;
		error?: string;
	} | null>(null);

	const [isPending, startTransition] = useTransition();

	const handleFileSelect = (content: string, name: string) => {
		setSvgContent(content);
		// Remove extension from filename
		const cleanName = name.replace(/\.svg$/i, "");
		setFileName(cleanName);
		toast.success("SVG loaded!");
	};

	// Trigger optimization when inputs change
	useEffect(() => {
		if (!svgContent) return;

		startTransition(async () => {
			const res = await optimizeSvg({
				data: {
					...settings,
					rawSvg: svgContent,
					fileName: fileName,
				},
			});

			if (res.success && res.optimizedSvg && res.componentCode) {
				setResult({
					optimizedSvg: res.optimizedSvg,
					componentCode: res.componentCode,
				});
			} else {
				setResult({
					optimizedSvg: "",
					componentCode: "",
					error: res.error,
				});
				if (res.error) toast.error(res.error);
			}
		});
	}, [svgContent, fileName, settings]);

	return (
		<div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-cyan-500/30">
			<Toaster theme="dark" position="bottom-right" />

			{/* Header */}
			<header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-10">
				<div className="container mx-auto px-6 h-16 flex items-center justify-between">
					<div className="flex items-center gap-2">
						<div className="w-8 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center font-bold text-slate-900">
							SV
						</div>
						<span className="font-bold text-lg tracking-tight">revector</span>
					</div>
					<div className="text-sm text-slate-400">SVG Component Optimizer</div>
				</div>
			</header>

			<main className="container mx-auto px-6 py-8">
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-8rem)] min-h-[600px]">
					{/* Left Column: Input & Settings */}
					<div className="lg:col-span-5 flex flex-col gap-6 h-full overflow-y-auto pr-2 custom-scrollbar">
						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-200">Input</h2>
							<Dropzone onFileSelect={handleFileSelect} />
						</div>

						<div className="space-y-4">
							<h2 className="text-xl font-semibold text-slate-200">
								Configuration
							</h2>
							<SettingsPanel
								settings={settings}
								onSettingsChange={setSettings}
							/>
						</div>
					</div>

					{/* Right Column: Output */}
					<div className="lg:col-span-7 flex flex-col h-full overflow-hidden">
						<div className="flex items-center justify-between mb-4">
							<h2 className="text-xl font-semibold text-slate-200">Output</h2>
							{isPending && (
								<div className="flex items-center gap-2 text-cyan-400 text-sm animate-pulse">
									<Loader2 className="w-4 h-4 animate-spin" />
									Optimizing...
								</div>
							)}
						</div>

						<div className="flex-1 bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-2xl">
							<Preview
								optimizedSvg={result?.optimizedSvg || ""}
								componentCode={result?.componentCode || ""}
								error={result?.error}
							/>
						</div>
					</div>
				</div>
			</main>
		</div>
	);
}
