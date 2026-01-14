
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

const EquipmentView: React.FC<{ onNavigate: (view: any) => void; isLoggedIn: boolean }> = ({ onNavigate, isLoggedIn }) => {
  const [objective, setObjective] = useState('');
  const [recommendations, setRecommendations] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState('全部');
  const [selectedGear, setSelectedGear] = useState<Equipment | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  const handleGetRecs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoggedIn) {
      onNavigate('auth');
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
      onNavigate('auth');
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
    <div className="max-w-[1200px] mx-auto px-6 lg:px-20 py-12">
      {/* AI 推荐区域 */}
      <div className="bg-primary rounded-none p-8 lg:p-12 mb-16 relative overflow-hidden text-white">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2 text-white mb-4">
            <span className="material-symbols-outlined fill-[1]">auto_awesome</span>
            <span className="font-bold tracking-widest text-[10px] uppercase">AI 装备顾问</span>
          </div>
          <h2 className="text-4xl font-black font-display mb-6">您的目标是什么？</h2>
          <form onSubmit={handleGetRecs} className="flex gap-3">
            <input 
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="例如：秋季攀登阿玛达布拉姆峰..."
              className="flex-1 bg-white/10 border border-white/20 rounded-none px-6 py-4 focus:ring-1 focus:ring-white focus:border-transparent outline-none transition-all placeholder:text-white/40 text-white"
            />
            <button type="submit" disabled={loading} className="bg-white text-black px-8 rounded-none font-bold text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all">
              {loading ? '分析中...' : '获取清单'}
            </button>
          </form>
          {recommendations && (
            <div className="mt-8 bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-none animate-in fade-in zoom-in-95 duration-300">
              <p className="text-white text-sm leading-relaxed whitespace-pre-wrap">{recommendations}</p>
            </div>
          )}
        </div>
      </div>

      {/* 目录筛选 */}
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-6">
        <h2 className="text-3xl font-black font-display uppercase tracking-tight dark:text-white">技术目录</h2>
        <div className="flex gap-4 overflow-x-auto no-scrollbar w-full md:w-auto">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveFilter(cat)} className={`px-4 py-2 text-[10px] font-bold tracking-widest uppercase transition-all whitespace-nowrap ${activeFilter === cat ? 'text-primary dark:text-white border-b-2 border-primary dark:border-white' : 'text-zinc-400 hover:text-zinc-600'}`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 装备网格 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredGear.map((item) => (
          <div 
            key={item.id} 
            onClick={() => openGearDetail(item)}
            className="group bg-white dark:bg-zinc-900 rounded-none border border-zinc-100 dark:border-zinc-800 p-4 hover:shadow-xl transition-all duration-500 cursor-pointer"
          >
            <div className="relative aspect-square overflow-hidden bg-zinc-50 dark:bg-zinc-800 mb-6">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"/>
              <div className="absolute top-4 left-4 bg-white/90 dark:bg-zinc-900/90 px-3 py-1 text-[8px] font-black tracking-widest uppercase text-zinc-900 dark:text-white">{item.category}</div>
            </div>
            <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest mb-1">{item.brand}</p>
            <h3 className="font-bold text-lg text-zinc-900 dark:text-white mb-4 group-hover:text-primary dark:group-hover:text-zinc-300 transition-colors">{item.name}</h3>
            <div className="flex items-center justify-between">
              <span className="text-xl font-black text-zinc-900 dark:text-white font-display">{item.price}</span>
              <button 
                id={`cart-btn-${item.id}`} 
                onClick={(e) => addToCart(e, item.id)} 
                className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-none hover:bg-primary hover:text-white dark:hover:bg-white dark:hover:text-black transition-all"
              >
                <span className="material-symbols-outlined">add_shopping_cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* 装备详情模态框 */}
      {selectedGear && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setSelectedGear(null)} />
          <div className="relative w-full max-w-5xl bg-white dark:bg-zinc-950 shadow-2xl overflow-hidden flex flex-col md:flex-row h-full max-h-[90vh] animate-in zoom-in-95 duration-500">
            {/* 左侧：图片库 */}
            <div className="w-full md:w-1/2 bg-zinc-100 dark:bg-zinc-900 flex flex-col p-4 md:p-8">
              <div className="flex-1 relative overflow-hidden bg-white dark:bg-zinc-800 flex items-center justify-center">
                <img 
                  src={selectedGear.gallery?.[activeGalleryIndex] || selectedGear.image} 
                  alt={selectedGear.name}
                  className="w-full h-full object-contain p-4"
                />
                <button 
                  onClick={() => setSelectedGear(null)} 
                  className="absolute top-4 left-4 size-10 flex md:hidden items-center justify-center bg-black/20 text-white rounded-full"
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              
              {selectedGear.gallery && (
                <div className="flex gap-2 mt-4 justify-center">
                  {selectedGear.gallery.map((img, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`size-16 border-2 transition-all overflow-hidden bg-white ${activeGalleryIndex === idx ? 'border-primary dark:border-white' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 右侧：详细内容 */}
            <div className="w-full md:w-1/2 overflow-y-auto p-8 lg:p-12 flex flex-col">
              <button 
                onClick={() => setSelectedGear(null)} 
                className="hidden md:flex absolute top-8 right-8 size-10 items-center justify-center text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
              >
                <span className="material-symbols-outlined text-2xl">close</span>
              </button>

              <div className="mb-8">
                <p className="text-[10px] font-black text-primary dark:text-zinc-500 tracking-[0.3em] uppercase mb-2">{selectedGear.brand}</p>
                <h2 className="text-3xl lg:text-4xl font-black font-display italic text-zinc-900 dark:text-white uppercase leading-tight mb-4">
                  {selectedGear.name}
                </h2>
                <p className="text-2xl font-black text-zinc-900 dark:text-white font-display mb-6">{selectedGear.price}</p>
                
                <div className="h-px w-12 bg-zinc-200 dark:bg-zinc-800 mb-6" />
                
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-3">产品描述</h4>
                <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed text-sm mb-10">
                  {selectedGear.description || "暂无详细描述，该装备旨在为严苛的高山环境提供可靠的支持。"}
                </p>

                <div className="flex gap-4">
                  <button 
                    onClick={(e) => addToCart(e, selectedGear.id)}
                    className="flex-1 bg-primary dark:bg-white text-white dark:text-black py-4 font-bold text-xs uppercase tracking-widest hover:opacity-90 transition-all flex items-center justify-center gap-3"
                  >
                    <span className="material-symbols-outlined">add_shopping_cart</span>
                    加入购物车
                  </button>
                  <button className="px-6 py-4 border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 transition-colors">
                    <span className="material-symbols-outlined text-zinc-600 dark:text-zinc-400">favorite</span>
                  </button>
                </div>
              </div>

              {/* 用户评价 */}
              <div className="mt-auto pt-10 border-t border-zinc-100 dark:border-zinc-800">
                <h4 className="text-[10px] font-black text-zinc-400 uppercase tracking-widest mb-6">探险者评价</h4>
                {selectedGear.reviews ? (
                  <div className="space-y-6">
                    {selectedGear.reviews.map((rev, i) => (
                      <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-zinc-900 dark:text-zinc-200">{rev.user}</span>
                          <div className="flex text-amber-400">
                            {[...Array(5)].map((_, j) => (
                              <span key={j} className="material-symbols-outlined text-xs fill-[1]">
                                {j < rev.rating ? 'star' : 'star_outline'}
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">"{rev.comment}"</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-zinc-400 italic">暂无评价，成为第一个分享使用体验的探险者。</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentView;
