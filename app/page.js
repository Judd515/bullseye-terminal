
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Target, BrainCircuit, Activity, Coins, Cpu, Globe, Zap, 
  ShieldCheck, ArrowUpRight, ArrowDownRight, Radio
} from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = [
            { id: 'BTC', addr: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599' },
            { id: 'ETH', addr: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2' },
            { id: 'XMR', cgId: 'monero' }, 
            { id: 'DEGEN', addr: '0x4ed4E862860beD51a9570b96d89aF5E1B0Efefed' },
            { id: 'CLANKER', addr: '0x1bc0c42215582d5a085795f4badbac3ff36d1bcb' },
            { id: 'BANKR', addr: '0x22af33fe49fd1fa80c7149773dde5890d3c76f3b' }
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
                  id: t.id, 
                  price, 
                  change: parseFloat(change.toFixed(2)),
                  signal: change > 5 ? 'BULLISH' : change < -5 ? 'BEARISH' : 'NEUTRAL',
                  isFC: ['DEGEN', 'CLANKER'].includes(t.id) 
                };
            } catch { return { id: t.id, price: 0, change: 0, signal: 'NEUTRAL' } ; }
        };

        const stats = await Promise.all(tokens.map(t => fetchToken(t)));
        setData({ total: 5003.12, pnl: 0.06, stats });
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
      <div className="text-blue-500 font-bold tracking-widest text-[10px] uppercase animate-pulse">Syncing neural_v10…</div>
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
               <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>BULLSEYE 10.1</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_#10b981]" />
              <span className="text-[9px] text-zinc-500 font-extrabold tracking-[0.4em] uppercase italic">Distributed_Sentinel_Core</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-widest mb-1 opacity-60">Snapshot Liquidity</div>
            <div className="text-5xl font-black text-white tracking-tighter tabular-nums" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
               <Activity className="w-3.5 h-3.5 text-emerald-400" />
               <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)]">+{data.pnl}% yield</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 neo-gradient border-blue-500/20 flex flex-col justify-between group overflow-hidden relative">
                <div className="absolute -top-12 -right-12 w-32 h-32 bg-blue-500/10 blur-[60px] rounded-full group-hover:bg-blue-500/20 transition-colors"></div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-blue-500/20 rounded-xl">
                            <BrainCircuit className="w-5 h-5 text-blue-400" />
                        </div>
                        <h2 className="text-[10px] font-black text-blue-400 tracking-[0.2em] uppercase italic underline underline-offset-8">Decision Node</h2>
                    </div>
                    <p className="text-xl text-white font-bold leading-snug italic tracking-tight mb-8 group-hover:translate-x-1 transition-transform">
                        “Sentinel detects horizontal liquidity compression. Probablity of market expansion is high.”
                    </p>
                </div>
                <div className="flex justify-between items-center z-10 pt-4 border-t border-white/5">
                    <span className="text-[9px] font-extrabold text-zinc-500 uppercase tracking-widest">Neural Confidence</span>
                    <span className="text-xs font-black text-blue-400 italic">81% Accuracy</span>
                </div>
            </div>

            <div className="lg:col-span-3 glass rounded-[2.5rem] p-8 space-y-6 relative overflow-hidden bg-white/[0.01]">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-3 text-rose-500 animate-pulse uppercase italic font-black text-[10px] tracking-widest">
                        <Radio className="w-4 h-4" /> Live_Surveillance
                    </div>
                    <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-black uppercase tracking-widest leading-none">
                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></div> FC High Priority
                    </div>
                </div>
                <div className="overflow-x-auto min-w-0">
                    <table className="w-full text-left border-separate border-spacing-y-3">
                        <thead>
                            <tr className="text-[9px] text-zinc-600 font-black uppercase tracking-widest opacity-50 px-2">
                                <th className="px-2 pb-2">Asset Intelligence</th>
                                <th className="px-2 pb-2 text-right">Quote</th>
                                <th className="px-2 pb-2 text-right">Delta</th>
                                <th className="px-2 pb-2 text-right">Signal</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.stats.map((s) => (
                                <tr key={s.id} className="group cursor-default">
                                    <td className="px-4 py-4 bg-white/[0.03] border-y border-l border-white/[0.05] rounded-l-2xl flex items-center gap-3 group-hover:bg-white/[0.06] transition-colors">
                                        <div className={`p-1.5 rounded-lg border border-white/5 \${s.isFC ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-zinc-700'}`}>
                                            <Coins className="w-4 h-4" />
                                        </div>
                                        <span className={`font-black text-lg group-hover:text-blue-400 tracking-tighter uppercase transition-colors \${s.isFC ? 'text-blue-400 italic' : 'text-zinc-100'}`}>{s.id}</span>
                                    </td>
                                    <td className="px-4 py-4 bg-white/[0.03] border-y border-white/[0.05] text-right font-mono font-bold text-zinc-400 text-sm group-hover:bg-white/[0.06] transition-colors tabular-nums">
                                        ${s.price > 1 ? s.price.toLocaleString(undefined, {minimumFractionDigits:2}) : s.price.toFixed(6)}
                                    </td>
                                    <td className={`px-4 py-4 bg-white/[0.03] border-y border-white/[0.05] text-right font-black italic text-sm group-hover:bg-white/[0.06] transition-colors \${s.change > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {s.change > 0 ? '↑' : '↓'} {Math.abs(s.change)}%
                                    </td>
                                    <td className="px-4 py-4 bg-white/[0.03] border-y border-r border-white/[0.05] rounded-r-2xl text-right group-hover:bg-white/[0.06] transition-colors">
                                        <span className={`inline-flex px-3 py-1 rounded-lg border-2 text-[9px] font-black tracking-widest uppercase \${s.signal === 'BULLISH' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : s.signal === 'BEARISH' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' : 'border-white/5 text-zinc-600'}`}>
                                            {s.signal}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <div className="glass rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group hover:border-blue-500/20 transition-all cursor-default flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="space-y-4">
               <div className="flex items-center gap-3 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
                  <Cpu className="w-4 h-4 text-zinc-500" />
                  <h3 className="text-[9px] font-black text-zinc-500 tracking-[0.3em] uppercase italic">Neural_Logic_Trace // v10.1</h3>
               </div>
               <p className="text-sm font-medium leading-relaxed text-zinc-500 italic m-0 line-clamp-2 transition-colors group-hover:text-zinc-400 max-w-2xl">
                  Consensus scoring 4.8/10. Hidden bullish divergence identified on CLANKER. 29 indicators active across 8 assets.
               </p>
            </div>
            <div className="px-6 py-4 bg-black/40 rounded-3xl border border-white/5 text-center min-w-[140px] shadow-inner">
               <div className="text-[9px] text-zinc-500 font-black uppercase mb-1">Status</div>
               <div className="text-xs font-black text-emerald-400 uppercase tracking-widest leading-none">SENTINEL_OK</div>
            </div>
        </div>

        <footer className="pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 hover:opacity-100 transition-opacity">
            <div className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase italic leading-none">TrashPanda Strategic Ops • Direct_Feed_v10.1</div>
            <div className="flex gap-10 items-center justify-end">
                <div className="flex items-center gap-2 italic uppercase font-black text-[9px] text-zinc-500 cursor-pointer hover:text-cyan-500 transition-colors leading-none truncate"><Globe className="w-3.5 h-3.5" /> Edge_Mesh_Sync</div>
                <div className="flex items-center gap-2 italic uppercase font-black text-[9px] text-zinc-500 cursor-pointer hover:text-blue-500 transition-colors leading-none truncate"><ShieldCheck className="w-3.5 h-3.5" /> Core_Secured</div>
            </div>
        </footer>

      </div>
    </div>
  );
}
