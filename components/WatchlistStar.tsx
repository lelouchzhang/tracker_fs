// components/ui/WatchlistStar.tsx
"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface WatchlistStarProps {
    isInWatchlist: boolean;
    onToggle: () => void;
    size?: "sm" | "md" | "lg";
    className?: string;
    disabled?: boolean;
}

const sizeMap = {
    sm: "h-4 w-4",
    md: "h-5 w-5",
    lg: "h-6 w-6"
};

export default function WatchlistStar({
    isInWatchlist,
    onToggle,
    size = "md",
    className,
    disabled = false
}: WatchlistStarProps) {
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!disabled) {
            onToggle();
        }
    };

    return (
        <button
            type="button"
            onClick={handleClick}
            disabled={disabled}
            className={cn(
                "p-1 rounded-full transition-all duration-200",
                "hover:bg-yellow-50  ring-yellow-200",
                disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
                className
            )}
            aria-label={isInWatchlist ? "Remove from watchlist" : "Add to watchlist"}
        >
            <Star
                className={cn(
                    sizeMap[size],
                    "transition-colors duration-200",
                    isInWatchlist
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300 hover:text-yellow-400"
                )}
                strokeWidth={isInWatchlist ? 1.5 : 2}
            />
        </button>
    );
}
