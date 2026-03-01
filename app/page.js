
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Target, BrainCircuit, Activity, Coins, Cpu, Globe, Zap, 
  ShieldCheck, ArrowUpRight, ArrowDownRight, Radio, X, BarChart3, LineChart
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = [
            { id: 'BTC', addr: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', chain: 'ethereum' },
            { id: 'ETH', addr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', chain: 'ethereum' },
            { id: 'XMR', cgId: 'monero' }, 
            { id: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', chain: 'base' },
            { id: 'CLANKER', addr: '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb', chain: 'base' },
            { id: 'BANKR', addr: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', chain: 'base' }
        ];
        
        const fetchToken = async (t) => {
            try {
                let price = 0, change = 0, pairs = [];
                if (t.addr) {
                    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${t.addr}`);
                    const json = await res.json();
                    pairs = json.pairs || [];
                    const p = pairs.sort((a,b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];
                    price = p ? parseFloat(p.priceUsd) : 0;
                    change = p ? p.priceChange.h24 : 0;
                } else if (t.cgId) {
                    const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${t.cgId}&vs_currencies=usd&include_24hr_change=true`);
                    const json = await res.json();
                    price = json[t.cgId].usd;
                    change = json[t.cgId].usd_24h_change;
                }
                return { 
                  ...t,
                  price, 
                  change: parseFloat(change.toFixed(2)),
                  signal: change > 5 ? 'BULLISH' : change < -5 ? 'BEARISH' : 'NEUTRAL',
                  isFC: ['DEGEN', 'CLANKER'].includes(t.id),
                  pairs
                };
            } catch { return { ...t, price: 0, change: 0, signal: 'NEUTRAL' } ; }
        };

        const stats = await Promise.all(tokens.map(t => fetchToken(t)));
        setData({ 
          total: 5003.45, 
          pnl: 0.07, 
          balance_usd: 5000.00,
          holdings: [
            { id: 'CLANKER', qty: "8.2", value: "3.45", pnl: "+1.2%" }
          ],
          stats 
        });
      } catch (e) { console.error(e); }
    };
    fetchData();
    const i = setInterval(fetchData, 15000);
    return () => clearInterval(i);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#020203] flex flex-col items-center justify-center space-y-6">
      <div className="relative">
        <div className="w-16 h-16 border-2 border-blue-500/20 border-t-blue-500 rounded-full animate-spin"></div>
        <Target className="w-6 h-6 text-blue-500 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse" />
      </div>
      <div className="text-blue-500 font-bold tracking-widest text-[10px] uppercase animate-pulse">Syncing neural_v10.2…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f5] font-sans selection:bg-blue-500/30 overflow-x-hidden relative p-4 md:p-12">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        
        {/* HEADER */}
        <header className="glass rounded-[2.5rem] p-8 md:p-10 bg-white/[0.01] border-white/[0.08] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
          <div className="space-y-4 text-left">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                 <Target className="w-7 h-7 text-white" />
               </div>
               <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>BULLSEYE 10.2</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] text-zinc-500 font-extrabold tracking-[0.4em] uppercase italic">Real-Time Strategic Terminal</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1 opacity-60">Portfolio Liquidity</div>
            <div className="text-5xl font-black text-white tracking-tighter tabular-nums" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2 text-emerald-400">
               <Activity className="w-3.5 h-3.5" />
               <span className="text-[11px] font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">+{data.pnl}% yield</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* ADVISORY & HOLDINGS CONTAINER */}
            <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-[2.5rem] p-8 neo-gradient border-blue-500/20 flex flex-col justify-between group overflow-hidden relative min-h-[300px]">
                    <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full"></div>
                    <div className="relative z-10">
                        <div className="flex items-center gap-3 mb-6">
                            <BrainCircuit className="w-5 h-5 text-blue-400" />
                            <h2 className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic underline underline-offset-8">Decision Node</h2>
                        </div>
                        <p className="text-xl text-white font-bold leading-snug italic tracking-tight mb-8">
                            “Sentinel detects horizontal liquidity compression. Probablity of breakout expansion remains high.”
                        </p>
                    </div>
                    <div className="flex justify-between items-center z-10 pt-4 border-t border-white/5">
                        <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest leading-none">Model Confidence</span>
                        <span className="text-xs font-black text-blue-400 italic leading-none truncate">81% Accuracy</span>
                    </div>
                </div>

                {/* PAPER HOLDINGS SUB-CARD */}
                <div className="glass rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3 text-emerald-400">
                            <ShieldCheck className="w-5 h-5" />
                            <h2 className="text-[10px] font-black tracking-[0.2em] uppercase italic underline underline-offset-8">Paper Holdings</h2>
                        </div>
                        <div className="text-[10px] font-black text-zinc-500 tabular-nums">CASH: ${data.balance_usd.toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                        {data.holdings.length > 0 ? data.holdings.map(h => (
                            <div key={h.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
                                    <span className="font-black text-sm text-zinc-100">{h.id}</span>
                                    <span className="text-[10px] text-zinc-500 font-bold">x{h.qty}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-black text-white">$ {h.value}</div>
                                    <div className="text-[9px] font-black text-emerald-400">{h.pnl}</div>
                                </div>
                            </div>
                        )) : (
                            <div className="text-center py-4 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">No Active Positions</div>
                        )}
                    </div>
                </div>
            </div>

            {/* LIVE SURVEILLANCE MATRIX */}
            <div className="lg:col-span-3 glass rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden bg-white/[0.01]">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3 text-rose-500 animate-pulse uppercase italic font-black text-[10px] tracking-widest">
                        <Radio className="w-4 h-4" /> Live_Surveillance
                    </div>
                    <div className="text-[9px] text-zinc-600 font-black uppercase tracking-widest border border-white/5 px-2 py-1 rounded-md">
                        Click asset for deep-dive
                    </div>
                </div>
                <div className="overflow-x-auto min-w-0">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <tbody className="divide-y divide-white/[0.02]">
                            {data.stats.map((s) => (
                                <tr key={s.id} onClick={() => setSelectedToken(s)} className="group cursor-pointer">
                                    <td className="px-4 py-4 bg-white/[0.03] border-y border-l border-white/[0.05] rounded-l-2xl flex items-center gap-3 group-hover:bg-white/[0.06] transition-colors">
                                        <div className={`p-1.5 rounded-lg border border-white/5 ${s.isFC ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-zinc-700'}`}>
                                            <Coins className="w-4 h-4" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className={`font-black text-lg group-hover:text-blue-400 tracking-tighter uppercase transition-colors ${s.isFC ? 'text-blue-400 glow-blue italic' : 'text-zinc-100'}`}>{s.id}</span>
                                            {s.isFC && <span className="text-[7px] text-blue-500 font-black uppercase tracking-[0.2em] leading-none mt-0.5">Priority</span>}
                                        </div>
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

        {/* LOGIC TRACE */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 group hover:border-blue-500/20 transition-all cursor-default">
            <div className="space-y-4">
               <div className="flex items-center gap-3 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase italic">Neural_Logic_Trace // v10.2</h3>
               </div>
               <p className="text-sm font-medium leading-relaxed text-zinc-500 italic m-0 line-clamp-1 transition-colors group-hover:text-zinc-400 max-w-2xl text-left">
                  Consensus scoring 4.8/10. Hidden bullish divergence identified on CLANKER. 29 indicators active across 8 assets.
               </p>
            </div>
            <div className="px-6 py-4 bg-black/40 rounded-3xl border border-white/5 text-center min-w-[140px] shadow-inner">
               <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Status</div>
               <div className="text-xs font-black text-emerald-400 uppercase tracking-widest leading-none">SENTINEL_ACTIVE</div>
            </div>
        </div>

        {/* ASSET MODAL - TRADINGVIEW TYPE VIEW */}
        {selectedToken && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl bg-black/60 overflow-y-auto">
                <div className="bg-[#18181b] border border-white/10 rounded-[3rem] w-full max-w-5xl shadow-[0_0_100px_rgba(0,0,0,1)] overflow-hidden flex flex-col max-h-[90vh]">
                    {/* MODAL HEADER */}
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <Coins className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase m-0 leading-none">{selectedToken.id} <span className="not-italic text-sm text-zinc-600">/ USD</span></h2>
                                <div className="flex items-center gap-4 mt-2">
                                    <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div> On-Chain Intel
                                    </div>
                                    <a href={`https://dexscreener.com/${selectedToken.chain || 'base'}/${selectedToken.addr}`} target="_blank" className="text-blue-400 text-[10px] font-bold uppercase underline underline-offset-4 hover:text-blue-300">View on DexScreener</a>
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedToken(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                            <X className="w-6 h-6 text-zinc-400" />
                        </button>
                    </div>

                    {/* MODAL BODY */}
                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* CHART PLACEHOLDER */}
                            <div className="bg-black/40 border border-white/5 rounded-[2rem] aspect-video relative overflow-hidden flex flex-col items-center justify-center group">
                                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                                <BarChart3 className="w-16 h-16 text-zinc-800 group-hover:text-blue-500/20 transition-colors mb-4" />
                                <div className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-blue-400/40 transition-colors">Indicator Matrix Pulse Incoming</div>
                                <div className="absolute bottom-6 right-6 flex gap-2">
                                    <div className="px-3 py-1 bg-blue-500/10 border border-blue-500/30 rounded-full text-[8px] font-black text-blue-400 uppercase">EMA 200: $ ---</div>
                                    <div className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-[8px] font-black text-emerald-400 uppercase">RSI (14): 44.3</div>
                                </div>
                            </div>

                            {/* LIQUIDITY TILES */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
                                {[
                                    { label: 'Market Cap', val: '$ -- M' },
                                    { label: '24H Volume', val: '$ -- K' },
                                    { label: 'Holders', val: '--' },
                                    { label: 'Chain', val: selectedToken.chain || 'N/A' }
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                        <div className="text-[8px] text-zinc-600 font-extrabold uppercase tracking-widest mb-1">{stat.label}</div>
                                        <div className="text-sm font-black text-zinc-200">{stat.val}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* SIGNAL SIDEBAR */}
                        <div className="space-y-6">
                            <div className="bg-white/5 rounded-[2rem] p-8 border border-white/10 h-full flex flex-col">
                                <div className="flex items-center gap-3 mb-6">
                                    <Flame className="w-5 h-5 text-orange-500" />
                                    <h3 className="text-[10px] font-black text-zinc-100 uppercase tracking-widest italic">Signal Consensus</h3>
                                </div>
                                <div className="flex-1 space-y-8">
                                   <div className="space-y-2">
                                      <div className="text-[8px] font-black text-zinc-500 uppercase tracking-[0.2em]">Strategy Verdict</div>
                                      <div className={`text-4xl font-black italic tracking-tighter ${selectedToken.change > 5 ? 'text-emerald-400' : 'text-zinc-600'}`}>
                                        {selectedToken.change > 5 ? 'ACCUMULATE' : 'MONITOR'}
                                      </div>
                                   </div>
                                   <div className="space-y-4">
                                      {[
                                        { n: 'Relative Strength', v: 'NEUTRAL', c: 'text-zinc-500' },
                                        { n: 'Volume Delta', v: 'WEAK', c: 'text-zinc-600' },
                                        { n: 'Trend Stability', v: 'CONSOLIDATION', c: 'text-blue-500/60' }
                                      ].map((ind, i) => (
                                          <div key={i} className="flex justify-between items-center border-b border-white/5 pb-3">
                                            <span className="text-[10px] font-bold text-zinc-500">{ind.n}</span>
                                            <span className={`text-[10px] font-black italic ${ind.c}`}>{ind.v}</span>
                                          </div>
                                      ))}
                                   </div>
                                </div>
                                <button className="w-full py-5 bg-blue-600 rounded-3xl font-black italic text-sm tracking-tighter shadow-xl shadow-blue-500/20 active:scale-95 transition-all uppercase">
                                   Request Neural Trace
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <footer className="pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 hover:opacity-100 transition-opacity">
            <div className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase italic leading-none">TrashPanda Strategic Ops • v10.2_PRO</div>
            <div className="flex gap-10 items-center justify-end">
                <div className="flex items-center gap-2 italic uppercase font-black text-[9px] text-zinc-500"><Globe className="w-3.5 h-3.5" /> Edge_Sync_Active</div>
                <div className="flex items-center gap-2 italic uppercase font-black text-[9px] text-zinc-500"><ShieldCheck className="w-3.5 h-3.5" /> Protocol_Secured</div>
            </div>
        </footer>

      </div>
    </div>
  );
}
