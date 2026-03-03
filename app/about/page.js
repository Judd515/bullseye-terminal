'use client';
import React from 'react';
import { 
  Target, BrainCircuit, Activity, Coins, ShieldCheck, TrendingUp, 
  ArrowUpRight, Zap, Cpu, Globe, Scale, Lock
} from 'lucide-react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-[#020203] text-[#f4f4f5] font-sans p-4 md:p-12 relative overflow-hidden">
      <div className="fixed top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto space-y-12 relative z-10">
        <header className="flex flex-col md:flex-row justify-between items-center gap-6">
          <Link href="/" className="flex items-center gap-4 group no-underline">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <Target className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-black italic tracking-tighter uppercase text-white">BULLSEYE 1.3</h1>
          </Link>
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">Protocol Specification</div>
        </header>

        <section className="space-y-6">
          <h2 className="text-4xl font-black italic tracking-tighter uppercase border-b border-white/10 pb-4">The Intelligence Framework</h2>
          <p className="text-lg text-zinc-400 leading-relaxed font-medium">
            BullsEye is a high-frequency strategic terminal designed to bridge the gap between raw decentralized data and automated execution. It operates as a <span className="text-blue-400">multi-agent consensus engine</span>, where specialized AI delegates analyze market conditions in real-time to authorize capital deployment.
          </p>
          <div className="bg-blue-600/[0.03] border border-blue-500/10 p-6 rounded-[2rem] space-y-4">
             <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Protocol Mission</h4>
             <p className="text-sm text-zinc-300 leading-relaxed m-0">The BullsEye protocol exists to eliminate emotional bias from high-alpha trading. By utilizing a "Council" of competing perspectives—Risk, Momentum, and Statistics—we ensure that capital is only committed when high-velocity price action is backed by deep liquidity and mathematical drift.</p>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-rose-500" /></div>
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">The Bear</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">The risk manager. Analyzes liquidity depth, vertical overextension, and mean reversion risk.</p>
            <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[9px] font-bold text-rose-400 uppercase tracking-tighter italic">Primary Gate:</div>
                <p className="text-[10px] text-zinc-400 m-0">VETOs any asset with &lt; $30k pool depth or 24h expansion &gt; 20% to prevent buying blow-off tops.</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">The Mooner</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">The momentum specialist. Monitors price velocity, RSI breakouts, and volume spikes.</p>
            <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[9px] font-bold text-emerald-400 uppercase tracking-tighter italic">Primary Gate:</div>
                <p className="text-[10px] text-zinc-400 m-0">Requires 24h &gt; 3% for a Chase, and 1h Volume &gt; 10% of Liquidity for High-Alpha confirmation.</p>
            </div>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-blue-500" /></div>
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">The Quant</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">The statistical analyst. Uses MACD crossovers and historical drift analysis.</p>
            <div className="pt-4 border-t border-white/5 space-y-2">
                <div className="text-[9px] font-bold text-blue-400 uppercase tracking-tighter italic">Primary Gate:</div>
                <p className="text-[10px] text-zinc-400 m-0">Triggers CONFIRM when MACD Signal Line crosses the Histogram with positive drift gradient.</p>
            </div>
          </div>
        </div>

        <section className="space-y-8 bg-white/[0.01] border border-white/5 p-8 rounded-[2.5rem]">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-center">Consensus Taxonomy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Decision States</h4>
              <div className="space-y-3">
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-1 rounded w-24 text-center">CHASE</span>
                    <span className="text-xs text-zinc-400 font-medium italic">High-velocity breakout in progress.</span>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-black bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded w-24 text-center">CONFIRM</span>
                    <span className="text-xs text-zinc-400 font-medium italic">Statistical indicators align with trend.</span>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/20 px-2 py-1 rounded w-24 text-center">WAIT / CAUTION</span>
                    <span className="text-xs text-zinc-400 font-medium italic">Low volatility or risk threshold breach.</span>
                </div>
                <div className="flex gap-4 items-center">
                    <span className="text-[10px] font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 px-2 py-1 rounded w-24 text-center">VETO</span>
                    <span className="text-xs text-zinc-400 font-medium italic">Total risk failure; entry blocked.</span>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Execution Methodology (2/3)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-bold italic">"Consensus is the permission. Volatility is the trigger."</p>
              <p className="text-xs text-zinc-400 leading-relaxed">BullsEye requires a mathematical majority. No asset is traded unless at least two agents align on a positive outlook (e.g. Chase + Confirm). However, a single <span className="text-rose-500 font-bold">VETO</span> from The Bear can freeze execution even if 2/3 alignment is met.</p>
              <p className="text-xs text-zinc-400 leading-relaxed">Under "Accumulate" status, the terminal waits for a specific velocity signature (+3% to +8% price move) before firing order execution to avoid "buying the chop."</p>
            </div>
          </div>
        </section>

        <section className="space-y-12">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase border-b border-white/10 pb-4">Internal Monitoring & Execution</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                    <div className="flex items-center gap-3"><Activity className="w-5 h-5 text-blue-500" /><h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">The Sentinel Engine</h3></div>
                    <p className="text-xs text-zinc-400 leading-relaxed">Our Sentinel engine performs a deep-trace sync every 15-60 minutes. It doesn't just check price; it reconciles the entire decentralized state (Liquidity Pools, Treasury Balance, and Trade Logs) to ensure the terminal is always "Trade-Ready."</p>
                </div>
                <div className="space-y-4">
                    <div className="flex items-center gap-3"><Lock className="w-5 h-5 text-rose-500" /><h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">Security Liquidation</h3></div>
                    <p className="text-xs text-zinc-400 leading-relaxed">To survive black swan events, BullsEye employs an "Absolute Zero" stop-loss policy. If an active position hits a -5% drawdown from entry, the Safety Liquidation protocol triggers a full-market sell within seconds, regardless of Council sentiment.</p>
                </div>
            </div>

            <div className="bg-white/[0.02] border border-white/5 rounded-[2.5rem] overflow-hidden">
                <div className="p-8 border-b border-white/5 bg-white/[0.01]">
                    <h3 className="text-lg font-bold italic uppercase flex items-center gap-3 text-white"><Scale className="w-5 h-5 text-blue-400" /> Strategic Scaling (Profit Ladders)</h3>
                </div>
                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Anchor Tier (BTC/ETH)</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 text-[11px]">
                                <span className="text-zinc-500 font-bold">Rung 1 (33% exit)</span>
                                <span className="text-emerald-400 font-mono font-bold">+5%</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 text-[11px]">
                                <span className="text-zinc-500 font-bold">Rung 2 (33% exit)</span>
                                <span className="text-emerald-400 font-mono font-bold">+12%</span>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <h4 className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">High Alpha Tier (Degen/Small Caps)</h4>
                        <div className="space-y-3">
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 text-[11px]">
                                <span className="text-zinc-500 font-bold">Rung 1 (33% exit)</span>
                                <span className="text-emerald-400 font-mono font-bold">+20%</span>
                            </div>
                            <div className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-white/5 text-[11px]">
                                <span className="text-zinc-500 font-bold">Rung 2 (33% exit)</span>
                                <span className="text-emerald-400 font-mono font-bold">+50%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <footer className="pt-12 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
           <Link href="/" className="text-[10px] font-black uppercase text-blue-400 hover:text-blue-300 transition-colors tracking-widest no-underline">← Return to Terminal</Link>
           <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-[0.2em]">© 2026 BullsEye Strategic Intelligence</div>
        </footer>
      </div>
    </div>
  );
}