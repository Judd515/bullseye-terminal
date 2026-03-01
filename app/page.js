
'use client';
import React, { useState, useEffect } from 'react';
import { 
  Target, BrainCircuit, Activity, Coins, Cpu, Globe, Zap, 
  ShieldCheck, ArrowUpRight, ArrowDownRight, Radio, Wallet, Flame
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
        setData({ total: 5004.50, pnl: 0.09, stats });
      } catch (e) { console.error(e); }
    };
    fetchData();
    const i = setInterval(fetchData, 15000);
    return () => clearInterval(i);
  }, []);

  if (!data) return (
    <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center space-y-4">
      <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="text-blue-500 font-bold tracking-widest text-[10px] uppercase animate-pulse">Neural Sync v10.0</div>
    </div>
  );

  return (
    <main className="min-h-screen bg-[#050505] text-[#fafafa] font-sans selection:bg-blue-500/30 overflow-x-hidden relative p-4 md:p-12">
      
      {/* AMBIENT LIGHTS */}
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl mx-auto space-y-10 relative z-10">
        
        {/* HEADER CARD */}
        <div className="glass rounded-[2.5rem] p-8 md:p-10 bg-white/[0.01] border-white/[0.06] backdrop-blur-2xl shadow-2xl flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-4xl font-black italic tracking-tighter uppercase leading-none" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
                 BULLSEYE<span className="text-blue-500">10.0</span>
              </h1>
            </div>
            <div className="flex items-center gap-2">
               <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_5px_#10b981]"></div>
               <span className="text-[10px] text-zinc-500 font-extrabold tracking-widest uppercase italic">Neural_Mesh_Sync // Base_Mainnet</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[10px] text-zinc-500 font-extrabold uppercase tracking-[0.2em] mb-1 opacity-60">Portfolio Liquidity</div>
            <div className="text-5xl font-black text-white tracking-tighter tabular-nums" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>
              ${data.total.toLocaleString(undefined, {minimumFractionDigits:2})}
            </div>
            <div className="mt-4 flex items-center justify-end gap-2">
              <Activity className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[11px] font-black text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.1)] uppercase">
                 +{data.pnl}% Yield
              </span>
            </div>
          </div>
        </div>

        {/* DECISION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          
          <div className="lg:col-span-2 glass rounded-[2.5rem] p-8 bg-gradient-to-br from-blue-600/10 to-transparent border-blue-500/20 flex flex-col justify-between group h-full">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <BrainCircuit className="w-5 h-5 text-blue-400" />
                <h2 className="text-[10px] font-black text-blue-400 tracking-[0.3em] uppercase italic underline underline-offset-8">The Advisor</h2>
              </div>
              <p className="text-xl text-zinc-100 font-bold leading-snug italic tracking-tight m-0">
                “Sentinel detects horizontal liquidity compression. Farcaster holdings stagnant. Volatility expansion incoming.”
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-white/5 flex flex-col gap-4">
              <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-widest text-zinc-500">
                <span>Predictive Confidence</span>
                <span className="text-blue-400 italic">81% Verify</span>
              </div>
              <div className="w-full h-1 bg-zinc-900 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 shadow-[0_0_10px_#3b82f6] w-[81%]"></div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3 glass rounded-[2.5rem] p-8 space-y-6 bg-white/[0.01]">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3 text-rose-500 animate-pulse uppercase italic font-black text-[10px] tracking-widest">
                <Radio className="w-4 h-4" /> Live_Market_Stream
              </div>
              <div className="flex items-center gap-2 text-[9px] text-zinc-600 font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full shadow-[0_0_5px_#3b82f6]"></div> FC High Priority
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-separate border-spacing-y-2.5">
                <thead>
                  <tr className="text-[9px] text-zinc-600 font-black uppercase tracking-widest px-2 opacity-50">
                    <th className="px-2 pb-2">Intelligence</th>
                    <th className="px-2 pb-2 text-right">Quote</th>
                    <th className="px-2 pb-2 text-right">Delta</th>
                    <th className="px-2 pb-2 text-right">Core</th>
                  </tr>
                </thead>
                <tbody>
                  {data.stats.map((s) => (
                    <tr key={s.id} className="group cursor-default">
                      <td className="px-4 py-4 bg-white/[0.03] border-y border-l border-white/[0.05] rounded-l-2xl flex items-center gap-3 transition-colors group-hover:bg-white/[0.06]">
                        <div className={`p-1.5 rounded-lg border border-white/5 ${s.isFC ? 'bg-blue-600/20 text-blue-400' : 'bg-white/5 text-zinc-600'}`}>
                          <Coins className="w-4 h-4" />
                        </div>
                        <span className={`font-black text-lg group-hover:text-blue-400 transition-colors uppercase tracking-tighter ${s.isFC ? 'text-blue-400 italic' : 'text-zinc-100'}`}>{s.id}</span>
                      </td>
                      <td className="px-4 py-4 bg-white/[0.03] border-y border-white/[0.05] group-hover:bg-white/[0.06] text-right font-mono font-bold text-zinc-400 text-[13px] tabular-nums">
                        ${s.price > 1 ? s.price.toLocaleString(undefined, {minimumFractionDigits:2}) : s.price.toFixed(6)}
                      </td>
                      <td className={`px-4 py-4 bg-white/[0.03] border-y border-white/[0.05] group-hover:bg-white/[0.06] text-right font-black italic text-[13px] ${s.change > 0 ? 'text-emerald-400' : 'text-rose-500'}`}>
                        {s.change > 0 ? '↑' : '↓'} {Math.abs(s.change)}%
                      </td>
                      <td className="px-4 py-4 bg-white/[0.03] border-y border-r border-white/[0.05] rounded-r-2xl group-hover:bg-white/[0.06] text-right">
                        <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border flex-inline ${s.signal === 'BULLISH' ? 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5' : s.signal === 'BEARISH' ? 'border-rose-500/20 text-rose-500 bg-rose-500/5' : 'border-white/5 text-zinc-600'}`}>
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

        {/* LOGIC TRACE */}
        <div className="glass rounded-[2.5rem] p-8 border border-white/10 relative overflow-hidden group hover:border-blue-500/20 transition-all cursor-default">
           <div className="flex items-center gap-3 mb-4 opacity-50 group-hover:opacity-100 transition-opacity">
              <Cpu className="w-5 h-5 text-zinc-500" />
              <h3 className="text-[10px] font-black text-zinc-500 tracking-[0.3em] uppercase italic">Neural_Logic_Chain // TRASHPANDA_V10</h3>
           </div>
           <p className="text-sm font-medium leading-relaxed text-zinc-500 italic h-12 overflow-hidden group-hover:text-zinc-400 transition-colors">
              Consensus scoring 4.8/10. Hidden bullish divergence on CLANKER. 29 indicators active across 8 assets. Awaiting Base liquidity shift. SENTINEL_VIGILANT.
           </p>
        </div>

        {/* FOOTER */}
        <footer className="pt-20 pb-12 flex flex-col md:flex-row justify-between items-center gap-6 opacity-30 hover:opacity-100 transition-opacity">
           <div className="text-[9px] font-black tracking-[0.4em] text-zinc-700 uppercase italic">TrashPanda Predictive Ops // BUILD_10.0_PRO</div>
           <div className="flex gap-10 items-center">
              <div className="flex items-center gap-2 italic uppercase font-black text-[10px] text-zinc-500"><Globe className="w-4 h-4 text-cyan-500" /> Global_Node_Active</div>
              <div className="flex items-center gap-2 italic uppercase font-black text-[10px] text-zinc-500 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-blue-500" /> Mesh_Secured</div>
           </div>
        </footer>

      </div>
    </div>
  );
}
