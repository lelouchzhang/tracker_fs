"use client";
import React, { useMemo, useState } from "react";
import { addToWatchlist, removeFromWatchlist } from "@/lib/actions/watchlist.actions";
import { toast } from "sonner";
import { useDebounce } from "@/hooks/useDebounce";

const WatchlistButton = ({
    symbol,
    company,
    isInWatchlist,
    showTrashIcon = false,
    type = "button",
    onWatchlistChange,
}: WatchlistButtonProps) => {
    const [added, setAdded] = useState<boolean>(!!isInWatchlist);
    const [loading, setLoading] = useState<boolean>(false);

    const label = useMemo(() => {
        if (type === "icon") return added ? "" : "";
        return added ? "移出观察列表" : "加入观察列表";
    }, [added, type]);

    const toggleWatchlist = async () => {
        setLoading(true);
        try {
            const result = added ? await removeFromWatchlist(symbol) : await addToWatchlist(symbol, company);
            if (result.success) {
                toast.success(added ? `${symbol}已移出观察列表` : `${symbol}已加入观察列表`, {
                    description: `${company} ${added ? `已移出观察列表` : `已加入观察列表`
                        }`
                })
            }

            onWatchlistChange?.(symbol, !added)
        } catch (error) {
            console.error('Watchlist操作失败:', error);
        } finally {
            setLoading(false);
        }
    };

    const debouncedToggle = useDebounce(toggleWatchlist, 300);

    const handleClick = (e: React.MouseEvent) => {
        if (loading) return;
        e.stopPropagation();
        e.preventDefault();
        setAdded(!added)
        debouncedToggle();
    }

    if (type === "icon") {
        return (
            <button
                title={added ? `将${symbol}移出观察列表` : `将${symbol}加入观察列表`}
                aria-label={added ? `将${symbol}移出观察列表` : `将${symbol}加入观察列表`}
                className={`watchlist-icon-btn ${added ? "watchlist-icon-added" : ""}`}
                onClick={handleClick}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill={added ? "#FACC15" : "none"}
                    stroke="#FACC15"
                    strokeWidth="1.5"
                    className="watchlist-star"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.385a.563.563 0 00-.182-.557L3.04 10.385a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345l2.125-5.111z"
                    />
                </svg>
            </button>
        );
    }

    return (
        <button className={`watchlist-btn ${added ? "watchlist-remove" : ""}`} onClick={handleClick}>
            {showTrashIcon && added ? (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5 mr-2"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 7h12M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2m-7 4v6m4-6v6m4-6v6" />
                </svg>

            ) : null}
            <span>{loading ? "处理中..." : label}</span>
        </button>
    );
};

export default WatchlistButton;