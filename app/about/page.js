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
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="w-8 h-8 bg-rose-500/10 rounded-lg flex items-center justify-center"><ShieldCheck className="w-5 h-5 text-rose-500" /></div>
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">The Bear</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">The risk manager. Analyzes liquidity depth, vertical overextension, and mean reversion risk. Its primary goal is capital preservation through <span className="text-rose-400">VETOs</span>.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center"><TrendingUp className="w-5 h-5 text-emerald-500" /></div>
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">The Mooner</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">The momentum specialist. Monitors price velocity, RSI breakouts, and volume spikes. It only triggers a <span className="text-emerald-400">CHASE</span> when a trend shows high-intensity conviction.</p>
          </div>
          <div className="bg-white/[0.02] border border-white/5 p-6 rounded-[2rem] space-y-4">
            <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center"><Activity className="w-5 h-5 text-blue-500" /></div>
            <h3 className="text-sm font-black uppercase tracking-widest italic text-white leading-none">The Quant</h3>
            <p className="text-[11px] text-zinc-500 leading-relaxed">The statistical analyst. Uses MACD crossovers and historical drift analysis to <span className="text-blue-400">CONFIRM</span> that a trend is mathematically sound rather than just noise.</p>
          </div>
        </div>

        <section className="space-y-8 bg-white/[0.01] border border-white/5 p-8 rounded-[2.5rem]">
          <h2 className="text-2xl font-black italic tracking-tighter uppercase text-center">Consensus Taxonomy</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Decision Logic (2/3)</h4>
              <p className="text-xs text-zinc-400 leading-relaxed">BullsEye requires a mathematical majority. No asset is traded unless at least two agents align on a positive outlook. However, a single <span className="text-rose-500">VETO</span> from The Bear can freeze execution even if 2/3 alignment is met.</p>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-blue-400 uppercase tracking-widest">The Breakout Trigger</h4>
              <p className="text-xs text-zinc-400 leading-relaxed font-bold italic">"Consensus is the permission. Volatility is the trigger."</p>
              <p className="text-xs text-zinc-400 leading-relaxed">Even under "Accumulate" status, the terminal often waits for a specific velocity signature (+3% to +8% price move) before firing order execution to avoid "buying the chop."</p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-6">
          <div className="space-y-6">
            <h3 className="text-lg font-bold italic uppercase flex items-center gap-3"><Zap className="w-5 h-5 text-amber-500" /> Safety Parameters</h3>
            <ul className="space-y-4 m-0 p-0 list-none">
              <li className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-white font-bold block mb-1 uppercase tracking-tighter italic">Liquidity Gate</span>
                  <p className="text-zinc-500 m-0">Assets with under $30k in pool depth are automatically VETOED to prevent high-slippage trap entries.</p>
                </div>
              </li>
              <li className="flex gap-4 items-start">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                <div className="text-xs">
                  <span className="text-white font-bold block mb-1 uppercase tracking-tighter italic">Automatic Hard Stops</span>
                  <p className="text-zinc-500 m-0">Positions that fall 5% below entry are liquidated with FINAL priority to ensure capital survival.</p>
                </div>
              </li>
            </ul>
          </div>
          <div className="space-y-6">
            <h3 className="text-lg font-bold italic uppercase flex items-center gap-3"><Scale className="w-5 h-5 text-blue-400" /> Asset Tiers</h3>
            <div className="space-y-3">
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-1"><span className="text-[9px] font-black text-white uppercase italic">Anchor</span><span className="text-[8px] text-zinc-500 uppercase font-black">BTC / ETH</span></div>
                <p className="text-[10px] text-zinc-500 m-0">Low volatility, high liquidity. Scaled exits at +5% and +12%.</p>
              </div>
              <div className="p-3 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex justify-between items-center mb-1"><span className="text-[9px] font-black text-white uppercase italic">High Alpha</span><span className="text-[8px] text-zinc-500 uppercase font-black">MEMECOINS / DEGEN</span></div>
                <p className="text-[10px] text-zinc-500 m-0">Extreme volatility. Aggressive profit ladders (+20% and +50%) with tight monitoring.</p>
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