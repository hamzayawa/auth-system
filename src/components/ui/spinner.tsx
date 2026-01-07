import { LoaderIcon } from "lucide-react";
import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
	return (
		<LoaderIcon
			aria-hidden="true"
			className={cn("size-4 animate-spin", className)}
			{...props}
		/>
	);
}

export function SpinnerCustom() {
	return (
		<output
			aria-live="polite"
			aria-label="Loading"
			className="flex items-center gap-2"
		>
			<Spinner />
		</output>
	);
}
