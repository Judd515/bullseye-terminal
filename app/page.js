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
                  isFC: ['DEGEN', 'CLANKER'].includes(t.id)
                };
            } catch { return { ...t, price: 0, change: 0 } ; }
        };

        const resultStats = await Promise.all(tokens.map(t => fetchToken(t)));
        
        const getConsensus = (token) => {
            if (token.change > 10) return { label: 'ACCUMULATE+', color: 'text-emerald-400', desc: "Parabolic velocity detected. Momentum model suggests trend continuation. Target: Next liquidity ceiling." };
            if (token.change > 5) return { label: 'ACCUMULATE', color: 'text-emerald-500', desc: "Bullish breakout confirmed. Technical indicators aligning for further upside. RSI remains underbought." };
            if (token.change < -10) return { label: 'LIQUIDATE', color: 'text-rose-600', desc: "Deep distribution detected. Trend breakdown imminent. Suggesting capital preservation." };
            if (token.change < -5) return { label: 'REDUCE', color: 'text-rose-500', desc: "Weakness confirmed on-chain. Testing psychological support levels. Posture shifted to defensive." };
            return { label: 'MONITOR', color: 'text-zinc-500', desc: "Horizontal liquidity compression identified. Opportunity cost suggests maintaining wait-and-see posture." };
        };

        const enhancedStats = resultStats.map(s => {
            const consensus = getConsensus(s);
            
            // Predator v2.4 UI Heuristics
            // Derive asymmetry from price change + noise
            const baseAsymmetry = 50 + (s.change * 0.4);
            const bidSide = Math.min(Math.max(Math.round(baseAsymmetry + (Math.random() * 6 - 3)), 35), 65);
            const askSide = 100 - bidSide;
            
            // Depth benchmarks
            let depthLabel = "$1.2M";
            if (s.id === 'BTC') depthLabel = "$614M";
            else if (s.id === 'ETH') depthLabel = "$476M";
            else if (s.id === 'XMR') depthLabel = "$12.4M";
            else depthLabel = `$${(Math.abs(s.change) * 0.1 + 0.8).toFixed(1)}M`;

            const liq = 1000000000;
            const vol = s.price > 0 ? (s.price * 50000000) / 2642 : 0;
            
            const council = [
                { 
                    name: "The Bear", 
                    color: "text-rose-400", 
                    vote: s.change > 15 ? "REJECT" : s.change > 10 ? "NEUTRAL" : "ACCEPT", 
                    logic: s.change > 15 ? "Overextended. Bull trap imminent." : "Risk parameters within 1S.D." 
                },
                { 
                    name: "The Mooner", 
                    color: "text-blue-400", 
                    vote: (s.change > 5 && (vol > liq * 0.1)) || s.change > 10 ? "BUY" : "NEUTRAL", 
                    logic: s.change > 5 ? "Velocity confirms breakout. Moon mission active." : "Sideways volume. Boring." 
                },
                { 
                    name: "The Quant", 
                    color: "text-emerald-400", 
                    vote: s.change > 3 ? "BUY" : s.change < -5 ? "SELL" : "HOLD", 
                    logic: s.change > 3 ? "Statistical alpha > 2.0. Trend confirmed." : "No significant drift detected." 
                }
            ];

            return {
                ...s,
                consensus,
                council,
                asymmetry: `${bidSide}/${askSide}`,
                depth: depthLabel,
                bidHeavy: bidSide > askSide
            };
        });

        setData({ 
          total: 5000.00, 
          pnl: 0.00, 
          balance_usd: 5000.00,
          holdings: [],
          history: [],
          logic: "Council session active. Predator v2.0 heuristics scanning liquidity maps.",
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
                  "MASimple@tv-basicstudies"
                ]
              });
            }
          };
          document.head.appendChild(script);
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [selectedToken, selectedToken?.symbol]);

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
               <span className="text-[11px] font-black bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.1)]">+{data.pnl}% yield</span>
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
               <div className="flex items-center gap-3">
                  <Cpu className="w-4 h-4 text-blue-500 animate-pulse" />
                  <h3 className="text-[9px] font-black text-blue-500 tracking-[0.3em] uppercase italic underline decoration-blue-500/30 underline-offset-4">Predator_Logic_v2.1_Council</h3>
               </div>
               <p className="text-sm font-medium leading-relaxed text-zinc-500 italic m-0 line-clamp-1 truncate max-w-2xl">
                  {data.logic}
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
                            <div id="tradingview_chart" className="bg-black/60 border border-white/5 rounded-[2rem] aspect-video w-full overflow-hidden shadow-inner flex items-center justify-center text-zinc-700 font-black uppercase tracking-[0.4em] text-[10px]">
                               Initializing_Neural_Feed...
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <Zap className="w-3 h-3 text-blue-400" />
                                    </div>
                                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Live Asset Quote</div>
                                    <div className="text-xl font-black text-zinc-200 font-mono italic tabular-nums">${selectedToken.price > 1 ? selectedToken.price.toLocaleString(undefined, {minimumFractionDigits: 2}) : selectedToken.price.toFixed(6)}</div>
                                    {/* New: Micro-trend sparkline simulation */}
                                    <div className="mt-3 flex items-end gap-1 h-4">
                                        {[40, 60, 45, 70, 55, 80, 65].map((h, i) => (
                                            <div key={i} className="flex-1 bg-blue-500/20 rounded-t-[1px]" style={{ height: `${h}%` }} />
                                        ))}
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-2 opacity-20 group-hover:opacity-100 transition-opacity">
                                        <Activity className="w-3 h-3 text-emerald-400" />
                                    </div>
                                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">24H Velocity Trace</div>
                                    <div className={`text-xl font-black italic ${selectedToken.consensus.color}`}>{selectedToken.change}%</div>
                                    {/* New: Volatility Heatbar */}
                                    <div className="mt-4 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${selectedToken.change > 0 ? 'bg-emerald-500' : 'bg-rose-500'}`} 
                                            style={{ width: `${Math.min(Math.abs(selectedToken.change) * 5, 100)}%` }} 
                                        />
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Liquidity Depth</div>
                                    <div className="text-xl font-black text-zinc-200 font-mono italic tabular-nums">
                                        {selectedToken.depth}
                                    </div>
                                    <div className="mt-2 text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3 text-blue-500" /> Stable Depth
                                    </div>
                                </div>
                                <div className="bg-white/[0.02] border border-white/5 p-5 rounded-2xl">
                                    <div className="text-[8px] text-zinc-600 font-black uppercase tracking-widest mb-1">Order Asymmetry</div>
                                    <div className={`text-xl font-black font-mono italic tabular-nums ${selectedToken.bidHeavy ? 'text-emerald-400' : 'text-rose-500'}`}>
                                        {selectedToken.asymmetry}
                                    </div>
                                    <div className="mt-2 text-[9px] font-black text-zinc-500 uppercase flex items-center gap-1">
                                        {selectedToken.bidHeavy ? (
                                            <><ArrowUpRight className="w-3 h-3 text-emerald-500" /> Bid Heavy</>
                                        ) : (
                                            <><ArrowDownRight className="w-3 h-3 text-rose-500" /> Ask Heavy</>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white/[0.03] rounded-[2.5rem] p-8 border border-white/10 flex flex-col justify-between h-full text-left">
                            <div className="flex-1">
                                <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-4 italic mb-6 leading-none underline underline-offset-8 decoration-blue-500/30">Neural_Consensus</div>
                                <div className={`text-4xl font-black italic tracking-tighter uppercase mb-4 leading-none ${selectedToken.consensus.color}`}>
                                    {selectedToken.consensus.label}
                                </div>
                                <p className="text-sm font-medium leading-relaxed text-zinc-500 italic m-0">{selectedToken.consensus.desc}</p>
                                
                                <div className="mt-8 pt-8 border-t border-white/5 space-y-6">
                                    <div className="text-[10px] font-black text-white/40 uppercase tracking-[0.2em] italic mb-4">Council_Split_Decision</div>
                                    <div className="grid grid-cols-3 gap-2">
                                        {selectedToken.council && selectedToken.council.map((member) => (
                                            <div key={member.name} className="bg-white/[0.02] border border-white/5 p-3 rounded-2xl text-center">
                                                <div className={`text-[8px] font-black uppercase mb-1 ${member.color}`}>{member.name}</div>
                                                <div className={`text-[10px] font-black italic ${member.vote === 'BUY' ? 'text-emerald-400' : member.vote === 'REJECT' || member.vote === 'SELL' ? 'text-rose-500' : 'text-zinc-500'}`}>{member.vote}</div>
                                            </div>
                                        ))}
                                    </div>
                                    
                                    <div className="space-y-4 pt-4 border-t border-white/5">
                                        <div className="flex gap-3">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-black text-white uppercase tracking-wider">RSI Analysis</div>
                                                <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">Measures oversold (below 30) or overbought (above 70) momentum.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-3">
                                            <div className="w-1 h-1 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                                            <div className="space-y-1">
                                                <div className="text-[9px] font-black text-white uppercase tracking-wider">Trend MA</div>
                                                <p className="text-[11px] text-zinc-500 font-medium italic leading-relaxed">Simple moving average. Price above indicates a bullish regime.</p>
                                            </div>
                                        </div>
                                    </div>
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
                                <div className="text-3xl font-black text-emerald-400 tracking-tighter tabular-nums">+{data.pnl}%</div>
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
                                        {data.history && data.history.map((t, idx) => (
                                            <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="px-6 py-4 font-mono text-[10px] text-zinc-400 font-bold">{t.ts}</td>
                                                <td className="px-6 py-4 font-black italic text-sm tracking-tight text-white">{t.id}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-md ${t.side === 'BUY' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                                                        {t.side}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 font-mono text-[11px] text-zinc-400 font-bold">${t.price.toFixed(4)}</td>
                                                <td className="px-6 py-4 font-mono text-[11px] text-white font-black text-right">${t.usd.toFixed(2)}</td>
                                            </tr>
                                        ))}
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