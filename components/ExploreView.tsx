import React, { useState, useEffect } from 'react';
import { searchMountains, getGeminiResponse } from '../services/geminiService';

interface ExploreViewProps {
  initialQuery?: string;
  onNavigate: (view: any, query?: string) => void;
  onAuthRequired: () => void;
  isLoggedIn: boolean;
}

const ExploreView: React.FC<ExploreViewProps> = ({ initialQuery = '', onNavigate, onAuthRequired, isLoggedIn }) => {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<{text: string, sources: any[]} | null>(null);
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(false);

  useEffect(() => {
    if (initialQuery) {
      setQuery(initialQuery);
      handleSearch(undefined, initialQuery);
    }
  }, [initialQuery]);

  const handleSearch = async (e?: React.FormEvent, directQuery?: string) => {
    if (e) e.preventDefault();
    const activeQuery = directQuery || query;
    if (!activeQuery.trim()) return;
    if (!isLoggedIn) { onAuthRequired(); return; }
    
    setLoading(true);
    setPlan(null);
    try {
      const data = await searchMountains(activeQuery);
      setResult(data);
    } catch (err) {
      console.error('搜索失败:', err);
      setResult({
        text: '搜索服务暂时不可用，请稍后重试。',
        sources: []
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    if (!result) return;
    setLoadingPlan(true);
    try {
      const planText = await getGeminiResponse(`为攀登 ${query} 生成详细的远征计划，包括准备阶段、攀登路线和安全注意事项。请用中文回答。`);
      setPlan(planText);
    } catch (error) {
      console.error('生成计划失败:', error);
      setPlan('计划生成服务暂时不可用，请稍后重试。');
    } finally {
      setLoadingPlan(false);
    }
  };

  return (
    <div className="relative py-32 px-6 lg:px-24 max-w-[1800px] mx-auto z-10 space-y-48">
      {/* 搜索核心区 */}
      <div className="reveal-on-scroll max-w-4xl">
        <p className="text-accent text-[10px] font-black uppercase tracking-[1em] mb-12">Search / Pulse Engine</p>
        <h2 className="text-7xl lg:text-[10rem] font-black font-display italic uppercase tracking-tighter leading-[0.85] mb-20">
          GLOBAL <br/> <span className="text-white/10">VERTICAL</span>
        </h2>
        
        <form onSubmit={handleSearch} className="relative group mb-32">
          <input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Input coordinates or mountain names..."
            className="w-full bg-transparent border-b-2 border-white/10 px-0 py-8 focus:border-accent outline-none transition-all text-4xl font-light placeholder:text-zinc-800"
          />
          <button type="submit" disabled={loading} className="absolute right-0 bottom-8 text-zinc-500 hover:text-white transition-colors">
            {loading ? <span className="material-symbols-outlined animate-spin">sync</span> : <span className="material-symbols-outlined text-4xl">north_east</span>}
          </button>
        </form>

        {!result && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 opacity-60">
            {['K2 Extreme', 'Eiger North Wall', 'Annapurna Circuit'].map(hint => (
              <button 
                key={hint} 
                onClick={() => {setQuery(hint); handleSearch(undefined, hint);}}
                className="text-left group"
              >
                <span className="text-[9px] font-black text-zinc-600 uppercase tracking-widest block mb-4 group-hover:text-accent transition-colors">Quick Scan</span>
                <span className="text-2xl font-black font-display italic uppercase border-b border-transparent group-hover:border-white transition-all">{hint}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 结果显示区 */}
      {result && (
        <div className="reveal-on-scroll space-y-24">
          <div className="glass-premium p-16 rounded-[4rem] relative overflow-hidden">
             {/* 模拟扫描线效果 */}
             <div className="absolute top-0 left-0 w-full h-px bg-accent/20 animate-[scan_4s_linear_infinite]" />
             
             <div className="flex flex-col lg:flex-row justify-between items-start gap-12 mb-16">
               <div className="space-y-4">
                 <h3 className="text-5xl font-black font-display italic uppercase tracking-tighter">Intelligence Briefing</h3>
                 <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.5em]">Synchronized at current geo-node</p>
               </div>
               <button 
                onClick={handleGeneratePlan}
                disabled={loadingPlan}
                className="magnetic-btn px-16 py-6 bg-white text-black text-[11px] font-black uppercase tracking-widest disabled:opacity-50"
               >
                 {loadingPlan ? 'Generating...' : 'Generate Tactical Plan'}
               </button>
             </div>

             <div className="prose prose-invert prose-2xl max-w-none text-zinc-300 leading-relaxed italic mb-20 font-light">
               {result.text}
             </div>

             {plan && (
               <div className="bg-white/5 p-12 rounded-[3rem] animate-in slide-in-from-bottom-8 duration-700">
                  <h4 className="text-accent text-[10px] font-black uppercase tracking-[0.8em] mb-12">Expedition Blueprint</h4>
                  <div className="space-y-8">
                    {plan.split('\n').filter(p => p.trim()).map((step, i) => (
                      <div key={i} className="flex gap-8 group">
                        <span className="text-4xl font-display italic font-black text-white/10 group-hover:text-accent transition-colors">{String(i+1).padStart(2, '0')}</span>
                        <p className="text-xl text-zinc-400 group-hover:text-white transition-colors">{step}</p>
                      </div>
                    ))}
                  </div>
               </div>
             )}

             {result.sources && result.sources.length > 0 && (
               <div className="mt-20 pt-20 border-t border-white/5">
                 <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest mb-10">Verification Sources</p>
                 <div className="flex flex-wrap gap-6">
                   {result.sources.map((s, i) => (
                     <a key={i} href={s.uri} target="_blank" rel="noopener noreferrer" className="px-8 py-4 bg-white/5 hover:bg-white hover:text-black rounded-full text-[10px] font-black uppercase tracking-widest transition-all">
                       {s.title}
                     </a>
                   ))}
                 </div>
               </div>
             )}
          </div>
        </div>
      )}
      <style>{`
        @keyframes scan {
          0% { top: 0%; opacity: 0; }
          50% { opacity: 1; }
          100% { top: 100%; opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default ExploreView;