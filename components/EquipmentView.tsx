import React, { useState } from 'react';
import { getGearRecommendations } from '../services/geminiService';

interface Equipment {
  id: number;
  name: string;
  brand: string;
  price: string;
  category: string;
  image: string;
  description?: string;
  gallery?: string[];
  reviews?: { user: string; rating: number; comment: string }[];
}

const MOCK_EQUIPMENT: Equipment[] = [
  { 
    id: 1, 
    name: "Apex 超轻型冰镐", 
    brand: "Alpine Forge", 
    price: "¥2,099", 
    category: "五金", 
    image: "https://picsum.photos/800/800?random=50",
    description: "专为极致攀冰和技术型混合路线设计。Apex 采用航空级铝材手柄与精钢镐头，平衡性卓越，在硬冰中具有极强的穿透力。",
    gallery: [
      "https://picsum.photos/800/800?random=50",
      "https://picsum.photos/800/800?random=150",
      "https://picsum.photos/800/800?random=250"
    ],
    reviews: [
      { user: "Li Wei", rating: 5, comment: "手感极佳，重量分配非常科学。" },
      { user: "Sarah J.", rating: 4, comment: "鎬尖非常锋利，但在极寒环境下把手握感略显生硬。" }
    ]
  },
  { 
    id: 2, 
    name: "Summit 硬壳夹克 V4", 
    brand: "Peak Performance", 
    price: "¥3,849", 
    category: "服装", 
    image: "https://picsum.photos/800/800?random=51",
    description: "全天候保护。采用三层 GORE-TEX Pro 面料，提供顶级的防水透气性能。专为阿尔卑斯式登山设计的剪裁，不影响任何攀爬动作。",
    gallery: [
      "https://picsum.photos/800/800?random=51",
      "https://picsum.photos/800/800?random=151",
      "https://picsum.photos/800/800?random=251"
    ],
    reviews: [
      { user: "Alex S.", rating: 5, comment: "在暴风雪中救了我一命，完全不透水。" }
    ]
  },
  { id: 3, name: "钛合金冰爪 X-Pro", brand: "GripMaster", price: "¥1,289", category: "五金", image: "https://picsum.photos/400/400?random=52" },
  { id: 4, name: "Oxygen 系统 Mini-Flow", brand: "SkyBreath", price: "¥8,500", category: "安全", image: "https://picsum.photos/400/400?random=53" },
  { id: 5, name: "太阳能充电远征背包", brand: "VoltTrail", price: "¥2,340", category: "背包", image: "https://picsum.photos/400/400?random=54" },
  { id: 6, name: "GORE-TEX 保暖手套", brand: "FrostBane", price: "¥895", category: "服装", image: "https://picsum.photos/400/400?random=55" }
];

