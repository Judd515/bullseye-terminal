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
            { id: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', chain: 'base', symbols: ['COINBASE:DEGENUSD', 'KRAKEN:DEGENUSD'] },
            { id: 'CLANKER', addr: '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb', chain: 'base', symbols: ['BITGET:CLANKERUSDT', 'DEXSCREENER:0x1bc0c42215582d5a085795f4badbac3ff36d1bcb'] },
            { id: 'BANKR', addr: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', chain: 'base', symbols: ['MEXC:BANKRUSDT', 'DEXSCREENER:0x22af33fe49fd1fa80c7149773dde5890d3c76f3b'] }
        ];
        
        const fetchToken = async (t) => {
            try {
                let price = 0, change = 0, liq = 0, h1_vol = 0;
                
                // Force XMR to CoinGecko
                if (t.id === 'XMR') {
                    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=monero&vs_currencies=usd&include_24hr_change=true`);
                    const json = await res.json();
                    price = json.monero.usd;
                    change = json.monero.usd_24h_change;
                    liq = 50000000;
                } else if (t.addr) {
                    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${t.addr}`);
                    const json = await res.json();
                    const p = json.pairs?.sort((a,b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];
                    price = p ? parseFloat(p.priceUsd) : 0;
                    change = p ? p.priceChange.h24 : 0;
                    liq = p ? parseFloat(p.liquidity?.usd || 0) : 0;
                    h1_vol = p ? parseFloat(p.volume?.h1 || 0) : 0;
                }
                return { ...t, price, change: parseFloat((change || 0).toFixed(2)), liq, h1_vol, isFC: ['DEGEN', 'CLANKER', 'BANKR'].includes(t.id) };
            } catch { return { ...t, price: 0, change: 0, liq: 0, h1_vol: 0 } ; }
        };

        const resultStats = await Promise.all(tokens.map(t => fetchToken(t)));
        const appDataRes = await fetch('https://raw.githubusercontent.com/Judd515/bullseye-terminal/main/paper_wallet.json?cb=' + Date.now());
        const wallet = await appDataRes.json();
        const historyRes = await fetch('https://raw.githubusercontent.com/Judd515/bullseye-terminal/main/trade_history.json?cb=' + Date.now());
        const rawHistory = await historyRes.json();
        const historyArray = Array.isArray(rawHistory) ? rawHistory : (rawHistory && typeof rawHistory === 'object' ? Object.values(rawHistory) : []);

        const getCouncilData = (token) => {
            const ch = token.change;
            const l = token.liq || 50000;
            const v = token.h1_vol || 10000;
            const council = [];
            if (l < 30000) council.push({ agent: 'The Bear', vote: 'REJECT', logic: 'Liquidity thin.' });
            else if (ch > 20) council.push({ agent: 'The Bear', vote: 'REJECT', logic: 'Vertical overextension.' });
            else council.push({ agent: 'The Bear', vote: 'NEUTRAL', logic: 'Stable risk.' });
            if (ch > 5) council.push({ agent: 'The Mooner', vote: 'BUY', logic: 'Breakout detectable.' });
            else council.push({ agent: 'The Mooner', vote: 'NEUTRAL', logic: 'Low velocity.' });
            if (ch > 3) council.push({ agent: 'The Quant', vote: 'BUY', logic: 'Positive drift.' });
            else if (ch < -5) council.push({ agent: 'The Quant', vote: 'SELL', logic: 'Distribution.' });
            else council.push({ agent: 'The Quant', vote: 'HOLD', logic: 'Drift-neutral.' });
            return council;
        };

        const getConsensus = (token) => {
            const council = getCouncilData(token);
            const buys = council.filter(v => v.vote === 'BUY').length;
            const rejects = council.filter(v => v.vote === 'REJECT').length;
            let label = 'MONITOR'; let color = 'text-zinc-500'; let desc = "Consolidation.";
            if (buys === 3) { label = 'STRONG BUY'; color = 'text-emerald-500'; desc = "Unanimous conviction."; }
            else if (buys === 2) { label = 'ACCUMULATE'; color = 'text-emerald-400'; desc = "Consensus breakout."; }
            else if (rejects >= 1) { label = 'AVOID'; color = 'text-rose-600'; desc = "Bear VETO."; }
            return { label, color, desc, council, indicators: [] };
        };

        const holdings = Object.entries(wallet.holdings || {}).map(([id, qty]) => {
            const token = resultStats.find(s => s.id === id);
            const value = (parseFloat(qty) * (token?.price || 0)).toFixed(2);
            const relevantTrades = historyArray.filter(t => t.symbol === id);
            let entryPrice = 0;
            if (relevantTrades.length > 0) {
                const lastSellIdx = [...relevantTrades].reverse().findIndex(t => t.side === 'SELL');
                const lastPosTrades = lastSellIdx === -1 ? relevantTrades : relevantTrades.slice(relevantTrades.length - lastSellIdx);
                const lastBuy = lastPosTrades.find(t => t.side === 'BUY');
                if (lastBuy) entryPrice = lastBuy.price;
            }
            const currentPrice = token?.price || 0;
            const pVal = entryPrice > 0 ? (parseFloat(value) - (parseFloat(qty) * entryPrice)).toFixed(2) : "0.00";
            const pPct = entryPrice > 0 ? ((currentPrice - entryPrice) / entryPrice * 100).toFixed(2) : "0.00";
            return { id, qty: parseFloat(qty), value: parseFloat(value), profitVal: pVal, profitPct: pPct, entryPrice };
        });

        const totalEquity = wallet.balance_usd + holdings.reduce((acc, h) => acc + h.value, 0);
        setData({ 
          total: totalEquity, pnl: (((totalEquity - 5000) / 5000) * 100).toFixed(2), balance_usd: wallet.balance_usd,
          holdings: holdings, history: historyArray, 
          stats: resultStats.map(s => ({ ...s, consensus: getConsensus(s) })) 
        });
      } catch (e) { console.error(e); }
    };
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedToken) {
      const widgetContainer = document.getElementById('tradingview_chart');
      if (widgetContainer) {
          widgetContainer.innerHTML = '';
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
          script.async = true;
          const symbolMap = {'BANKR':'MEXC:BANKRUSDT','CLANKER':'GATEIO:CLANKERUSDT','DEGEN':'COINBASE:DEGENUSD','BTC':'BINANCE:BTCUSDT','ETH':'BINANCE:ETHUSDT','XMR':'KRAKEN:XMRUSD'};
          script.innerHTML = JSON.stringify({"autosize":true,"symbol":symbolMap[selectedToken.id] || selectedToken.id,"interval":"15","timezone":"Etc/UTC","theme":"dark","style":"1","locale":"en","allow_symbol_change":true,"calendar":false,"support_host":"https://www.tradingview.com","studies":["RSI@tv-basicstudies","MACD@tv-basicstudies"]});
          widgetContainer.appendChild(script);
      }
    }
  }, [selectedToken]);

  if (!data) return <div className="min-h-screen bg-[#020203] flex items-center justify-center text-blue-500 font-black animate-pulse uppercase tracking-[0.5em]">Syncing_BullsEye_v1.3</div>;

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f5] font-sans p-4 md:p-12 relative overflow-x-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        <header className="glass rounded-[2.5rem] p-8 md:p-10 bg-white/[0.01] border-white/[0.08] flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20"><Target className="w-7 h-7 text-white" /></div>
               <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">BULLSEYE 1.3</h1>
            </div>
            <div className="flex items-center gap-3"><div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-emerald-500/50" /><span className="text-[9px] text-zinc-500 font-extrabold tracking-[0.4em] uppercase">Production_Active</span></div>
          </div>
          <div className="grid grid-cols-2 gap-8 text-right">
            <div><div className="text-[10px] text-zinc-500 font-extrabold uppercase mb-1">Vault_Value</div><div className="text-3xl font-black text-white tracking-tighter tabular-nums">${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}</div></div>
            <div><div className="text-[10px] text-zinc-500 font-extrabold uppercase mb-1">Yield_Total</div><div className="text-3xl font-black text-emerald-400 tracking-tighter tabular-nums">{data.pnl}%</div></div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
            <div className="lg:col-span-4 space-y-6">
                <div className="glass rounded-[2.5rem] p-8 neo-gradient border-blue-500/20 flex flex-col justify-between min-h-[300px]">
                    <div><h2 className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic border-b border-blue-500/20 pb-2 mb-6">Decision Node</h2>
                    <p className="text-xl text-white font-bold leading-snug italic tracking-tight m-0 opacity-90 text-left">"Monitoring horizontal liquidity compression. Evaluating neural traces across active surveillance pool."</p></div>
                </div>
                <div className="glass rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4"><h2 className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase italic">Paper holdings</h2><div className="text-[10px] font-black text-zinc-600 tabular-nums">${data.balance_usd.toLocaleString()} Cash</div></div>
                    <div className="space-y-3 scrollbar-hide max-h-[300px] overflow-y-auto">{data.holdings.map(h => (
                        <div key={h.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                            <div className="text-left"><span className="font-extrabold text-sm text-zinc-100 uppercase block">{h.id}</span><span className="text-[9px] text-zinc-600 font-bold">{h.qty.toLocaleString()} qty</span></div>
                            <div className="text-right"><div className="text-sm font-black text-white font-mono">$ {h.value.toLocaleString(undefined, {minimumFractionDigits:2})}</div><div className={`text-[9px] font-black ${parseFloat(h.profitVal) >= 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{parseFloat(h.profitVal) >= 0 ? '+' : ''}{h.profitVal} ({h.profitPct}%)</div></div>
                        </div>
                    ))}</div>
                </div>
            </div>

            <div className="lg:col-span-8 glass rounded-[3rem] p-8 space-y-6 bg-white/[0.01]">
                <nav className="flex gap-8 mb-4 border-b border-white/5 pb-6">
                    {['surveillance', 'ledger'].map(t => (<button key={t} onClick={() => setActiveTab(t)} className={`text-[11px] font-black uppercase tracking-[0.2em] italic ${activeTab === t ? 'text-blue-400 border-b-2 border-blue-400 pb-1' : 'text-zinc-600'}`}>{t}</button>))}
                </nav>
                
                {activeTab === 'surveillance' ? (
                <div className="overflow-x-auto"><table className="w-full text-left border-separate border-spacing-y-3">
                    <thead className="text-[9px] font-black text-zinc-600 uppercase"><tr><th>Asset</th><th className="text-right">Quote</th><th className="text-right">Vel (24h)</th><th className="text-right">Consensus</th></tr></thead>
                    <tbody>{data.stats.map((s) => (
                        <tr key={s.id} onClick={() => setSelectedToken(s)} className="group cursor-pointer">
                            <td className="px-6 py-6 bg-white/[0.03] border-y border-l border-white/5 rounded-l-2xl flex items-center gap-3 transition-all group-hover:bg-white/[0.1]"><div className="p-2 border border-white/5 rounded-lg bg-zinc-900 group-hover:text-blue-400 transition-colors"><Coins className="w-4 h-4" /></div><span className="font-black text-lg block transition-colors group-hover:text-blue-400">{s.id}</span></td>
                            <td className="px-6 py-6 bg-white/[0.03] border-y border-white/5 text-right font-mono font-bold text-zinc-300 tabular-nums">${s.price > 1 ? s.price.toLocaleString(undefined, {minimumFractionDigits:2}) : s.price.toFixed(6)}</td>
                            <td className={`px-6 py-6 bg-white/[0.03] border-y border-white/5 text-right font-black italic ${s.change > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{s.change > 0 ? '↑' : '↓'} {Math.abs(s.change)}%</td>
                            <td className="px-6 py-6 bg-white/[0.03] border-y border-r border-white/5 rounded-r-2xl text-right transition-colors group-hover:bg-white/[0.1]">
                                <div className={`text-[10px] font-black uppercase italic tracking-widest ${s.consensus.color}`}>{s.consensus.label}</div>
                                <div className="flex justify-end gap-1.5 mt-2">{s.consensus.council.map((c, idx) => (
                                    <div key={idx} className={`w-1.5 h-1.5 rounded-full shadow-inner ${c.vote === 'BUY' ? 'bg-emerald-500 shadow-emerald-500/50' : (c.vote === 'SELL' || c.vote === 'REJECT' ? 'bg-rose-500 shadow-rose-500/50' : 'bg-zinc-700')}`} />
                                ))}</div>
                            </td>
                        </tr>
                    ))}</tbody>
                </table></div>
                ) : (
                <div className="overflow-x-auto"><table className="w-full text-left border-separate border-spacing-0">
                    <thead className="bg-white/5 text-[9px] font-black text-zinc-500 uppercase"><tr><th className="px-4 py-4">TS</th><th className="px-4 py-4">Asset</th><th className="px-4 py-4 text-center">Op</th><th className="px-4 py-4 text-right">Qty</th><th className="px-4 py-4 text-right">Entry</th><th className="px-4 py-4 text-right">Live</th><th className="px-4 py-4 text-right">uPnL</th></tr></thead>
                    <tbody className="divide-y divide-white/5 border-spacing-0">{[...data.history].reverse().map((t, idx) => {
                        const s = data.stats.find(st => st.id === (t.symbol || t.id));
                        const lp = s ? s.price : 0; const ep = parseFloat(t.price) || 1;
                        const q = t.qty || (parseFloat(t.amount_usd) / ep);
                        const pct = (((lp - ep) / ep) * 100).toFixed(1); const usd = (q * (lp - ep)).toFixed(2);
                        return (
                            <tr key={idx} className="hover:bg-white/[0.02]">
                                <td className="px-4 py-4 font-mono text-[9px] text-zinc-500 whitespace-nowrap">{t.timestamp ? t.timestamp.split(' ')[1] : 'N/A'}</td>
                                <td className="px-4 py-4 font-black italic text-sm text-white uppercase">{t.symbol || t.id || 'N/A'}</td>
                                <td className="text-center font-black"><span className={t.side === 'BUY' ? 'text-emerald-400' : 'text-rose-400'}>{t.side === 'BUY' ? 'B' : 'S'}</span></td>
                                <td className="px-4 py-4 font-mono text-[10px] text-zinc-300 text-right">{q > 9999 ? (q/1000).toFixed(0)+'k' : q.toFixed(1)}</td>
                                <td className="px-4 py-4 font-mono text-right text-zinc-400 text-[10px]">${ep < 1 ? ep.toFixed(4) : ep.toLocaleString()}</td>
                                <td className="px-4 py-4 font-mono text-right text-blue-500 text-[10px] shadow-blue-500/10">${lp < 1 ? lp.toFixed(4) : lp.toLocaleString()}</td>
                                <td className="px-4 py-4 font-mono text-right">{t.side === 'BUY' ? (<div className="flex flex-col items-end leading-none"><span className={parseFloat(pct) >= 0 ? 'text-emerald-400' : 'text-rose-500'}>{parseFloat(pct) >= 0 ? '+' : ''}{pct}%</span><span className="text-[8px] text-zinc-600 font-bold mt-1">${usd}</span></div>) : <span className="text-[9px] text-zinc-700 uppercase tracking-tighter font-bold">Settled</span>}</td>
                            </tr>
                        );
                    })}</tbody>
                </table></div>
                )}
            </div>
        </div>

        {selectedToken && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 backdrop-blur-xl bg-black/60 overflow-y-auto">
                <div className="bg-[#18181b] border border-white/10 rounded-[3rem] w-full max-w-6xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden text-left">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg"><Coins className="w-8 h-8 text-white" /></div>
                            <div><h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none">{selectedToken.id} / USD</h2><div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 border border-white/10 px-2 py-1 rounded inline-block">Neural_Trace_Intelligence</div></div>
                        </div>
                        <button onClick={() => setSelectedToken(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors"><X className="w-6 h-6 text-zinc-400" /></button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 scrollbar-hide">
                        <div className="lg:col-span-8 space-y-6">
                            <div id="tradingview_chart" className="bg-black/40 border border-white/5 rounded-[2rem] h-[500px] w-full flex items-center justify-center font-black uppercase text-[10px] tracking-widest text-zinc-700">Loading_Secure_Feed...</div>
                            <div className="bg-white/[0.02] border border-white/5 p-8 rounded-[2.5rem] shadow-inner text-left">
                                <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-6"><div><div className="text-[10px] text-blue-400 font-black uppercase tracking-[0.2em] italic">Neural Analysis Framework</div></div><div className="px-4 py-2 bg-white/5 rounded-xl border border-white/5 text-right"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Live Quote</div><div className="text-sm font-black text-white font-mono">${selectedToken.price > 1 ? selectedToken.price.toLocaleString() : selectedToken.price.toFixed(6)}</div></div></div>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="space-y-6"><div><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase"><TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> RSI (Strength)</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0">VETO buys {'>'}70 to avoid tops. Prioritizing entries {'<'}40 where statistically oversold.</p></div><div className="pt-4 border-t border-white/5"><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase"><Activity className="w-3.5 h-3.5 text-blue-500" /> MACD (Trend)</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0">Wait for "Golden Cross" to confirm trend shift from distribution to accumulation.</p></div></div>
                                    <div className="space-y-6"><div><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase"><ShieldCheck className="w-3.5 h-3.5 text-rose-500" /> Liquidity & Vol</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0">If depth {'<'} $30k, or (1h Vol / 24h Vol) {'>'} 50%, trade is immediately REJECTED.</p></div><div className="pt-4 border-t border-white/5"><div className="text-[10px] text-zinc-100 font-bold flex items-center gap-2 mb-2 uppercase"><TrendingUp className="w-3.5 h-3.5 text-purple-400" /> Mooner Score</div><p className="text-[11px] text-zinc-500 italic leading-relaxed m-0">Healthy trends are accompanied by rising liquidity. Fading liquidity on price rise signals exit.</p></div></div>
                                    <div className="bg-blue-500/[0.03] border border-blue-500/10 rounded-3xl p-6 flex flex-col justify-between"><div><div className="text-[9px] text-blue-400 font-black uppercase italic border-b border-blue-500/10 pb-2 tracking-widest mb-4 uppercase">Intelligence Trace</div><p className="text-[12px] text-zinc-400 font-medium italic leading-relaxed">{selectedToken.change > 10 ? "Parabolic velocity detected. Watch for liquidity exhaustion." : "Neural signature suggests breakout probability remains high."}</p></div><div className="pt-4 border-t border-blue-500/10 flex justify-between items-center text-[10px] uppercase font-black"><span className="text-zinc-600">Net Liquidity</span><span className="text-zinc-200">${(selectedToken.liq || 0).toLocaleString()}</span></div></div>
                                </div>
                            </div>
                        </div>
                        <div className="lg:col-span-4 bg-white/[0.03] rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between h-full space-y-8 text-left">
                            <div className="space-y-8">
                                <div><div className="text-[9px] font-black text-zinc-500 uppercase italic mb-4">Council_Verdict</div><div className={`text-5xl font-black italic tracking-tighter uppercase leading-none ${selectedToken.consensus.color}`}>{selectedToken.consensus.label}</div><div className="text-[11px] text-zinc-500 italic mt-4 font-medium uppercase border-l-2 border-blue-500/30 pl-4">{selectedToken.consensus.desc}</div></div>
                                <div className="space-y-4">{selectedToken.consensus.council.map((c, i) => (
                                    <div key={i} className="p-5 rounded-3xl border border-white/5 bg-black/40"><div className="flex justify-between items-center mb-2"><span className="text-[10px] font-black uppercase text-zinc-500 tracking-widest">{c.agent}</span><span className={`text-[10px] font-black px-2 py-0.5 rounded border ${c.vote === 'BUY' ? 'text-emerald-400 border-emerald-500/20' : (c.vote === 'SELL' || c.vote === 'REJECT' ? 'text-rose-400 border-rose-500/20' : 'text-zinc-500')}`}>{c.vote}</span></div><p className="text-[11px] text-zinc-400 italic m-0 leading-snug">{c.logic}</p></div>
                                ))}</div>
                                <div className="mt-8 pt-6 border-t border-white/5 space-y-4 text-left"><div className="text-[9px] font-black text-zinc-600 uppercase italic">Strategy_Hub</div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Max_Slip</div><div className="text-[11px] text-zinc-300 font-mono">0.50%</div></div>
                                        <div className="p-3 bg-white/[0.02] border border-white/5 rounded-2xl"><div className="text-[8px] text-zinc-600 font-black uppercase mb-1">Entry</div><div className="text-[11px] text-zinc-300 font-mono">{selectedToken.consensus.label.includes('STRONG') ? '25%' : '15%'}</div></div>
                                    </div>
                                    <div className="p-4 bg-emerald-500/[0.03] border border-emerald-500/10 rounded-2xl"><div className="flex items-center gap-2 mb-1"><ShieldCheck className="w-3 h-3 text-emerald-500" /><span className="text-[9px] text-emerald-500 font-black uppercase tracking-widest">Safety_v1.3</span></div><p className="text-[10px] text-zinc-500 italic mt-1 leading-tight">Protecting cash floor of $500. All trades require 2/3 consensus.</p></div>
                                </div>
                            </div>
                            <a href={`https://dexscreener.com/${selectedToken.chain || 'base'}/${selectedToken.addr || ''}`} target="_blank" className="w-full py-5 bg-blue-600 rounded-[2rem] text-center font-black italic text-sm tracking-tighter text-white no-underline mt-10 block uppercase transition-all shadow-lg active:scale-95">Explore Raw Pool Feed</a>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <footer className="pt-20 pb-12 opacity-30 text-left"><div className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase italic mb-2">TrashPanda Neural Ops • v1.3.0_PRO</div><p className="text-[8px] text-zinc-800 font-bold uppercase tracking-widest mb-1 italic">Production Encryption Active • Sovereign Liquidity Stream</p></footer>
      </div>
      <style jsx global>{`.glass { background: rgba(255, 255, 255, 0.015); backdrop-filter: blur(20px); border: 1px solid rgba(255, 255, 255, 0.05); } .neo-gradient { background: linear-gradient(135deg, rgba(59, 130, 246, 0.06) 0%, rgba(147, 51, 234, 0.04) 100%); } .scrollbar-hide::-webkit-scrollbar { display: none; }`}</style>
    </div>
  );
}