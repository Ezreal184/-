
import React, { useEffect, useRef, useState } from 'react';

interface LandingViewProps {
  onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [scrollY, setScrollY] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Parallax scroll listener
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Reveal Intersection Observer
    observer.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setVisibleSections(prev => new Set(prev).add(entry.target.id));
        } else {
          setVisibleSections(prev => {
            const next = new Set(prev);
            next.delete(entry.target.id);
            return next;
          });
        }
      });
    }, { 
      threshold: 0.15,
      rootMargin: "0px 0px -50px 0px"
    });

    const sections = document.querySelectorAll('.reveal-section');
    sections.forEach(section => observer.current?.observe(section));

    return () => {
      observer.current?.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const isVisible = (id: string) => visibleSections.has(id);

  const features = [
    {
      icon: 'auto_awesome',
      title: 'AI 装备顾问',
      desc: '基于 Gemini 3.0，根据您的攀登目标提供毫秒级的技术装备清单建议。'
    },
    {
      icon: 'public',
      title: '全球远征社区',
      desc: '连接从喜马拉雅到阿尔卑斯的所有硬核探险者，实时分享高山日志。'
    },
    {
      icon: 'ac_unit',
      title: '智能气象预警',
      desc: '结合地面站数据与 AI 预测，为您的每一次冲顶提供安全的天气防线。'
    }
  ];

  const futureFeatures = [
    {
      tag: 'Q4 2024',
      title: 'AR 巅峰识别',
      desc: '通过摄像头实时识别视野中的所有山峰高度与路线信息。'
    },
    {
      tag: '2025 EARLY',
      title: '离线 3D 轨迹',
      desc: '即使在无信号的极高海拔，也能拥有精确到米的 3D 导航体验。'
    }
  ];

  return (
    <div className="bg-zinc-950 text-white selection:bg-white selection:text-black overflow-x-hidden">
      {/* Hero Section with Parallax */}
      <section className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40 will-change-transform" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000')",
            transform: `translate3d(0, ${scrollY * 0.3}px, 0) scale(1.1)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-950/20 to-zinc-950" />
        
        <div className="relative z-10 text-center px-6 max-w-4xl py-20">
          <div className="text-white size-16 md:size-24 mx-auto mb-8 md:mb-10 drop-shadow-2xl">
            <span className="material-symbols-outlined text-6xl md:text-8xl">terrain</span>
          </div>
          <h1 className="text-5xl md:text-[11rem] font-black font-display italic text-white tracking-tighter mb-4 uppercase leading-none">
            SUMMIT REACH
          </h1>
          <p className="text-zinc-400 text-sm md:text-2xl font-medium mb-8 md:mb-12 tracking-[0.2em] uppercase">
            地表极限攀登者的数字避风港
          </p>
          <div className="flex flex-col items-center gap-12 md:gap-20">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onStart();
              }}
              className="group relative inline-flex items-center gap-4 bg-white text-zinc-950 px-10 md:px-16 py-4 md:py-6 rounded-none font-black text-xs md:text-sm uppercase tracking-[0.4em] shadow-2xl hover:bg-zinc-200 transition-all active:scale-95"
            >
              开启您的征程
              <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
            </button>
            
            <div className="animate-bounce">
              <span className="material-symbols-outlined text-zinc-500 text-2xl md:text-3xl">expand_more</span>
            </div>
          </div>
        </div>
      </section>


      {/* Feature Highlights */}
      <section id="features" className="reveal-section relative py-20 md:py-32 px-6 lg:px-20 bg-zinc-950">
        <div className={`max-w-[1400px] mx-auto transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) transform ${isVisible('features') ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-20 scale-95'}`}>
          <div className="mb-16 md:mb-24 text-center">
            <h2 className="text-[10px] font-black tracking-[0.5em] text-zinc-500 uppercase mb-4">Core Ecosystem</h2>
            <h3 className="text-3xl md:text-6xl font-black font-display italic uppercase">核心功能</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16">
            {features.map((f, i) => (
              <div key={i} className="group p-8 border border-zinc-800 hover:border-zinc-500 transition-colors">
                <span className="material-symbols-outlined text-5xl text-white mb-8 block group-hover:scale-110 transition-transform">
                  {f.icon}
                </span>
                <h4 className="text-xl font-black uppercase tracking-widest mb-4 font-display italic">{f.title}</h4>
                <p className="text-zinc-500 leading-relaxed text-sm">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Parallax Section */}
      <section className="relative py-24 md:py-48 px-6 lg:px-20 overflow-hidden bg-zinc-950">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-20 will-change-transform" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=2000')",
            transform: `translate3d(0, ${(scrollY - 1500) * 0.15}px, 0) scale(1.1)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div id="stats-text" className={`reveal-section transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${isVisible('stats-text') ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-20'}`}>
            <h2 className="text-3xl md:text-8xl font-black font-display italic uppercase mb-8 leading-tight">致敬向上而生的<br/>探险精神</h2>
            <p className="text-zinc-400 text-base md:text-lg leading-relaxed max-w-md">
              从珠穆朗玛到巴塔哥尼亚，SUMMIT REACH 旨在为每一位踏入垂直荒野的人提供最坚实的数字后盾。
            </p>
          </div>
          <div id="stats-numbers" className={`reveal-section grid grid-cols-2 gap-4 md:gap-8 transition-all duration-1000 delay-150 cubic-bezier(0.4, 0, 0.2, 1) ${isVisible('stats-numbers') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="p-6 md:p-10 bg-white/5 backdrop-blur-md border border-white/10">
              <span className="block text-3xl md:text-5xl font-black font-display mb-2 tracking-tighter italic">8,000M+</span>
              <span className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">覆盖高峰数据</span>
            </div>
            <div className="p-6 md:p-10 bg-white/5 backdrop-blur-md border border-white/10">
              <span className="block text-3xl md:text-5xl font-black font-display mb-2 tracking-tighter italic">120K+</span>
              <span className="text-[8px] md:text-[10px] font-bold text-zinc-500 uppercase tracking-widest">活跃全球探险者</span>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="reveal-section py-20 md:py-32 px-6 lg:px-20 bg-white text-zinc-950">
        <div className={`max-w-[1400px] mx-auto transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${isVisible('roadmap') ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-10'}`}>
          <div className="mb-16 md:mb-24 flex flex-col md:flex-row justify-between items-end gap-6">
            <div>
              <h2 className="text-[10px] font-black tracking-[0.5em] text-zinc-400 uppercase mb-4">Future Horizons</h2>
              <h3 className="text-3xl md:text-6xl font-black font-display italic uppercase">未来蓝图</h3>
            </div>
            <p className="text-zinc-500 font-bold tracking-widest uppercase text-xs">下一代高山探险科技正在酝酿</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
            {futureFeatures.map((f, i) => (
              <div key={i} className="bg-zinc-50 p-8 md:p-12 border-l-8 border-zinc-950 flex flex-col justify-between group hover:bg-zinc-100 transition-colors">
                <div>
                  <span className="inline-block px-3 py-1 bg-zinc-950 text-white text-[8px] font-black tracking-widest uppercase mb-8">
                    {f.tag}
                  </span>
                  <h4 className="text-2xl md:text-3xl font-black font-display italic uppercase mb-6">{f.title}</h4>
                  <p className="text-zinc-600 leading-relaxed max-w-sm">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA with Parallax Background */}
      <section id="final-cta" className="reveal-section relative py-24 md:py-48 text-center px-6 bg-zinc-950 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-30 will-change-transform" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1491555103944-7c647fd857e6?auto=format&fit=crop&q=80&w=2000')",
            transform: `translate3d(0, ${(scrollY - 3000) * 0.2}px, 0) scale(1.1)`,
            transition: 'transform 0.1s ease-out'
          }}
        />
        <div className="absolute inset-0 bg-zinc-950/40" />
        
        <div className={`relative z-10 transition-all duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${isVisible('final-cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-20'}`}>
          <h2 className="text-3xl md:text-7xl font-black font-display italic uppercase mb-8 text-white">巅峰就在彼岸</h2>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onStart();
            }}
            className="group relative inline-flex items-center gap-4 bg-white text-zinc-950 px-12 md:px-20 py-5 md:py-8 rounded-none font-black text-sm md:text-lg uppercase tracking-[0.4em] shadow-2xl hover:bg-zinc-200 transition-all active:scale-95"
          >
            立即加入远征
            <span className="material-symbols-outlined group-hover:translate-x-2 transition-transform">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  );
};

export default LandingView;
