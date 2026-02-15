import { cn } from "@/lib/utils";
import { HTMLAttributes } from "react";

interface GradientTextProps extends HTMLAttributes<HTMLSpanElement> {
    children: React.ReactNode;
    variant?: "purple-blue" | "cyan-teal" | "pink-purple" | "orange-red";
    animated?: boolean;
}

export function GradientText({
    children,
    variant = "purple-blue",
    animated = false,
    className,
    ...props
}: GradientTextProps) {
    const gradients = {
        "purple-blue": "from-purple-400 via-violet-400 to-blue-400",
        "cyan-teal": "from-cyan-400 via-teal-400 to-emerald-400",
        "pink-purple": "from-pink-400 via-purple-400 to-violet-400",
        "orange-red": "from-orange-400 via-red-400 to-pink-400",
    };

    return (
        <span
            className={cn(
                "bg-clip-text text-transparent bg-gradient-to-r",
                gradients[variant],
                animated && "gradient-animated",
                className
            )}
            {...props}
        >
            {children}
        </span>
    );
}
