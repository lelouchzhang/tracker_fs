'use server';

import { connectToDB } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

export async function getWatchlistSymbolsByEmail(email: string): Promise<string[]> {
    if (!email) return [];

    try {
        const user = await getUserByEmail(email);

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

// 辅助函数：连接数据库后，通过邮箱获取用户
async function getUserByEmail(email: string) {
    const mongoose = await connectToDB();
    const db = mongoose.connection.db;

    if (!db) throw new Error('Database connection failed');

    return await db.collection('user').findOne<{ _id?: unknown, id?: string, email?: string }>({ email });
}

// watchlist crud
export async function getWatchlistByEmail(email: string) {
    if (!email) return [];

    try {
        const user = await getUserByEmail(email);
        if (!user) return [];

        const userId = (user.id as string) || String(user._id || '')
        if (!userId) return [];

        const items = await Watchlist.find({ userId })
            .sort({ addedAt: -1 }) // 按添加时间倒序排列
            .lean();

        return items.map(item => ({
            ...item,
            _id: String(item._id),
            userId: String(item.userId),
            symbol: String(item.symbol),
            company: String(item.company),
            addedAt: new Date(item.addedAt)
        }));

    } catch (error) {
        console.error('getWatchlistByEmail error:', error);
        return [];
    }
}

export async function addToWatchlist(email: string, symbol: string, company: string) {
    if (!email) throw new Error('User email is required');

    try {
        await connectToDB();
        // 获取用户ID
        const user = await getUserByEmail(email);
        if (!user) throw new Error('User not found');
        const userId = (user.id as string) || String(user._id || '')

        // 添加watchlist项目
        await Watchlist.create({
            userId,
            symbol,
            company,
            addedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('addToWatchlist error:', error);
        throw error;
    }
}

export async function removeFromWatchlist(email: string, symbol: string) {
    if (!email) throw new Error('User email is required');

    try {
        await connectToDB();

        const user = await getUserByEmail(email);
        if (!user) throw new Error('User not found');

        const userId = (user.id as string) || String(user._id || '')

        await Watchlist.deleteOne({
            userId,
            symbol
        });

        return { success: true };
    } catch (error) {
        console.error('removeFromWatchlist error:', error);
        throw error;
    }
}

export async function isSymbolInWatchlist(email: string, symbol: string): Promise<boolean> {
    if (!email || !symbol) return false;

    try {
        const user = await getUserByEmail(email);
        if (!user) return false;

        const userId = (user.id as string) || String(user._id || '')
        if (!userId) return false;

        const item = await Watchlist.findOne({ userId, symbol }).lean();
        return !!item;

    } catch (error) {
        console.error('isSymbolInWatchlist error:', error);
        return false;
    }
}

// future if needed
// 批量添加观察列表项
export async function batchAddToWatchlist(email: string, items: { symbol: string; company: string }[]) {
    if (!email) throw new Error('User email is required');
    if (!items || items.length === 0) throw new Error('Items are required');

    try {
        await connectToDB();

        const user = await getUserByEmail(email);
        if (!user) throw new Error('User not found');
        const userId = (user.id as string) || String(user._id || '')

        // 检查重复项
        const existingSymbols = await Watchlist.find({
            userId,
            symbol: { $in: items.map(item => item.symbol.toUpperCase().trim()) }
        }).select('symbol').lean();

        const existingSymbolSet = new Set(existingSymbols.map(item => item.symbol));
        const newItems = items.filter(item => !existingSymbolSet.has(item.symbol.toUpperCase().trim()));

        if (newItems.length === 0) {
            throw new Error('All symbols already exist in watchlist');
        }

        // 批量插入
        const watchlistItems = newItems.map(item => ({
            userId,
            symbol: item.symbol.toUpperCase().trim(),
            company: item.company.trim(),
            addedAt: new Date()
        }));

        await Watchlist.insertMany(watchlistItems);

        return {
            success: true,
            addedCount: newItems.length,
            duplicateCount: items.length - newItems.length
        };
    } catch (error) {
        console.error('batchAddToWatchlist error:', error);
        throw error;
    }
}

// 清空用户的观察列表
export async function clearWatchlist(email: string) {
    if (!email) throw new Error('User email is required');

    try {
        await connectToDB();

        const user = await getUserByEmail(email);
        if (!user) throw new Error('User not found');

        const userId = (user.id as string) || String(user._id || '')

        const result = await Watchlist.deleteMany({ userId });

        return {
            success: true,
            deletedCount: result.deletedCount
        };
    } catch (error) {
        console.error('clearWatchlist error:', error);
        throw error;
    }
}