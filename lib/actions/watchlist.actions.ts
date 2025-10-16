'use server';

import { connectToDB } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const mongooose = await connectToDB();
        const db = mongooose.connection.db;

        if (!db) throw new Error('数据库连接失败');

        const user = await db.collection('user').findOne<{ _id?: unknown, id?: string, email?: string }>({
            email: email,
        })
        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '')
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1 }).lean();
        return items.map((item) => String(item.symbol));

    } catch (error) {
        console.error('getWatchlistSymbolsByEmail occurs error:', error)
        return [];
    }
}