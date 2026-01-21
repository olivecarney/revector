import { AlertCircle, Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PreviewProps {
	optimizedSvg: string;
	componentCode: string;
	error?: string;
}

export function Preview({ optimizedSvg, componentCode, error }: PreviewProps) {
	const [copied, setCopied] = useState(false);

	const handleCopy = async () => {
		await navigator.clipboard.writeText(componentCode);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	if (error) {
		return (
			<Card className="bg-red-900/10 border-red-900/50">
				<CardContent className="flex flex-col items-center justify-center p-8 text-red-400">
					<AlertCircle className="w-12 h-12 mb-4" />
					<p className="font-semibold text-center">{error}</p>
				</CardContent>
			</Card>
		);
	}

	if (!optimizedSvg) {
		return (
			<div className="h-full flex items-center justify-center text-gray-500 border border-dashed border-slate-700 rounded-xl bg-slate-900/50 p-12">
				<p>Preview will appear here</p>
			</div>
		);
	}

	return (
		<div className="flex flex-col h-full space-y-4">
			<Tabs defaultValue="visual" className="w-full flex-1 flex flex-col">
				<div className="flex items-center justify-between mb-2">
					<TabsList className="bg-slate-800 text-gray-400">
						<TabsTrigger
							value="visual"
							className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
						>
							Visual
						</TabsTrigger>
						<TabsTrigger
							value="code"
							className="data-[state=active]:bg-slate-700 data-[state=active]:text-white"
						>
							Code
						</TabsTrigger>
					</TabsList>
					<Button
						size="sm"
						variant="outline"
						className="bg-slate-800 border-slate-700 hover:bg-slate-700 text-white gap-2"
						onClick={handleCopy}
					>
						{copied ? (
							<Check size={16} className="text-green-400" />
						) : (
							<Copy size={16} />
						)}
						{copied ? "Copied" : "Copy Code"}
					</Button>
				</div>

				<TabsContent value="visual" className="flex-1 mt-0">
					<Card className="h-full bg-slate-900/50 border-slate-800 flex items-center justify-center p-8 overflow-hidden min-h-[300px]">
						{/* 
              Safe to render here because it comes from our server function 
              (though in prod we might want to sanitize further if we didn't trust svgo) 
            */}
						<div
							className="w-full h-full flex items-center justify-center [&>svg]:max-w-full [&>svg]:max-h-full [&>svg]:w-auto [&>svg]:h-auto text-white"
							dangerouslySetInnerHTML={{ __html: optimizedSvg }}
						/>
					</Card>
				</TabsContent>

				<TabsContent
					value="code"
					className="flex-1 mt-0 relative min-h-[300px]"
				>
					<Card className="h-full bg-[#1e1e1e] border-slate-800 overflow-hidden">
						<div className="absolute inset-0 overflow-auto p-4">
							<pre className="text-sm font-mono text-gray-300">
								{componentCode}
							</pre>
						</div>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