const EquipmentView: React.FC<{ onNavigate: (view: any) => void; onAuthRequired: () => void; isLoggedIn: boolean }> = ({ onNavigate, onAuthRequired, isLoggedIn }) => {
  const [objective, setObjective] = useState('');
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedGear, setSelectedGear] = useState<Equipment | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const handleGetRecs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    if (!objective) return;
    setLoading(true);
    const recs = await getGearRecommendations(objective);
    setRecommendations(recs);
    setLoading(false);
  };

  const addToCart = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    if (!isLoggedIn) {
      onAuthRequired();
      return;
    }
    const btn = document.getElementById(`cart-btn-${id}`);
    if (btn) {
      const originalContent = btn.innerHTML;
      btn.innerHTML = '<span class="material-symbols-outlined">check</span>';
      setTimeout(() => { if (btn) btn.innerHTML = originalContent; }, 1500);
    }
  };

  const openGearDetail = (item: Equipment) => {
    setSelectedGear(item);
    setActiveGalleryIndex(0);
  };

  const categories = ['全部', '五金', '服装', '安全', '背包'];
  const filteredGear = activeFilter === '全部' ? MOCK_EQUIPMENT : MOCK_EQUIPMENT.filter(item => item.category === activeFilter);

  return (
    <div className="tech-grid min-h-screen">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-20 py-16">
        
        {/* AI 推荐区域 - 增加激光扫描动效 */}
        <div className="bg-zinc-950 rounded-[3rem] p-10 lg:p-16 mb-20 relative overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.3)] group">
          {/* 激光扫描线动画 */}
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-0 group-hover:opacity-100 group-hover:animate-scan z-20 shadow-[0_0_15px_rgba(34,211,238,0.5)]"></div>
          
          <div className="relative z-10 max-w-3xl">
            <div className="flex items-center gap-3 text-cyan-400 mb-6">
              <span className="material-symbols-outlined animate-pulse">query_stats</span>
              <span className="font-black tracking-[0.4em] text-[10px] uppercase">Gear Intelligence Advisor</span>
            </div>
            <h2 className="text-4xl lg:text-6xl font-black font-display mb-10 text-white italic leading-tight">远征方案智能生成</h2>
            <form onSubmit={handleGetRecs} className="flex flex-col md:flex-row gap-4">
              <input 
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                placeholder="描述您的攀登目标，如：'勃朗峰 3日 快速攀登'..."
                className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:ring-2 focus:ring-cyan-400 focus:bg-white/10 outline-none transition-all placeholder:text-white/20 text-white text-lg"
              />
              <button type="submit" disabled={loading} className="bg-white text-black px-12 rounded-2xl font-black text-[10px] uppercase tracking-[0.3em] hover:bg-cyan-400 transition-all active:scale-95 shadow-xl shadow-white/10">
                {loading ? '计算中...' : '生成清单'}
              </button>
            </form>
            
            {recommendations && (
              <div className="mt-12 bg-white/5 backdrop-blur-3xl border border-white/10 p-8 rounded-3xl animate-in zoom-in-95 duration-500 relative">
                <div className="absolute top-4 right-4 text-[8px] font-black uppercase text-white/20 tracking-widest">Optimized Output</div>
                <p className="text-zinc-300 text-base leading-relaxed whitespace-pre-wrap font-medium">{recommendations}</p>
              </div>
            )}
          </div>

          <div className="absolute -bottom-20 -right-20 opacity-5 group-hover:opacity-10 transition-opacity">
            <span className="material-symbols-outlined text-[20rem]">precision_manufacturing</span>
          </div>
        </div>

        {/* 目录筛选 */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
          <div>
            <h2 className="text-4xl font-black font-display uppercase tracking-tighter dark:text-white italic">Technical Catalog</h2>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-[0.5em] mt-2">Professional Alpine Equipment</p>
          </div>
          <div className="flex gap-2 bg-zinc-100 dark:bg-zinc-900/50 p-2 rounded-2xl backdrop-blur-sm">
            {categories.map(cat => (
              <button 
                key={cat} 
                onClick={() => setActiveFilter(cat)} 
                className={`px-6 py-2.5 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all whitespace-nowrap ${activeFilter === cat ? 'bg-primary dark:bg-white text-white dark:text-black shadow-lg' : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-300'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* 装备网格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {filteredGear.map((item) => (
            <div 
              key={item.id} 
              onClick={() => openGearDetail(item)}
              className="group bg-white/60 dark:bg-zinc-900/40 backdrop-blur-xl rounded-[2.5rem] border border-white/50 dark:border-zinc-800 p-6 hover:shadow-2xl hover:-translate-y-3 transition-all duration-700 cursor-pointer"
            >
              <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-800 rounded-[2rem] mb-8 border border-zinc-100 dark:border-zinc-800">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"/>
                <div className="absolute top-5 left-5 bg-zinc-950/80 backdrop-blur-md px-4 py-1.5 rounded-full text-[9px] font-black tracking-[0.2em] uppercase text-white">{item.category}</div>
              </div>
              <p className="text-[10px] font-black text-zinc-400 uppercase tracking-[0.4em] mb-2">{item.brand}</p>
              <h3 className="font-black text-2xl text-zinc-900 dark:text-white mb-6 group-hover:text-primary dark:group-hover:text-zinc-300 transition-colors tracking-tight">{item.name}</h3>
              <div className="flex items-center justify-between border-t border-zinc-50 dark:border-zinc-800 pt-6">
                <span className="text-2xl font-black text-zinc-900 dark:text-white font-display italic">{item.price}</span>
                <button 
                  id={`cart-btn-${item.id}`} 
                  onClick={(e) => addToCart(e, item.id)} 
                  className="size-12 bg-zinc-100 dark:bg-zinc-800 rounded-2xl flex items-center justify-center hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all shadow-sm"
                >
                  <span className="material-symbols-outlined">shopping_cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EquipmentView;
