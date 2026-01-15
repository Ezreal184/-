import React, { useEffect, useState } from 'react';

interface LandingViewProps {
  onStart: () => void;
}

const LandingView: React.FC<LandingViewProps> = ({ onStart }) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="bg-black text-white selection:bg-accent selection:text-black overflow-x-hidden">
      {/* 沉浸式 Hero Section */}
      <section className="relative h-[160vh] flex items-center justify-center overflow-hidden">
        {/* 背景视差层 */}
        <div 
          className="absolute inset-0 z-0" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2400')",
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transform: `translate3d(0, ${scrollY * 0.35}px, 0) scale(${1 + scrollY * 0.0003})`,
            filter: `blur(${scrollY * 0.003}px) brightness(${1 - scrollY * 0.0004})`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black z-[1]" />
        
        <div className="relative z-10 text-center px-6 mt-[-30vh]">
          {/* 建立日期 - 移动端缩小追踪距离 */}
          <div className="reveal-on-scroll mb-8 md:mb-16">
             <p className="text-accent text-[9px] md:text-[11px] font-black uppercase tracking-[0.8em] md:tracking-[1.5em] italic">
               Establishment 2024
             </p>
          </div>
          
          {/* 主标题 - 响应式字号 */}
          <h1 className="text-[25vw] md:text-[20vw] font-black font-display italic tracking-tighter leading-none mix-blend-difference select-none mb-16 md:mb-24 flex justify-center gap-[2vw]">
            {['V', 'O', 'I', 'D'].map((char, i) => (
              <span key={i} className="reveal-on-scroll letter-reveal" style={{ transitionDelay: `${i * 100}ms` }}>
                <span>{char}</span>
              </span>
            ))}
          </h1>

          {/* 核心动作按钮 */}
          <div className="reveal-on-scroll" style={{ transitionDelay: '500ms' }}>
            <button 
              onClick={onStart}
              className="magnetic-btn group relative px-16 md:px-24 py-8 md:py-10 bg-white text-black font-black text-[9px] md:text-[11px] uppercase tracking-[0.4em] md:tracking-[0.6em] transition-all overflow-hidden shadow-[0_40px_100px_rgba(255,255,255,0.1)]"
            >
              <span className="relative z-10 flex items-center gap-4 md:gap-8">
                Start Expedition
                <span className="material-symbols-outlined text-sm group-hover:translate-x-4 transition-transform">arrow_forward</span>
              </span>
              <div className="absolute inset-0 bg-accent translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500" />
            </button>
          </div>
        </div>

        {/* 侧边视差数据流 - 移动端隐藏以防溢出 */}
        <div 
          className="absolute bottom-40 left-12 lg:left-24 hidden lg:flex items-center gap-10 opacity-30 pointer-events-none"
          style={{ transform: `translateY(${scrollY * -0.15}px)` }}
        >
          <div className="h-px w-24 bg-white" />
          <span className="text-[10px] font-black uppercase tracking-[0.5em] italic">Precision / Will / Peak</span>
        </div>

        <div 
          className="absolute top-1/2 right-12 lg:right-24 hidden lg:flex flex-col items-end gap-4 opacity-20 pointer-events-none"
          style={{ transform: `translateY(${scrollY * 0.12}px)` }}
        >
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">GPS: 27.9881° N</span>
          <span className="text-[9px] font-black uppercase tracking-[0.3em]">ELE: 8,848 M</span>
        </div>
      </section>

      {/* 品牌理念 - 优化响应式排版 */}
      <section className="relative z-10 -mt-[40vh] pb-40 md:pb-80 px-6 lg:px-24 flex flex-col items-center">
        <div className="max-w-7xl w-full">
          <div className="reveal-on-scroll mb-32 md:mb-60 space-y-8 md:space-y-12">
            <h2 className="text-[15vw] md:text-[12vw] font-black font-display italic uppercase leading-[0.85] tracking-tighter">
              <span className="text-accent block reveal-on-scroll">Redefining</span>
              <span className="block reveal-on-scroll" style={{ transitionDelay: '200ms' }}>The Vertical</span> 
              <span className="text-white/10 block reveal-on-scroll" style={{ transitionDelay: '400ms' }}>Reality</span>
            </h2>
            <div className="h-1 md:h-2 w-24 md:w-40 bg-accent reveal-on-scroll" style={{ transitionDelay: '600ms' }} />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 md:gap-60 text-left items-start">
            <div className="space-y-16 md:space-y-24">
              <div className="reveal-on-scroll">
                <p className="text-zinc-500 text-2xl md:text-5xl leading-[1.1] font-light tracking-tight italic">
                  我们不仅仅是一个社区。我们是数字时代下对原始冲动的 <span className="text-white font-medium italic">精准模拟</span> 与致敬。
                </p>
              </div>
              <div className="pt-10 md:pt-20 reveal-on-scroll" style={{ transitionDelay: '300ms' }}>
                 <div className="relative overflow-hidden rounded-[3rem] md:rounded-[4rem] group shadow-2xl">
                   <img src="https://images.unsplash.com/photo-1522163182402-834f871fd851?auto=format&fit=crop&q=80&w=1200" 
                        className="w-full grayscale group-hover:grayscale-0 transition-all duration-[2s] scale-110 group-hover:scale-100" />
                   <div className="absolute inset-0 bg-accent/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                 </div>
              </div>
            </div>

            <div className="space-y-20 md:space-y-40">
              {[
                { phase: "01", title: "Satellite Pulse", desc: "实时接入高分辨率地球观测卫星，为您的每一次足迹提供最精确的坐标锚定与气象模拟。" },
                { phase: "02", title: "Elite Matrix", desc: "仅限受邀的探险者。这里没有噪音，只有最纯粹的巅峰日志与跨越国界的技术交流。" }
              ].map((item, i) => (
                <div key={i} className="reveal-on-scroll group space-y-6 md:space-y-8" style={{ transitionDelay: `${(i+1)*200}ms` }}>
                  <span className="text-accent font-black text-[9px] md:text-[10px] tracking-[0.6em] md:tracking-[1em] uppercase">Phase {item.phase}</span>
                  <h4 className="text-3xl md:text-4xl font-black uppercase italic tracking-tighter group-hover:text-accent transition-colors">{item.title}</h4>
                  <p className="text-zinc-500 leading-relaxed text-lg md:text-xl font-light italic">
                    {item.desc}
                  </p>
                  <div className="h-px w-full bg-white/5 group-hover:bg-accent/50 transition-all duration-700" />
                </div>
              ))}

              <div className="pt-10 md:pt-20 reveal-on-scroll" style={{ transitionDelay: '500ms' }}>
                <button 
                  onClick={onStart}
                  className="px-12 md:px-16 py-6 md:py-8 glass-premium rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.4em] md:tracking-[0.5em] hover:bg-white hover:text-black transition-all hover:scale-105"
                >
                  Join The Inner Circle
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingView;