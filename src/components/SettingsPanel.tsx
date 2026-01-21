import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { OptimizeOptions } from "@/features/optimize/optimize-svg";

interface SettingsPanelProps {
	settings: OptimizeOptions;
	onSettingsChange: (settings: OptimizeOptions) => void;
}

import { useId } from "react";

export function SettingsPanel({
	settings,
	onSettingsChange,
}: SettingsPanelProps) {
	const tsModeId = useId();
	const jsxOnlyId = useId();

	const update = (key: keyof OptimizeOptions, value: any) => {
		onSettingsChange({ ...settings, [key]: value });
	};

	return (
		<Card className="bg-slate-900 border-slate-800">
			<CardHeader>
				<CardTitle className="text-white">Settings</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Framework Selection */}
				<div className="space-y-2">
					<Label className="text-gray-300">Framework</Label>
					<Select
						value={settings.framework}
						onValueChange={(val) => update("framework", val)}
					>
						<SelectTrigger className="bg-slate-800 border-slate-700 text-white">
							<SelectValue placeholder="Select framework" />
						</SelectTrigger>
						<SelectContent className="bg-slate-800 border-slate-700 text-white">
							<SelectItem value="react">React</SelectItem>
							<SelectItem value="vue">Vue</SelectItem>
						</SelectContent>
					</Select>
				</div>

				{/* TypeScript Toggle */}
				<div className="flex items-center justify-between">
					<Label htmlFor={tsModeId} className="text-gray-300 cursor-pointer">
						TypeScript
					</Label>
					<Switch
						id={tsModeId}
						checked={settings.typescript}
						onCheckedChange={(checked) => update("typescript", checked)}
					/>
				</div>

				{/* JSX Only Toggle */}
				<div className="flex items-center justify-between">
					<Label htmlFor={jsxOnlyId} className="text-gray-300 cursor-pointer">
						JSX/Template Only
					</Label>
					<Switch
						id={jsxOnlyId}
						checked={settings.jsxOnly}
						onCheckedChange={(checked) => update("jsxOnly", checked)}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
