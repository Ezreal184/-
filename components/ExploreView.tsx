
import React, { useState, useEffect } from 'react';
import { searchMountains } from '../services/geminiService';

interface ExploreViewProps {
  initialQuery?: string;
  // Fix: Added missing onNavigate and isLoggedIn properties to match props passed in App.tsx
  onNavigate: (view: any, query?: string) => void;
  isLoggedIn: boolean;
}

const ExploreView: React.FC<ExploreViewProps> = ({ initialQuery = '', onNavigate, isLoggedIn }) => {
  const [query, setQuery] = useState(initialQuery);
  const [result, setResult] = useState<{text: string, sources: any[]} | null>(null);
  const [loading, setLoading] = useState(false);

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
    
    setLoading(true);
    try {
      const data = await searchMountains(activeQuery);
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-20 py-12">
      <div className="mb-12 text-center">
        <h2 className="text-4xl font-black font-display mb-4">发现您的下一座顶峰</h2>
        <p className="text-zinc-500 max-w-xl mx-auto">获取全球山峰的实时数据，由谷歌搜索和 Alpine AI 共同驱动。</p>
        
        <form onSubmit={handleSearch} className="mt-8 max-w-2xl mx-auto flex gap-2">
          <div className="flex-1 bg-white border-2 border-zinc-100 rounded-2xl flex items-center px-4 focus-within:border-primary transition-all shadow-sm">
            <span className="material-symbols-outlined text-zinc-400">search</span>
            <input 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="例如：勃朗峰、K2 现状、多洛米蒂路线..." 
              className="w-full py-4 border-none focus:ring-0 text-zinc-700"
            />
          </div>
          <button 
            type="submit"
            disabled={loading}
            className="bg-primary text-white px-8 rounded-2xl font-bold hover:bg-opacity-90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? <span className="animate-spin material-symbols-outlined">progress_activity</span> : '探索'}
          </button>
        </form>
      </div>

      {result && (
        <div className="bg-white rounded-3xl p-8 border border-zinc-100 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="prose prose-zinc max-w-none">
            <h3 className="text-2xl font-bold font-display text-primary mb-6 flex items-center gap-2">
              <span className="material-symbols-outlined">landscape</span>
              智能搜索结果
            </h3>
            <div className="text-zinc-700 leading-relaxed whitespace-pre-wrap text-lg">
              {result.text}
            </div>
          </div>

          {result.sources.length > 0 && (
            <div className="mt-10 pt-6 border-t border-zinc-100">
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4">已验证来源</h4>
              <div className="flex flex-wrap gap-3">
                {result.sources.map((source, i) => (
                  <a 
                    key={i} 
                    href={source.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-zinc-50 hover:bg-zinc-100 px-4 py-2 rounded-full text-xs font-semibold text-zinc-600 transition-colors border border-zinc-200"
                  >
                    <span className="material-symbols-outlined text-sm">link</span>
                    {source.title}
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {!result && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60">
          {['马特洪峰', '珠穆朗玛峰', '富士山'].map(peak => (
            <div 
              key={peak}
              onClick={() => { setQuery(peak); handleSearch(undefined, peak); }}
              className="cursor-pointer border-2 border-dashed border-zinc-200 rounded-2xl p-6 hover:border-primary hover:text-primary transition-all text-center"
            >
              <span className="material-symbols-outlined text-3xl mb-2">explore</span>
              <p className="font-bold">探索{peak}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExploreView;
