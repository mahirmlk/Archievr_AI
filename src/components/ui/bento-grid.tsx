import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface BentoGridProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

interface BentoCardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    span?: "sm" | "md" | "lg";
    glow?: boolean;
}

export function BentoGrid({ children, className, ...props }: BentoGridProps) {
    return (
        <div
            className={cn(
                "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 auto-rows-[200px]",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}

export function BentoCard({
    children,
    span = "sm",
    glow = false,
    className,
    ...props
}: BentoCardProps) {
    const spans = {
        sm: "md:col-span-1 md:row-span-1",
        md: "md:col-span-2 md:row-span-1",
        lg: "md:col-span-2 md:row-span-2",
    };

    return (
        <div
            className={cn(
                "relative overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-xl transition-all duration-300 hover:bg-neutral-900/80 hover-lift",
                spans[span],
                glow && "hover:shadow-lg hover:shadow-purple-500/10",
                className
            )}
            {...props}
        >
            {children}
        </div>
    );
}
