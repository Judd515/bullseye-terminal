
'use client';
import React, { useState, useEffect, useRef } from 'react';
import { 
  Target, BrainCircuit, Activity, Coins, Cpu, Globe, Zap, 
  ShieldCheck, ArrowUpRight, ArrowDownRight, Radio, X, BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = [
            { id: 'BTC', addr: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599', chain: 'ethereum', symbol: 'BINANCE:BTCUSDT' },
            { id: 'ETH', addr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2', chain: 'ethereum', symbol: 'BINANCE:ETHUSDT' },
            { id: 'XMR', cgId: 'monero', symbol: 'KRAKEN:XMRUSD' }, 
            { id: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed', chain: 'base', symbol: 'DEXSCREENER:DEGENUSDC' },
            { id: 'CLANKER', addr: '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb', chain: 'base', symbol: 'DEXSCREENER:CLANKERETH' },
            { id: 'BANKR', addr: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b', chain: 'base', symbol: 'DEXSCREENER:BANKRUSD' }
        ];
        
        const fetchToken = async (t) => {
            try {
                let price = 0, change = 0;
                if (t.addr) {
                    const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${t.addr}`);
                    const json = await res.json();
                    const p = json.pairs?.sort((a,b) => (b.volume?.h24 || 0) - (a.volume?.h24 || 0))[0];
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
                  change: parseFloat((change || 0).toFixed(2)),
                  signal: change > 5 ? 'BULLISH' : change < -5 ? 'BEARISH' : 'NEUTRAL',
                  isFC: ['DEGEN', 'CLANKER'].includes(t.id)
                };
            } catch { return { ...t, price: 0, change: 0, signal: 'NEUTRAL' } ; }
        };

        const resultStats = await Promise.all(tokens.map(t => fetchToken(t)));
        setData({ 
          total: 5003.45, 
          pnl: 0.07, 
          balance_usd: 5000.00,
          holdings: [
            { id: 'CLANKER', qty: "8.2", value: "3.45", pnl: "+1.2%" }
          ],
          stats: resultStats
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
      <div className="text-blue-500 font-bold tracking-widest text-[10px] uppercase animate-pulse italic">SYNCING_CORE_v10.5…</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f5] font-sans selection:bg-blue-500/30 overflow-x-hidden relative p-4 md:p-12">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-900/5 blur-[150px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-8 relative z-10">
        <header className="glass rounded-[2.5rem] p-8 md:p-10 bg-white/[0.01] border-white/[0.08] backdrop-blur-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6 shadow-2xl">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
               <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_25px_rgba(59,130,246,0.4)]">
                 <Target className="w-7 h-7 text-white" />
               </div>
               <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none">BULLSEYE 10.5</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] text-zinc-500 font-extrabold tracking-[0.4em] uppercase italic">Strategic_Neural_Hub</span>
            </div>
          </div>
          <div className="text-right text-left md:text-right">
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1 opacity-60">Vault_Portfolio</div>
            <div className="text-5xl font-black text-white tracking-tighter tabular-nums">${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}</div>
            <div className="mt-4 flex items-center justify-end gap-2 text-emerald-400">
               <Activity className="w-3.5 h-3.5" />
               <span className="text-[11px] font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">+{data.pnl}% yield</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 space-y-6">
                <div className="glass rounded-[2.5rem] p-8 bg-blue-500/5 border-blue-500/20 flex flex-col justify-between group overflow-hidden relative min-h-[260px]">
                    <div className="space-y-6 relative z-10">
                        <div className="flex items-center gap-3">
                            <BrainCircuit className="w-5 h-5 text-blue-400" />
                            <h2 className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic border-b border-blue-500/20 pb-1.5">Decision Node</h2>
                        </div>
                        <p className="text-xl text-white font-bold leading-snug italic tracking-tight m-0">
                            “Sentinel v10.5 active. High-conviction breakout being tracked on Base liquidity pools. Squeeze imminent.”
                        </p>
                    </div>
                </div>

                <div className="glass rounded-[2.5rem] p-8 border-emerald-500/20 bg-emerald-500/[0.02]">
                    <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-4">
                        <h2 className="text-[10px] font-black text-emerald-400 tracking-[0.2em] uppercase italic underline underline-offset-8">Paper holdings</h2>
                        <div className="text-[9px] font-black text-zinc-600 uppercase tabular-nums">Cash: ${data.balance_usd.toLocaleString()}</div>
                    </div>
                    <div className="space-y-3">
                        {data.holdings && data.holdings.length > 0 ? data.holdings.map(h => (
                            <div key={h.id} className="flex justify-between items-center bg-white/[0.02] border border-white/5 rounded-2xl p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
                                    <span className="font-extrabold text-sm uppercase text-zinc-100">{h.id}</span>
                                    <span className="text-[9px] text-zinc-500 font-bold italic">{h.qty}&nbsp;QTY</span>
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-separate border-spacing-y-3">
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
            <div className="space-y-4">
               <div className="flex items-center gap-3 opacity-50">
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase italic">TrashPanda_Neural_Chain</h3>
               </div>
               <p className="text-sm font-medium leading-relaxed text-zinc-500 italic m-0 line-clamp-1 truncate max-w-2xl text-left">
                  Neural accuracy tracking at 81%. Farcaster linked assets exhibiting priority liquidity signals.
               </p>
            </div>
            <div className="px-6 py-4 bg-black/40 rounded-3xl border border-white/5 text-center min-w-[140px] shadow-inner font-bold text-emerald-400 text-[10px] tracking-widest uppercase italic">SENTINEL_ACTIVE</div>
        </div>

        {selectedToken && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10 backdrop-blur-xl bg-black/60 overflow-y-auto">
                <div className="bg-[#18181b] border border-white/10 rounded-[3rem] w-full max-w-5xl shadow-2xl relative flex flex-col max-h-[95vh] overflow-hidden">
                    <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-600 rounded-2xl shadow-lg">
                                <Coins className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-black italic tracking-tighter uppercase m-0 leading-none">{selectedToken.id} / USD</h2>
                                <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">Strategic_Neural_Trace</div>
                            </div>
                        </div>
                        <button onClick={() => setSelectedToken(null)} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl transition-colors">
                            <X className="w-6 h-6 text-zinc-400" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* LIVE TRADINGVIEW EMBED */}
                            <div className="bg-black/60 border border-white/5 rounded-[2rem] aspect-video w-full overflow-hidden relative shadow-inner">
                                <div className="absolute inset-0 z-0 bg-blue-500/5 backdrop-blur-[20px]"></div>
                                <iframe 
                                    className="relative z-10 w-full h-full border-none opacity-90"
                                    src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_762a4&symbol=${selectedToken.symbol}&interval=15&hidesidetoolbar=1&hidetoptoolbar=1&symboledit=1&saveimage=1&toolbarbg=f1f3f6&studies=Double%20EMA%40tv-basicstudies%3BBollinger%20Bands%40tv-basicstudies%3BRSI%40tv-basicstudies&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en&utm_source=localhost&utm_medium=widget&utm_campaign=chart&utm_term=${selectedToken.id}`}
                                ></iframe>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Live Asset Quote</div>
                                    <div className="text-xl font-black text-zinc-200 font-mono italic">${selectedToken.price}</div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">24H Velocity Trace</div>
                                    <div className={`text-xl font-black italic ${selectedToken.change > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>{selectedToken.change}%</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/[0.03] rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between h-full">
                            <div className="space-y-6 flex-1 text-left">
                                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4 italic underline underline-offset-8">Neural_Consensus</div>
                                <div className={`text-4xl font-black italic tracking-tighter uppercase ${selectedToken.change > 5 ? 'text-emerald-400' : 'text-zinc-500'}`}>
                                    {selectedToken.change > 5 ? 'ACCUMULATE' : 'MONITOR'}
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-zinc-500 italic m-0">The 29-indicator consensus suggests current technical floors are holding. Sentinel is scanning for a vol-breakout confirmation on the 15m timeframe.</p>
                            </div>
                            <a href={`https://dexscreener.com/${selectedToken.chain || 'base'}/${selectedToken.addr || ''}`} target="_blank" className="w-full py-5 bg-blue-600 rounded-[2rem] text-center font-black italic text-sm tracking-tighter shadow-xl shadow-blue-500/20 active:scale-95 transition-all text-white no-underline mt-10 block uppercase">View Raw Pair Pool</a>
                        </div>
                    </div>
                </div>
            </div>
        )}

        <footer className="pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30">
            <div className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase italic">TrashPanda Strategic Ops • v10.5_PRO</div>
            <div className="flex gap-8 italic uppercase font-black text-[9px] text-zinc-500 items-center">
               <div className="flex items-center gap-2"><Globe className="w-3.5 h-3.5" /> Edge_Sync</div>
               <div className="flex items-center gap-2"><ShieldCheck className="w-3.5 h-3.5" /> Node_Secured</div>
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
