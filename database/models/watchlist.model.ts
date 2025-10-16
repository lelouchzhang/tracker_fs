import { Document, model, models, Schema } from 'mongoose';

export interface WatchlistItem extends Document {
    userId: string;
    symbol: string;
    company: string;
    addedAt: Date;
}

const watchlistSchema = new Schema<WatchlistItem>({
    userId: {
        type: String,
        required: true,
        index: true
    },
    symbol: {
        type: String,
        required: true,
        uppercase: true,
        trim: true
    },
    company: {
        type: String,
        required: true,
        trim: true
    },
    addedAt: {
        type: Date,
        default: Date.now
    }
});

// 复合索引：确保用户不能重复添加同一股票
watchlistSchema.index({ userId: 1, symbol: 1 }, { unique: true });

export const Watchlist = models?.Watchlist || model<WatchlistItem>('Watchlist', watchlistSchema);