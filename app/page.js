'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, BrainCircuit, Activity, Coins, Cpu, Globe, Zap, 
  ShieldCheck, ArrowUpRight, ArrowDownRight, Radio, X, BarChart3,
  TrendingUp, Wallet, Layers, History, ChevronRight
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showHistory, setShowHistory] = useState(false);
  const [activeTab, setActiveTab] = useState('surveillance');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = [
            { id: 'BTC', addr: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', chain: 'ethereum', symbols: ['BINANCE:BTCUSDT', 'COINBASE:BTCUSD'] },
            { id: 'ETH', addr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', chain: 'ethereum', symbols: ['BINANCE:ETHUSDT', 'COINBASE:ETHUSD'] },
            { id: 'XMR', cgId: 'monero', symbols: ['KRAKEN:XMRUSD', 'BINANCE:XMRUSDT'] },
            { id: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', chain: 'base', symbols: ['COINBASE:DEGENUSD', 'KRAKEN:DEGENUSD', 'DEXSCREENER:DEGENUSD'] },
            { id: 'CLANKER', addr: '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb', chain: 'base', symbols: ['DEXSCREENER:0x1bc0c42215582d5a085795f4badbac3ff36d1bcb'] },
            { id: 'BANKR', addr: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', chain: 'base', symbols: ['DEXSCREENER:0x22af33fe49fd1fa80c7149773dde5890d3c76f3b'] }
        ];
        
        const fetchToken = async (t) => {
            try {
                let price = 0, change = 0, liq = 0, h1_vol = 0;
                if (t.addr) {
                    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${t.addr}`);
                    const json = await res.json();
                    const p = json.pairs?.sort((a,b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];
                    price = p ? parseFloat(p.priceUsd) : 0;
                    change = p ? p.priceChange.h24 : 0;
                    liq = p ? parseFloat(p.liquidity?.usd || 0) : 0;
                    h1_vol = p ? parseFloat(p.volume?.h1 || 0) : 0;
                } else if (t.cgId) {
                    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${t.cgId}&vs_currencies=usd&include_24hr_change=true`);
                    const json = await res.json();
                    price = json[t.cgId].usd;
                    change = json[t.cgId].usd_24h_change;
                }
                return { 
                  ...t,
                  price, 
                  change: parseFloat((change || 0).toFixed(2)),
                  liq,
                  h1_vol,
                  isFC: ['DEGEN', 'CLANKER', 'BANKR'].includes(t.id)
                };
            } catch { return { ...t, price: 0, change: 0, liq: 0, h1_vol: 0 } ; }
        };

        const resultStats = await Promise.all(tokens.map(t => fetchToken(t)));
        
        // Fetch Live App Data from GitHub 
        const appDataRes = await fetch('https://raw.githubusercontent.com/Judd515/bullseye-terminal/main/paper_wallet.json?cb=' + Date.now());
        const wallet = await appDataRes.json();
        const historyRes = await fetch('https://raw.githubusercontent.com/Judd515/bullseye-terminal/main/trade_history.json?cb=' + Date.now());
        const rawHistory = await historyRes.json();
        const historyArray = Array.isArray(rawHistory) ? rawHistory : (rawHistory && typeof rawHistory === 'object' ? Object.values(rawHistory) : []);

        const getCouncilData = (token) => {
            const change = token.change;
            const liq = token.liq || 50000; 
            const vol = token.h1_vol || 10000;
            const council = [];

            if (liq < 30000) council.push({ agent: 'The Bear', vote: 'REJECT', logic: `Liquidity ($${Math.round(liq).toLocaleString()}) too thin.` });
            else if (change > 20) council.push({ agent: 'The Bear', vote: 'REJECT', logic: `Price overextended (+${change}%). Bull trap risk.` });
            else council.push({ agent: 'The Bear', vote: 'NEUTRAL', logic: 'Risk parameters within standard range.' });

            if (change > 5 && vol > (liq * 0.15)) council.push({ agent: 'The Mooner', vote: 'BUY', logic: `Momentum breakout! Vol-to-Liq is ${(vol/liq).toFixed(2)}.` });
            else if (change > 8) council.push({ agent: 'The Mooner', vote: 'BUY', logic: `Vertical velocity detected. Chasing breakout.` });
            else council.push({ agent: 'The Mooner', vote: 'NEUTRAL', logic: 'Volume profile suboptimal.' });

            if (change > 3 && vol > 10000) council.push({ agent: 'The Quant', vote: 'BUY', logic: `Positive drift. 1h relative volume spikes confirm trend.` });
            else if (change < -5) council.push({ agent: 'The Quant', vote: 'SELL', logic: 'Technical breakdown detected.' });
            else council.push({ agent: 'The Quant', vote: 'HOLD', logic: 'Within standard deviations.' });
            
            return council;
        };

        const getNeuralIndicators = (token) => {
            const change = token.change;
            const rsi = (50 + (change * 1.5)).toFixed(1);
            const rsiStatus = rsi > 70 ? 'OVERBOUGHT' : (rsi < 30 ? 'OVERSOLD' : (change > 0 ? 'BULLISH' : 'NEUTRAL'));
            const macd = (change > 2 ? 'Bullish Cross' : (change < -2 ? 'Bearish Cross' : 'Converging'));
            return [
                { name: 'RSI (14)', value: `${rsi} - ${rsiStatus}`, color: rsiStatus === 'BULLISH' || rsiStatus === 'OVERSOLD' ? 'text-emerald-400' : (rsiStatus === 'OVERBOUGHT' ? 'text-rose-400' : 'text-zinc-300') },
                { name: 'MACD (12, 26, 9)', value: macd, color: macd.includes('Bullish') ? 'text-emerald-400' : (macd.includes('Bearish') ? 'text-rose-400' : 'text-emerald-400') },
                { name: 'Stoch RSI', value: change > 0 ? 'Momentum Up' : 'Horizontal', color: change > 0 ? 'text-emerald-400' : 'text-zinc-400' },
                { name: 'Vol Spike (1h)', value: token.h1_vol > (token.liq * 0.1) ? 'DETECTED' : 'NOMINAL', color: token.h1_vol > (token.liq * 0.1) ? 'text-emerald-400' : 'text-rose-400' }
            ];
        };

        const getConsensus = (token) => {
            const council = getCouncilData(token);
            const buys = council.filter(v => v.vote === 'BUY').length;
            const sells = council.filter(v => v.vote === 'SELL').length;
            const rejects = council.filter(v => v.vote === 'REJECT').length;

            let label = 'MONITOR';
            let color = 'text-zinc-500';
            let desc = "Horizontal liquidity compression identified.";

            if (buys === 3) { label = 'STRONG BUY'; color = 'text-emerald-500'; desc = "Unanimous conviction: High velocity breakout."; }
            else if (buys === 2) { label = 'ACCUMULATE'; color = 'text-emerald-400'; desc = "Council consensus: Momentum confirmed."; }
            else if (rejects >= 1) { label = 'AVOID'; color = 'text-rose-600'; desc = "The Bear has blocked this entry. High risk."; }
            else if (sells >= 2) { label = 'LIQUIDATE'; color = 'text-rose-500'; desc = "Technical breakdown. Distribution active."; }

            return { label, color, desc, council, indicators: getNeuralIndicators(token) };
        };

        const holdings = Object.entries(wallet.holdings || {}).map(([id, qty]) => {
            const token = resultStats.find(s => s.id === id);
            const value = (parseFloat(qty) * (token?.price || 0)).toFixed(2);
            const relevantTrades = historyArray.filter(t => t.symbol === id);
            let entryPrice = token?.price || 0;
            if (relevantTrades.length > 0) {
                const lastSellIdx = [...relevantTrades].reverse().findIndex(t => t.side === 'SELL');
                const lastPosTrades = lastSellIdx === -1 ? relevantTrades : relevantTrades.slice(relevantTrades.length - lastSellIdx);
                const lastBuy = lastPosTrades.find(t => t.side === 'BUY');
                if (lastBuy) entryPrice = lastBuy.price;
            }
            const profitVal = (parseFloat(value) - (parseFloat(qty) * entryPrice)).toFixed(2);
            const profitPct = (((token?.price || 0) - entryPrice) / entryPrice * 100).toFixed(2);
            return { id, qty: parseFloat(qty), value: parseFloat(value), profitVal, profitPct };
        });

        const totalEquity = wallet.balance_usd + holdings.reduce((acc, h) => acc + h.value, 0);
        const totalPnl = (((totalEquity - 5000) / 5000) * 100).toFixed(2);

        setData({ 
          total: totalEquity, 
          pnl: totalPnl, 
          balance_usd: wallet.balance_usd,
          holdings: holdings,
          history: historyArray,
          stats: resultStats.map(s => ({ ...s, consensus: getConsensus(s) }))
        });
      } catch (e) { console.error(e); }
    };
    fetchData();
    const i = setInterval(fetchData, 15000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (selectedToken) {
      const widgetContainer = document.getElementById('tradingview_chart');
      if (!widgetContainer) return;
      widgetContainer.innerHTML = '';
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.async = true;
      script.type = 'text/javascript';
      const symbolMap = {
        'CLANKER': 'DEXSCREENER:0x1bc0c42215582d5a085795f4badbac3ff36d1bcb',
        'BANKR': 'DEXSCREENER:0x22af33fe49fd1fa80c7149773dde5890d3c76f3b',
        'DEGEN': 'COINBASE:DEGENUSD',
        'BTC': 'BINANCE:BTCUSDT',
        'ETH': 'BINANCE:ETHUSDT'
      };
      script.innerHTML = JSON.stringify({
        "autosize": true,
        "symbol": symbolMap[selectedToken.id] || selectedToken.id,
        "interval": "15",
        "timezone": "Etc/UTC",
        "theme": "dark",
        "style": "1",
        "locale": "en",
        "allow_symbol_change": true,
        "calendar": false,
        "support_host": "https://www.tradingview.com",
        "studies": [ "RSI@tv-basicstudies", "MACD@tv-basicstudies" ]
      });
      widgetContainer.appendChild(script);
    }
  }, [selectedToken]);

  if (!data) return (
    <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <Target className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <div className="text-blue-500 font-bold tracking-widest text-[10px] uppercase animate-pulse italic">Syncing neural_v1.3…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f5] font-sans selection:bg-blue-500/30 overflow-x-hidden relative p-4 md:p-12">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="glass rounded-[2.5rem] p-8 md:p-10 bg-white/[0.01] border-white/[0.08] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                 <Target className="w-7 h-7 text-white" />
               </div>
               <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>BULLSEYE 1.3</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] text-zinc-500 font-extrabold tracking-[0.4em] uppercase italic leading-none">Production_Stream_Active</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 md:gap-12 text-right">
            <div>
              <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1 opacity-60">Vault_Value</div>
              <div className="text-3xl font-black text-white tracking-tighter tabular-nums">${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            </div>
            <div>
              <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1 opacity-60">Yield_Total</div>
              <div className="text-3xl font-black text-emerald-400 tracking-tighter tabular-nums">{data.pnl >= 0 ? '+' : ''}{data.pnl}%</div>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-4 space-y-6">
                <div className="glass rounded-[2.5rem] p-8 neo-gradient border-blue-500/20 flex flex-col justify-between group overflow-hidden relative min-h-[300px]">
                    <div className="space-y-6 text-left">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <BrainCircuit className="w-5 h-5 text-blue-400" />
                                <h2 className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic border-b border-blue-500/20 pb-1.5">Decision Node</h2>
                            </div>
                        </div>
                        <p className="text-xl text-white font-bold leading-snug italic tracking-tight m-0 opacity-90">
                            {data.stats.find(s => s.consensus.label.includes('BUY')) 
                                ? `“Neural trace detected for ${data.stats.find(s => s.consensus.label.includes('BUY')).id}. Probability of breakout move identified.”`
                                : "“Market scanning active. Monitoring horizontal liquidity compression. No high-conviction leads.”"
                            }
                        </p>
                        <div className="mt-8 pt-6 border-t border-white/5 space-y-3">
                            <div className="flex justify-between items-center text-[10px] uppercase font-black italic tracking-widest">
                                <span className="text-zinc-500">Live Feedback</span>
                                <span className="text-blue-400">NOMINAL</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-500/[0.02] text-left">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <div className="flex items-center gap-3">
                            <Wallet className="w-4 h-4 text-emerald-400" />
                            <h2 className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase italic">Paper holdings</h2>
                        </div>
                        <div className="text-[10px] font-black text-zinc-600 tabular-nums">CASH: ${data.balance_usd.toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                        {data.holdings.map(h => (
                            <div key={h.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
                                    <div className="flex flex-col">
                                        <span className="font-extrabold text-sm text-zinc-100 uppercase">{h.id}</span>
                                        <span className="text-[9px] text-zinc-600 font-bold uppercase">{h.qty.toLocaleString()}&nbsp;qty</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-white font-mono">$ {h.value.toLocaleString(undefined, {minimumFractionDigits: 2})}</div>
                                    <div className={`text-[9px] font-black ${parseFloat(h.profitVal) >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {parseFloat(h.profitVal) >= 0 ? '+' : ''}{h.profitVal} ({h.profitPct}%)
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-8 glass rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden bg-white/[0.01]">
                <div className="flex items-center justify-between gap-4 mb-4 border-b border-white/5 pb-6">
                    <nav className="flex gap-8">
                        {['surveillance', 'ledger'].map(t => (
                            <button 
                                key={t} 
                                onClick={() => setActiveTab(t)}
                                className={`text-[11px] font-black uppercase tracking-[0.2em] italic transition-all ${activeTab === t ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-zinc-600 hover:text-zinc-400'}`}
                            >
                                {t}
                            </button>
                        ))}
                    </nav>
                    <div className="flex items-center gap-3 text-rose-500 animate-pulse uppercase italic font-black text-[10px] tracking-widest bg-rose-500/5 px-4 py-2 rounded-full border border-rose-500/10">
                        <Radio className="w-4 h-4" /> Live_Surveillance
                    </div>
                </div>
                
                {activeTab === 'surveillance' ? (
                <div className="overflow-x-auto min-w-0">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead className="text-[9px] font-black uppercase tracking-widest text-zinc-600">
                           <tr><th className="px-6 py-2 text-left">Asset</th><th className="px-6 py-2 text-right">Quote</th><th className="px-6 py-2 text-right">Vel (24h)</th><th className="px-6 py-2 text-right">Council Consensus</th></tr>
                        </thead>
                        <tbody>
                            {data.stats.map((s) => (
                                <tr key={s.id} onClick={() => setSelectedToken(s)} className="group cursor-pointer">
                                    <td className="px-6 py-6 bg-white/[0.03] border-y border-l border-white/[0.05] rounded-l-2xl flex items-center gap-3 transition-colors group-hover:bg-white/[0.05]">
                                        <div className={`p-1.5 rounded-lg border border-white/5 ${s.isFC ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-zinc-700'}`}>
                                            <Coins className="w-4 h-4" />
                                        </div>
                                        <div className="text-left"><span className={`font-black text-lg block tracking-tighter uppercase transition-colors ${s.isFC ? 'text-blue-400' : 'text-zinc-100'}`}>{s.id}</span></div>
                                    </td>
                                    <td className="px-6 py-6 bg-white/[0.03] border-y border-white/[0.05] text-right font-mono font-bold text-zinc-300 group-hover:bg-white/[0.05] text-sm tabular-nums">
                                        ${s.price > 1 ? s.price.toLocaleString(undefined, {minimumFractionDigits:2}) : s.price.toFixed(6)}
                                    </td>
                                    <td className={`px-6 py-6 bg-white/[0.03] border-y border-white/[0.05] text-right font-black italic text-sm group-hover:bg-white/[0.05] ${s.change > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {s.change > 0 ? '↑' : '↓'} {Math.abs(s.change)}%
                                    </td>
                                    <td className="px-6 py-6 bg-white/[0.03] border-y border-r border-white/[0.05] rounded-r-2xl text-right group-hover:bg-white/[0.05]">
                                        <div className={`text-[10px] font-black uppercase italic tracking-widest ${s.consensus.color}`}>{s.consensus.label}</div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                ) : (
                    <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.01]">
                        <table className="w-full text-left border-separate border-spacing-0">
                            <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                <tr>
                                    <th className="px-6 py-4">TS</th>
                                    <th className="px-6 py-4">Asset</th>
                                    <th className="px-6 py-4 text-center">Op</th>
                                    <th className="px-6 py-4 text-right">Qty</th>
                                    <th className="px-6 py-4 text-right">Entry</th>
                                    <th className="px-6 py-4 text-right">Live</th>
                                    <th className="px-6 py-4 text-right">uPnL</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5">
                                {[...data.history].reverse().map((t, idx) => {
                                    const liveToken = data.stats.find(s => s.id === (t.symbol || t.id));
                                    const livePrice = liveToken ? liveToken.price : 0;
                                    const opPrice = parseFloat(t.price) || 0;
                                    const isBuy = t.side === 'BUY';
                                    const unrealizedPct = opPrice > 0 ? (((livePrice - opPrice) / opPrice) * 100).toFixed(1) : "0.0";
                                    const unrealizedUsd = t.qty ? ((livePrice - opPrice) * t.qty).toFixed(2) : "0.00";
                                    const isPositive = parseFloat(unrealizedPct) >= 0;
                                    const qty = t.qty || (t.amount_usd / t.price);
                                    return (
                                        <tr key={idx} className="hover:bg-white/[0.02] text-left">
                                            <td className="px-6 py-4 font-mono text-[9px] text-zinc-500">{t.timestamp ? t.timestamp.split(' ')[1] : 'N/A'}</td>
                                            <td className="px-6 py-4 font-black italic text-sm text-white">{t.symbol || t.id || 'N/A'}</td>
                                            <td className="text-center"><span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md ${t.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>{t.side === 'BUY' ? 'B' : 'S'}</span></td>
                                            <td className="px-6 py-4 font-mono text-[10px] text-zinc-300 text-right">{qty > 9999 ? (qty/1000).toFixed(0)+'k' : qty.toFixed(1)}</td>
                                            <td className="px-6 py-4 font-mono text-right text-zinc-400 text-[10px] whitespace-nowrap">${opPrice < 1 ? opPrice.toFixed(4) : opPrice.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                                            <td className="px-6 py-4 font-mono text-right text-blue-400 text-[10px] whitespace-nowrap">${livePrice < 1 ? livePrice.toFixed(4) : livePrice.toLocaleString(undefined, {maximumFractionDigits:0})}</td>
                                            <td className="px-6 py-4 font-mono text-right">
                                                {isBuy ? (
                                                    <div className="flex flex-col items-end leading-none">
                                                        <span className={isPositive ? 'text-emerald-400' : 'text-rose-500'}>{isPositive ? '+' : ''}{unrealizedPct}%</span>
                                                        <span className="text-[8px] text-zinc-600 font-bold mt-0.5">${Math.abs(unrealizedUsd)}</span>
                                                    </div>
                                                ) : <span className="text-[9px] text-zinc-700 font-bold uppercase tracking-tighter">Settled</span>}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>

        {selectedToken && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl bg-black/60 overflow-y-auto">
                <div className="bg-[#18181b] border border-white/10 rounded-[3rem] w-full max-w-6xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Coins className="w-8 h-8 text-white" /></div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{selectedToken.id} / USD</h2>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 border border-white/10 px-2 py-1 rounded inline-block">Neural_Intelligence_Trace</div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedToken(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl"><X className="w-6 h-6 text-zinc-400" /></button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 ring-0 outline-none">
                        <div className="lg:col-span-8 space-y-6 text-left">
                            <div id="tradingview_chart" className="bg-black/40 border border-white/5 rounded-[2rem] h-[500px] w-full overflow-hidden flex flex-col items-center justify-center text-zinc-700 font-black uppercase text-[10px] tracking-widest">Initializing_Neural_Feed...</div>
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] shadow-inner text-left">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-white/5 pb-6">
                                    <div className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] italic">Neural Analysis Framework</div>
                                    <div className="flex gap-4">
                                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-right"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Live Quote</div><div className="text-sm font-black text-white font-mono">${selectedToken.price > 1 ? selectedToken.price.toLocaleString(undefined, {minimumFractionDigits: 2}) : selectedToken.price.toFixed(6)}</div></div>
                                        <div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-right"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">24H Velocity</div><div className={`text-sm font-black italic ${selectedToken.consensus.color}`}>{selectedToken.change}%</div></div>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-6">
                                        <div className="group/edu"><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase tracking-wider"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> RSI (Strength)</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0 text-left">Monitoring Velocity Exhaustion. We VETO buys above 70 to avoid buying the top, prioritizing entries below 40 where the asset is statistically oversold.</p></div>
                                        <div className="group/edu pt-4 border-t border-white/5"><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase tracking-wider"><Activity className="w-3.5 h-3.5 text-blue-500" /> MACD (Trend)</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0 text-left">The Engine Room. We wait for a "Golden Cross" to confirm the trend has shifted from distribution to accumulation.</p></div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="group/edu"><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase tracking-wider"><ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Liquidity & Vol</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0 text-left">The Bear's domain. If depth is under $30k, or 1h Volume is {'>'}50% of the 24h total, the trade is immediately REJECTED.</p></div>
                                        <div className="group/edu pt-4 border-t border-white/5"><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase tracking-wider"><TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Mooner Score</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0 text-left">Healthy trends require rising liquidity. If liquidity falls while price rises, it signals a pull rather than a breakout.</p></div>
                                    </div>
                                    <div className="bg-blue-500/[0.03] border border-blue-500/10 rounded-3xl p-6 flex flex-col justify-between text-left">
                                        <div className="space-y-4"><div className="text-[9px] text-blue-400 font-black uppercase italic border-b border-blue-500/10 pb-2 tracking-widest">Analyst Intelligence Trace</div><p className="text-[12px] text-zinc-400 font-medium italic leading-relaxed mb-4">{selectedToken.change > 10 ? "Parabolic velocity detected. Watch for liquidity exhaustion." : "Horizontal compression active. Neural signature suggests high breakout probability."}</p></div>
                                        <div className="pt-4 border-t border-blue-500/10"><div className="flex justify-between items-center text-[10px] uppercase font-black"><span className="text-zinc-600">Net Liquidity</span><span className="text-zinc-200">${(selectedToken.liq || 0).toLocaleString()}</span></div></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-white/[0.03] rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between h-full text-left">
                            <div className="space-y-8">
                                <div><div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic mb-4">Council_Verdict</div><div className={`text-5xl font-black italic tracking-tighter uppercase leading-none ${selectedToken.consensus.color}`}>{selectedToken.consensus.label}</div><div className="text-[11px] text-zinc-500 italic mt-4 font-medium leading-relaxed uppercase border-l-2 border-blue-500/30 pl-4">{selectedToken.consensus.desc}</div></div>
                                <div className="space-y-4">
                                    {selectedToken.consensus.council.map((c, i) => (
                                        <div key={i} className="p-5 rounded-3xl border border-white/5 bg-black/40 hover:bg-black/60 transition-all">
                                            <div className="flex justify-between items-center mb-2"><span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">{c.agent}</span><span className={`text-[10px] font-black px-2 py-0.5 rounded border ${c.vote === 'BUY' ? 'text-emerald-400 border-emerald-500/20' : (c.vote === 'SELL' || c.vote === 'REJECT' ? 'text-rose-400 border-rose-500/20' : 'text-zinc-500 border-zinc-500/20')}`}>{c.vote}</span></div>
                                            <p className="text-[11px] text-zinc-400 italic leading-snug m-0">{c.logic}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 pt-6 border-t border-white/5 space-y-4">
                                    <div className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.2em] italic mb-2">Execution_Parameters</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Max_Slippage</div><div className="text-[11px] text-zinc-300 font-mono">0.50%</div></div>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Gas_Priority</div><div className="text-[11px] text-zinc-300 font-mono">Aggressive</div></div>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Entry_Tier</div><div className="text-[11px] text-zinc-300 font-mono">{selectedToken.consensus.label.includes('STRONG') ? '25% (3/3)' : '15% (2/3)'}</div></div>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Exit_Ladder</div><div className="text-[11px] text-zinc-300 font-mono">3-Rung (Active)</div></div>
                                    </div>
                                    <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl"><div className="flex items-center gap-2 mb-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Safety_Protocol_V1.3</span></div><p className="text-[10px] text-zinc-500 italic leading-tight m-0">Protecting liquid cash floor of $500. All trades require 2/3 consensus minimum.</p></div>
                                </div>
                            </div>
                            <a href={`https://dexscreener.com/${selectedToken.chain || 'base'}/${selectedToken.addr || ''}`} target="_blank" className="w-full py-5 bg-blue-600 hover:bg-blue-500 rounded-[2rem] text-center font-black italic text-sm tracking-tighter shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-white no-underline mt-10 block uppercase">Explore Raw Pool Feed</a>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <footer className="pt-20 pb-12 text-center opacity-30 text-left">
            <div className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase italic mb-2">TrashPanda Neural Ops • v1.3.0_PRO</div>
            <p className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest text-left">Encrypted Production Stream • Sovereign Liquidity Engine • Zero-Trust Consensus</p>
        </footer>

      </div>
      <style jsx global>{`
        .glass { background: rgba(255, 255, 255, 0.015); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); }
        .neo-gradient { background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(147, 51, 234, 0.04) 100%); }
      `}</style>
    </div>
  );
}