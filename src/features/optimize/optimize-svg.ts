import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const optimizeSchema = z.object({
	rawSvg: z.string(),
	fileName: z.string().default("Icon"),
	framework: z.enum(["react", "vue"]).default("react"),
	typescript: z.boolean().default(true),
	jsxOnly: z.boolean().default(false),
});

export type OptimizeOptions = z.infer<typeof optimizeSchema>;

export const optimizeSvg = createServerFn({ method: "POST" })
	.inputValidator((data: unknown) => optimizeSchema.parse(data))
	.handler(async ({ data }: { data: OptimizeOptions }) => {
		const { rawSvg, fileName, framework, typescript, jsxOnly } = data;

		try {
			// Dynamic imports to avoid bundling in client
			const { optimize } = await import("svgo");
			const prettier = await import("prettier");

			// 1. Optimize with SVGO
			const result = optimize(rawSvg, {
				multipass: true,
				plugins: [
					"preset-default",
					"removeDimensions",
					{
						name: "addAttributesToSVGElement",
						params: {
							attributes: [{ width: "1em" }, { height: "1em" }],
						},
					},
				],
			});

			const optimizedSvg = result.data;

			// 2. Generate Component Code
			let componentCode = "";
			const componentName = toPascalCase(fileName);

			if (framework === "react") {
				componentCode = generateReactComponent(
					optimizedSvg,
					componentName,
					typescript,
					jsxOnly,
				);
			} else {
				componentCode = generateVueComponent(optimizedSvg);
			}

			// 3. Format with Prettier
			const formattedCode = await prettier.format(componentCode, {
				parser: framework === "vue" ? "vue" : "typescript",
				semi: false,
				singleQuote: true,
			});

			return {
				success: true,
				optimizedSvg,
				componentCode: formattedCode,
			};
		} catch (error) {
			console.error("Optimization error:", error);
			return {
				success: false,
				error:
					error instanceof Error ? error.message : "Unknown error occurred",
			};
		}
	});

function generateReactComponent(
	svg: string,
	name: string,
	ts: boolean,
	jsxOnly: boolean,
): string {
	// Simple injection of props
	// Replace <svg with <svg {...props}
	const svgWithProps = svg.replace(/<svg([^>]*)>/, "<svg$1 {...props}>");

	if (jsxOnly) {
		return svgWithProps;
	}

	if (ts) {
		return `import * as React from "react"
    import type { SVGProps } from "react"
    
    const ${name} = (props: SVGProps<SVGSVGElement>) => (
      ${svgWithProps}
    )
    
    export default ${name}`;
	}

	return `import * as React from "react"
  
  const ${name} = (props) => (
    ${svgWithProps}
  )
  
  export default ${name}`;
}

function generateVueComponent(svg: string): string {
	return `<template>
  ${svg}
</template>`;
}

function toPascalCase(str: string): string {
	return (
		str
			.replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
				index === 0 ? word.toUpperCase() : word.toUpperCase(),
			)
			.replace(/\s+/g, "")
			.replace(/[^a-zA-Z0-9]/g, "") || "Icon"
	);
}
