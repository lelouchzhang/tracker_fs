'use server';

import { connectToDB } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';
import { auth } from '../better-auth/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { success } from 'better-auth';
import { getStocksDetails } from './finnhub.actions';

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
// @disparate 废弃，使用session.user代替
async function getUserByEmail(email: string) {
    const mongoose = await connectToDB();
    const db = mongoose.connection.db;

    if (!db) throw new Error('Database connection failed');

    return await db.collection('user').findOne<{ _id?: unknown, id?: string, email?: string }>({ email });
}

// watchlist crud
export async function getWatchlist() {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session?.user) redirect('/sign-in');
        const items = await Watchlist.find({ userId: session.user.id })
            .sort({ addedAt: -1 }) // 按添加时间倒序排列
            .lean();

        return JSON.parse(JSON.stringify(items))

    } catch (error) {
        console.error('getWatchlistByEmail error:', error);
        throw new Error('Failed to get watchlist');
    }
}

export const addToWatchlist = async (symbol: string, company: string) => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        // Check if stock already exists in watchlist
        const existingItem = await Watchlist.findOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
        });

        if (existingItem) {
            return { success: false, error: 'Stock already in watchlist' };
        }

        // Add to watchlist
        const newItem = new Watchlist({
            userId: session.user.id,
            symbol: symbol.toUpperCase(),
            company: company.trim(),
        });

        await newItem.save();
        revalidatePath('/watchlist');

        return { success: true, message: 'Stock added to watchlist' };
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw new Error('Failed to add stock to watchlist');
    }
};

export async function removeFromWatchlist(symbol: string) {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        })
        if (!session?.user) redirect('/sign-in')

        await Watchlist.deleteOne({
            userId: session.user.id,
            symbol: symbol.toUpperCase()
        })
        revalidatePath('/watchlist')
        return { success: true, message: "Stock removed from watchlist" }
    } catch (error) {
        console.error('removeFromWatchlist error:', error);
        throw new Error('Failed to remove stock from watchlist');
    }
}

export const getWatchlistWithData = async () => {
    try {
        const session = await auth.api.getSession({
            headers: await headers(),
        });
        if (!session?.user) redirect('/sign-in');

        const watchlist = await Watchlist.find({ userId: session.user.id }).sort({ addedAt: -1 }).lean();

        if (watchlist.length === 0) return [];

        const stocksWithData = await Promise.all(
            watchlist.map(async (item) => {
                const stockData = await getStocksDetails(item.symbol);

                if (!stockData) {
                    console.warn(`Failed to fetch data for ${item.symbol}`);
                    return item;
                }

                return {
                    company: stockData.company,
                    symbol: stockData.symbol,
                    currentPrice: stockData.currentPrice,
                    priceFormatted: stockData.priceFormatted,
                    changeFormatted: stockData.changeFormatted,
                    changePercent: stockData.changePercent,
                    marketCap: stockData.marketCapFormatted,
                    peRatio: stockData.peRatio,
                };
            }),
        );

        return JSON.parse(JSON.stringify(stocksWithData));
    } catch (error) {
        console.error('Error loading watchlist:', error);
        throw new Error('Failed to fetch watchlist');
    }
};

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