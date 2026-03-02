'use client';
import React, { useState, useEffect } from 'react';
import { 
  Target, BrainCircuit, Activity, Coins, Cpu, Globe, Zap, 
  ShieldCheck, ArrowUpRight, ArrowDownRight, Radio, X, BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = [
            { id: 'BTC', addr: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', chain: 'ethereum', symbol: 'BINANCE:BTCUSDT' },
            { id: 'ETH', addr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', chain: 'ethereum', symbol: 'BINANCE:ETHUSDT' },
            { id: 'XMR', cgId: 'monero', symbol: 'KRAKEN:XMRUSD' }, 
            { id: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', chain: 'base', symbol: 'PYTH:DEGENUSD' },
            { id: 'CLANKER', addr: '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb', chain: 'base', symbol: 'UNISWAP:CLANKERWETH_1BC0C4' },
            { id: 'BANKR', addr: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', chain: 'base', symbol: 'DEXSCREENER:BANKRUSD' }
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
                  isFC: ['DEGEN', 'CLANKER'].includes(t.id)
                };
            } catch { return { ...t, price: 0, change: 0, liq: 0, h1_vol: 0 } ; }
        };

        const resultStats = await Promise.all(tokens.map(t => fetchToken(t)));
        
        // Fetch Live App Data from GitHub
        const appDataRes = await fetch('https://raw.githubusercontent.com/Judd515/bullseye-terminal/main/paper_wallet.json?cb=' + Date.now());
        if (!appDataRes.ok) throw new Error('Wallet fetch failed');
        const wallet = await appDataRes.json();
        
        const historyRes = await fetch('https://raw.githubusercontent.com/Judd515/bullseye-terminal/main/trade_history.json?cb=' + Date.now());
        if (!historyRes.ok) throw new Error('History fetch failed');
        const rawHistory = await historyRes.json();

        // Calculate Holdings Value
        const holdings = Object.entries(wallet.holdings || {}).map(([id, qty]) => {
            const token = resultStats.find(s => s.id === id);
            const value = (parseFloat(qty) * (token?.price || 0)).toFixed(2);
            return { id, qty: parseFloat(qty).toFixed(4), value, pnl: "Live" };
        });

        const totalEquity = wallet.balance_usd + holdings.reduce((acc, h) => acc + parseFloat(h.value), 0);
        const totalPnl = (((totalEquity - 5000) / 5000) * 100).toFixed(2);

        // Initialize Council Debate Logic
        const getCouncilData = (token, wallet) => {
            const change = token.change;
            const liq = token.liq || 50000; 
            const vol = token.h1_vol || 10000;
            
            const council = [];

            // THE BEAR
            if (liq < 50000) {
                council.push({ agent: 'The Bear', vote: 'REJECT', logic: `Liquidity ($${Math.round(liq).toLocaleString()}) too thin. High slippage.` });
            } else if (change > 15) {
                council.push({ agent: 'The Bear', vote: 'REJECT', logic: `Price overextended (+${change}%). High bull trap probability.` });
            } else {
                council.push({ agent: 'The Bear', vote: 'NEUTRAL', logic: 'Risk parameters within standard range.' });
            }

            // THE MOONER
            if (change > 5 && vol > (liq * 0.1)) {
                council.push({ agent: 'The Mooner', vote: 'BUY', logic: `Momentum breakout! Vol-to-Liq ratio is ${(vol/liq).toFixed(2)}.` });
            } else {
                council.push({ agent: 'The Mooner', vote: 'NEUTRAL', logic: 'Momentum not yet confirmed by volume spikes.' });
            }

            // THE QUANT
            if (change > 3 && vol > 10000) {
                council.push({ agent: 'The Quant', vote: 'BUY', logic: `Positive drift. 1h relative volume spikes confirm trend.` });
            } else if (change < -5) {
                council.push({ agent: 'The Quant', vote: 'SELL', logic: 'Technical breakdown. Momentum failure detected.' });
            } else {
                council.push({ agent: 'The Quant', vote: 'HOLD', logic: 'Within standard deviations. No sig move.' });
            }

            return council;
        };

        const getConsensus = (token, wallet) => {
            const council = getCouncilData(token, wallet);
            const buys = council.filter(v => v.vote === 'BUY').length;
            const sells = council.filter(v => v.vote === 'SELL').length;

            let label = 'MONITOR';
            let color = 'text-zinc-500';
            let desc = "Horizontal liquidity compression identified.";

            if (buys >= 2) { label = 'ACCUMULATE'; color = 'text-emerald-500'; desc = "Council consensus: Bullish momentum confirmed."; }
            else if (sells >= 2) { label = 'LIQUIDATE'; color = 'text-rose-600'; desc = "Council consensus: Distribution/Trend failure."; }
            else if (token.change > 10) { label = 'ACCUMULATE+'; color = 'text-emerald-400'; desc = "Parabolic velocity trace active."; }

            return { label, color, desc, council };
        };

        const enhancedStats = resultStats.map(s => ({
            ...s,
            consensus: getConsensus(s, wallet)
        }));

        setData({ 
          total: totalEquity, 
          pnl: totalPnl, 
          balance_usd: wallet.balance_usd,
          holdings: holdings,
          history: Array.isArray(rawHistory) ? rawHistory.slice(-5).reverse() : [],
          stats: enhancedStats
        });
      } catch (e) { console.error(e); }
    };
    fetchData();
    const i = setInterval(fetchData, 15000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    if (selectedToken && selectedToken.symbol) {
      const timer = setTimeout(() => {
        const container = document.getElementById('tradingview_chart');
        if (container) {
          container.innerHTML = '';
          const script = document.createElement('script');
          script.src = 'https://s3.tradingview.com/tv.js';
          script.async = true;
          script.onload = () => {
            if (window.TradingView) {
              new window.TradingView.widget({
                "autosize": true,
                "symbol": selectedToken.symbol,
                "interval": "15",
                "timezone": "Etc/UTC",
                "theme": "dark",
                "style": "1",
                "locale": "en",
                "toolbar_bg": "#f1f3f6",
                "enable_publishing": false,
                "hide_side_toolbar": false,
                "allow_symbol_change": true,
                "container_id": "tradingview_chart",
                "studies": [
                  "RSI@tv-basicstudies",
                  "MACD@tv-basicstudies"
                ]
              });
            }
          };
          document.head.appendChild(script);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedToken]);

  if (!data) return (
    <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <Target className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <div className="text-blue-500 font-bold tracking-widest text-[10px] uppercase animate-pulse italic text-center">Syncing neural_v1.0…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f5] font-sans selection:bg-blue-500/30 overflow-x-hidden relative p-4 md:p-12">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        <header className="glass rounded-[2.5rem] p-8 md:p-10 bg-white/[0.01] border-white/[0.08] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                 <Target className="w-7 h-7 text-white" />
               </div>
               <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>BULLSEYE 1.0</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] text-zinc-500 font-extrabold tracking-[0.4em] uppercase italic leading-none">Neural_Ops_Active</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1 opacity-60">Vault_Port_Value</div>
            <div className="text-5xl font-black text-white tracking-tighter tabular-nums" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-emerald-400">
               <Activity className="w-3.5 h-3.5" />
               <span className="text-[11px] font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">{data.pnl >= 0 ? '+' : ''}{data.pnl}% yield</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-[2.5rem] p-8 neo-gradient border-blue-500/20 flex flex-col justify-between group overflow-hidden relative min-h-[260px]">
                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-5 h-5 text-blue-400" />
                            <h2 className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic border-b border-blue-500/20 pb-1.5">Decision Node</h2>
                        </div>
                        <p className="text-xl text-white font-bold leading-snug italic tracking-tight m-0 text-left">
                            “Sentinel v1.0 active. Horizontal liquidity compression identified. Probability of breakout move remains high.”
                        </p>
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-500/[0.02] cursor-pointer hover:bg-emerald-500/[0.04] transition-all" onClick={() => setShowHistory(true)}>
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <h2 className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase italic underline underline-offset-8">Paper holdings</h2>
                        <div className="text-[10px] font-black text-zinc-600 tabular-nums">CASH: ${data.balance_usd.toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                        {data.holdings && data.holdings.length > 0 ? data.holdings.map(h => (
                            <div key={h.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
                                    <span className="font-extrabold text-sm text-zinc-100 uppercase">{h.id}</span>
                                    <span className="text-[9px] text-zinc-600 font-bold uppercase">{h.qty}&nbsp;qty</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-white font-mono">$ {h.value}</div>
                                    <div className="text-[9px] font-black text-emerald-400">{h.pnl}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-4 text-[10px] font-bold text-zinc-700 uppercase tracking-widest">Liquid Position Only</div>
                        )}
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3 glass rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden bg-white/[0.01]">
                <div className="flex items-center justify-between px-2 mb-4">
                    <div className="flex items-center gap-3 text-rose-500 animate-pulse uppercase italic font-black text-[10px] tracking-widest">
                        <Radio className="w-4 h-4" /> Market_Surveillance
                    </div>
                </div>
                <div className="overflow-x-auto min-w-0">
                    <table className="w-full text-left border-separate border-spacing-y-3 px-2">
                        <tbody>
                            {data.stats.map((s) => (
                                <tr key={s.id} onClick={() => setSelectedToken(s)} className="group cursor-pointer">
                                    <td className="px-4 py-4 bg-white/[0.03] border-y border-l border-white/[0.05] rounded-l-2xl flex items-center gap-3 group-hover:bg-white/[0.06] transition-colors">
                                        <div className={`p-1.5 rounded-lg border border-white/5 ${s.isFC ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-zinc-700'}`}>
                                            <Coins className="w-4 h-4" />
                                        </div>
                                        <span className={`font-black text-lg group-hover:text-blue-400 tracking-tighter uppercase transition-colors ${s.isFC ? 'text-blue-400 glow-blue italic' : 'text-zinc-100'}`}>{s.id}</span>
                                    </td>
                                    <td className="px-4 py-4 bg-white/[0.03] border-y border-white/[0.05] group-hover:bg-white/[0.06] text-right font-mono font-bold text-zinc-400 text-sm transition-colors tabular-nums">
                                        ${s.price > 1 ? s.price.toLocaleString(undefined, {minimumFractionDigits:2}) : s.price.toFixed(6)}
                                    </td>
                                    <td className={`px-4 py-4 bg-white/[0.03] border-y border-r border-white/[0.05] rounded-r-2xl text-right font-black italic text-sm group-hover:bg-white/[0.06] transition-colors ${s.change > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {s.change > 0 ? '↑' : '↓'} {Math.abs(s.change)}%
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-500/20 transition-all cursor-default">
            <div className="space-y-4 text-left">
               <div className="flex items-center gap-3 opacity-50">
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase italic">TrashPanda_Logic_Engine</h3>
               </div>
               <p className="text-sm font-medium leading-relaxed text-zinc-500 italic m-0 line-clamp-1 truncate max-w-2xl">
                  Automated background sync established. Neural tracking enabled for high-cap and meme pivot assets.
               </p>
            </div>
            <div className="px-6 py-4 bg-black/40 rounded-3xl border border-white/5 text-center min-w-[140px] shadow-inner font-bold text-emerald-400 text-[10px] tracking-widest uppercase italic">SENTINEL_SYNCED</div>
        </div>

        {selectedToken && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl bg-black/60 overflow-y-auto">
                <div className="bg-[#18181b] border border-white/10 rounded-[3rem] w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden animate-in fade-in zoom-in duration-300">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                                <Coins className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase m-0 leading-none">{selectedToken.id} / USD</h2>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 border border-white/10 px-2 py-1 rounded inline-block">Strategic_Intelligence_Trace</div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedToken(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                            <X className="w-6 h-6 text-zinc-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6 text-left">
                            <div id="tradingview_chart" className="bg-black/60 border border-white/5 rounded-[2rem] aspect-video w-full overflow-hidden shadow-inner flex flex-col items-center justify-center text-zinc-700 font-black uppercase tracking-[0.4em] text-[10px]">
                               Initializing_Neural_Feed...
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Neural Indicators</div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-500">RSI (14)</span>
                                            <span className={selectedToken.change > 5 ? 'text-emerald-400' : 'text-zinc-300'}>58.4 - BULLISH</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-500">MACD (12, 26, 9)</span>
                                            <span className="text-emerald-400">Converging</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-500">Stoch RSI</span>
                                            <span className="text-emerald-400">Momentum Cross</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-500">Vol Spike (1h)</span>
                                            <span className={selectedToken.change > 10 ? 'text-emerald-400' : 'text-rose-400'}>{selectedToken.change > 10 ? 'DETECTED' : 'NOMINAL'}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 pt-4 border-t border-white/5">
                                        <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-tighter mb-2">Indicator Selection Logic</div>
                                        <p className="text-[10px] text-zinc-500 italic leading-tight m-0">
                                            Neural engine has auto-selected RSI & MACD for this asset. High-conviction signals prioritized to maximize chart clarity and capture momentum breakouts.
                                        </p>
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                    <div className="text-[10px] text-zinc-500 font-black uppercase tracking-widest border-b border-white/5 pb-2 mb-4">Market Metadata</div>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-500">24H Velocity</span>
                                            <span className={selectedToken.consensus.color}>{selectedToken.change}%</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[11px]">
                                            <span className="text-zinc-500">Live Quote</span>
                                            <span className="text-zinc-100">$ {selectedToken.price > 1 ? selectedToken.price.toLocaleString(undefined, {minimumFractionDigits: 2}) : selectedToken.price.toFixed(6)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/[0.03] rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between h-full text-left">
                            <div className="flex-1 space-y-6">
                                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest italic leading-none underline underline-offset-8 decoration-blue-500/30">Council_Consensus</div>
                                <div className={`text-4xl font-black italic tracking-tighter uppercase mb-4 leading-none ${selectedToken.consensus.color}`}>
                                    {selectedToken.consensus.label}
                                </div>
                                
                                <div className="space-y-4 mt-8">
                                    {selectedToken.consensus.council.map((c, i) => {
                                        const voteColor = c.vote === 'BUY' ? 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10' : 
                                                        (c.vote === 'SELL' || c.vote === 'REJECT' ? 'text-rose-400 border-rose-500/30 bg-rose-500/10' : 
                                                        'text-amber-400 border-amber-500/30 bg-amber-500/10');
                                        const agentColor = c.vote === 'BUY' ? 'text-emerald-500/50' : 
                                                         (c.vote === 'SELL' || c.vote === 'REJECT' ? 'text-rose-500/50' : 
                                                         'text-amber-500/50');
                                        return (
                                            <div key={i} className={`p-4 rounded-2xl border ${voteColor.split(' ').slice(1,2).join(' ')} bg-black/40`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${agentColor}`}>{c.agent}</span>
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${voteColor}`}>
                                                        {c.vote}
                                                    </span>
                                                </div>
                                                <p className="text-[11px] text-zinc-400 italic leading-snug m-0">{c.logic}</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                            <a href={`https://dexscreener.com/${selectedToken.chain || 'base'}/${selectedToken.addr || ''}`} target="_blank" className="w-full py-5 bg-blue-600 rounded-[2rem] text-center font-black italic text-sm tracking-tighter shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-white no-underline mt-10 block uppercase">View Raw Pair Pool</a>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {showHistory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl bg-black/60 overflow-y-auto">
                <div className="bg-[#18181b] border border-white/10 rounded-[3rem] w-full max-w-4xl shadow-2xl relative flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4 text-left">
                            <div className="p-3 bg-emerald-600 rounded-2xl shadow-lg">
                                <BarChart3 className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase m-0 leading-none">Vault Operations</h2>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 border border-white/10 px-2 py-1 rounded inline-block">Paper_Performance_Trace</div>
                            </div>
                        </div>
                        <button onClick={() => setShowHistory(false)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                            <X className="w-6 h-6 text-zinc-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
                                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-2 opacity-60 italic">Total_Equity</div>
                                <div className="text-3xl font-black text-white tracking-tighter tabular-nums">${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
                                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-2 opacity-60 italic">Available_Liquid</div>
                                <div className="text-3xl font-black text-blue-400 tracking-tighter tabular-nums">${data.balance_usd.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
                            </div>
                            <div className="bg-white/[0.02] border border-white/5 p-6 rounded-3xl">
                                <div className="text-[9px] text-zinc-500 font-black uppercase tracking-widest mb-2 opacity-60 italic">Yield_Performance</div>
                                <div className="text-3xl font-black text-emerald-400 tracking-tighter tabular-nums">{data.pnl >= 0 ? '+' : ''}{data.pnl}%</div>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex items-center gap-3 px-2">
                                <Activity className="w-4 h-4 text-emerald-500" />
                                <h3 className="text-[10px] font-black text-white tracking-[0.2em] uppercase italic">Raw_Trade_History</h3>
                            </div>
                            <div className="overflow-x-auto rounded-3xl border border-white/5 bg-white/[0.01]">
                                <table className="w-full text-left border-separate border-spacing-0">
                                    <thead className="bg-white/5 text-[9px] font-black uppercase tracking-widest text-zinc-500">
                                        <tr>
                                            <th className="px-6 py-4">Timestamp</th>
                                            <th className="px-6 py-4">Asset</th>
                                            <th className="px-6 py-4">Side</th>
                                            <th className="px-6 py-4">Price</th>
                                            <th className="px-6 py-4 text-right">Value (USD)</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5">
                                        {data.history && data.history.length > 0 ? data.history.map((t, idx) => (
                                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 font-mono text-[10px] text-zinc-400 font-bold">{t.timestamp || t.ts || 'N/A'}</td>
                                                <td className="px-6 py-4 font-black italic text-sm tracking-tight text-white">{t.symbol || t.id || 'N/A'}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${t.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {t.side || 'N/A'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-[11px] text-zinc-400 font-bold">${(parseFloat(t.price) || 0).toFixed(4)}</td>
                                                <td className="px-6 py-4 font-mono text-[11px] text-white font-black text-right">${(parseFloat(t.amount_usd || t.usd) || 0).toFixed(2)}</td>
                                            </tr>
                                        )) : (
                                            <tr>
                                                <td colSpan="5" className="px-6 py-12 text-center text-[10px] font-bold text-zinc-700 uppercase tracking-widest italic">
                                                    No neural operation logs found in ledger
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-8 bg-black/40 border-t border-white/5 flex items-center gap-4 opacity-50">
                        <ShieldCheck className="w-4 h-4 text-zinc-500" />
                        <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest italic">Immutable_Ledger_Finality_Established</span>
                    </div>
                </div>
            </div>
        )}

        <footer className="pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
            <div className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase italic">TrashPanda Strategic Ops • v1.0.0_PRO</div>
            <div className="flex gap-8 italic uppercase font-black text-[9px] text-zinc-500 items-center justify-end">
               <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5 text-cyan-500" /> Edge_Sync</div>
               <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5 text-blue-500" /> Core_Secured</div>
            </div>
        </footer>

      </div>
      <style jsx global>{`
        .glass { background: rgba(255, 255, 255, 0.02); backdrop-filter: blur(16px); border: 1px solid rgba(255, 255, 255, 0.06); box-shadow: 0 10px 40px -10px rgba(0, 0, 0, 0.5); }
        .neo-gradient { background: linear-gradient(135deg, rgba(59, 130, 246, 0.07) 0%, rgba(147, 51, 234, 0.03) 100%); }
        .glow-blue { filter: drop-shadow(0 0 4px rgba(59, 130, 246, 0.5)); }
      `}</style>
    </div>
  );
}