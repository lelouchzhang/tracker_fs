import { Star } from 'lucide-react';
import { searchStocks } from '@/lib/actions/finnhub.actions';
import SearchCommand from '@/components/SearchCommand';
import { WatchlistTable } from '@/components/WatchlistTable';
import { getWatchlistWithData } from '@/lib/actions/watchlist.actions';

const Watchlist = async () => {
    const watchlist = await getWatchlistWithData();
    const initialStocks = await searchStocks();

    // Empty state
    if (watchlist.length === 0) {
        return (
            <section className="flex watchlist-empty-container">
                <div className="watchlist-empty">
                    <Star className="watchlist-star" />
                    <h2 className="empty-title">你的观察列表为空</h2>
                    <p className="empty-description">
                        通过搜索股票代码或名称，将感兴趣的项目添加到观察列表中。
                    </p>
                </div>
                <SearchCommand initialStocks={initialStocks} />
            </section>
        );
    }

    return (
        <section className="watchlist">
            <div className="flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <h2 className="watchlist-title">观察列表</h2>
                    <SearchCommand initialStocks={initialStocks} />
                </div>
                {/* WatchlistTable */}
                <WatchlistTable watchlist={watchlist} />
            </div>
        </section>
    );
};

export default Watchlist;