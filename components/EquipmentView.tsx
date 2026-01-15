import React, { useState, useEffect } from 'react';
import { getGearRecommendations } from '../services/geminiService';
import { getEquipment, addToCart } from '../services/equipmentService';
import type { Equipment } from '../types/database';

const EquipmentView: React.FC<{ onNavigate: (view: any) => void; onAuthRequired: () => void; isLoggedIn: boolean }> = ({ onNavigate, onAuthRequired, isLoggedIn }) => {
  const [objective, setObjective] = useState('');
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('All');
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [equipmentLoading, setEquipmentLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 加载装备数据
  useEffect(() => {
    loadEquipment();
  }, [activeFilter]);

  const loadEquipment = async () => {
    try {
      setEquipmentLoading(true);
      setError(null);
      const category = activeFilter === 'All' ? undefined : getCategoryMapping(activeFilter);
      const data = await getEquipment(category);
      setEquipment(data);
    } catch (err) {
      console.error('加载装备失败:', err);
      setError('加载装备失败，请稍后重试');
    } finally {
      setEquipmentLoading(false);
    }
  };

  // 映射UI分类到数据库分类
  const getCategoryMapping = (uiCategory: string): string => {
    const mapping: { [key: string]: string } = {
      'Hardware': '五金',
      'Apparel': '服装', 
      'Safety': '安全',
      'Packs': '背包'
    };
    return mapping[uiCategory] || uiCategory;
  };

  // 格式化价格显示
  const formatPrice = (price: number) => `¥${price.toLocaleString()}`;

  const handleGetRecs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) return onAuthRequired();
    if (!objective) return;
    setLoading(true);
    try {
      const recs = await getGearRecommendations(objective);
      setRecommendations(recs);
    } catch (error) {
      console.error('获取推荐失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = async (equipmentId: string) => {
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    
    try {
      await addToCart(equipmentId);
      // 显示成功反馈
      const btn = document.getElementById(`cart-btn-${equipmentId}`);
      if (btn) {
        const originalContent = btn.innerHTML;
        btn.innerHTML = '<span class="material-symbols-outlined">check</span>';
        setTimeout(() => { if (btn) btn.innerHTML = originalContent; }, 1500);
      }
    } catch (err) {
      console.error('添加到购物车失败:', err);
    }
  };

  const categories = ['All', 'Hardware', 'Apparel', 'Safety', 'Packs'];

  if (equipmentLoading) {
    return (
      <div className="relative py-40 px-6 lg:px-24 max-w-[1800px] mx-auto z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-zinc-400">加载装备中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative py-40 px-6 lg:px-24 max-w-[1800px] mx-auto z-10 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={loadEquipment}
            className="bg-accent text-black px-6 py-2 rounded-lg hover:bg-cyan-300 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative py-40 px-6 lg:px-24 max-w-[1800px] mx-auto z-10 space-y-48">
      
      {/* AI 分析区 - 无边界卡片 */}
      <div className="reveal-on-scroll relative group">
        <div className="absolute -inset-20 bg-accent/5 blur-[120px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-[2s]" />
        
        <div className="max-w-4xl">
          <p className="text-accent text-[10px] font-black uppercase tracking-[1em] mb-12">System Intelligence / Gear</p>
          <h2 className="text-7xl lg:text-[10rem] font-black font-display italic uppercase tracking-tighter leading-[0.85] mb-20">
            PRO <br/> <span className="text-white/10">SOLUTIONS</span>
          </h2>
          
          <form onSubmit={handleGetRecs} className="relative flex flex-col md:flex-row gap-6 mb-20">
            <input 
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe your next peak objective..."
              className="flex-1 bg-transparent border-b-2 border-white/10 px-0 py-6 focus:border-accent outline-none transition-all text-2xl font-light placeholder:text-zinc-700"
            />
            <button type="submit" disabled={loading} className="magnetic-btn px-16 py-6 bg-white text-black text-[10px] font-black uppercase tracking-widest disabled:opacity-50">
              {loading ? 'Synthesizing...' : 'Generate Plan'}
            </button>
          </form>

          {recommendations && (
            <div className="reveal-on-scroll glass-premium p-12 rounded-[3rem] animate-in slide-in-from-bottom-8 duration-1000">
               <div className="flex items-center gap-4 mb-10">
                 <div className="size-3 bg-accent rounded-full animate-pulse" />
                 <span className="text-[10px] font-black uppercase tracking-widest text-accent">Optimized Loadout Configuration</span>
               </div>
               <p className="text-2xl text-zinc-300 leading-relaxed font-light italic">{recommendations}</p>
            </div>
          )}
        </div>
      </div>

      {/* 目录区域 */}
      <div className="space-y-32">
        <div className="flex flex-col lg:flex-row items-end justify-between reveal-on-scroll">
          <div>
            <h3 className="text-5xl font-black font-display uppercase italic tracking-tighter">The Vault</h3>
            <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.8em] mt-6">Hardware & Protection</p>
          </div>
          <div className="mt-12 lg:mt-0 flex gap-4 overflow-x-auto no-scrollbar pb-2">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveFilter(cat)} 
                className={`px-10 py-4 rounded-full text-[9px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeFilter === cat ? 'bg-white text-black' : 'text-zinc-500 hover:text-white border border-white/5'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-24">
          {equipment.length === 0 ? (
            <div className="col-span-full text-center py-20">
              <p className="text-zinc-400 text-lg">暂无装备数据</p>
            </div>
          ) : (
            equipment.map((item) => (
              <div 
                key={item.id} 
                className="reveal-on-scroll group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-[3rem] mb-12 shadow-2xl">
                  <img 
                    src={item.image_url || "https://picsum.photos/800/800?random=1"} 
                    alt={item.name} 
                    className="w-full h-full object-cover transition-transform duration-[3s] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all" />
                  <div className="absolute top-8 left-8">
                    <span className="px-6 py-2 glass-premium rounded-full text-[9px] font-black uppercase tracking-widest">{item.category}</span>
                  </div>
                </div>
                <div className="px-6">
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] mb-4">{item.brand}</p>
                  <h3 className="text-3xl font-black uppercase italic tracking-tight mb-6 group-hover:text-accent transition-colors">{item.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-4xl font-black font-display italic text-white/20 group-hover:text-white transition-colors">{formatPrice(item.price)}</span>
                    <button 
                      id={`cart-btn-${item.id}`}
                      onClick={() => handleAddToCart(item.id)}
                      className="magnetic-btn size-16 bg-white/5 backdrop-blur-3xl flex items-center justify-center rounded-2xl border border-white/10 hover:bg-white hover:text-black transition-all"
                    >
                      <span className="material-symbols-outlined">add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentView;