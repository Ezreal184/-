import React, { useState, useRef, useMemo } from 'react';
import { MOCK_POSTS } from '../constants';

const MapView: React.FC = () => {
  const [scale, setScale] = useState(1.0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [activeView, setActiveView] = useState<'topo' | 'satellite'>('topo');

  // 处理足迹数据
  const peaks = useMemo(() => {
    return MOCK_POSTS.map((post, idx) => ({
      ...post,
      x: [400, 1300, 750, 1600, 500, 1100][idx] || 1000,
      y: [700, 450, 1050, 1400, 1650, 850][idx] || 1000,
      elevation: ["8,848m", "8,611m", "8,125m", "8,091m", "4,810m", "3,776m"][idx] || "未知",
      type: idx === 0 ? 'summit' : 'trail-point' // 第一座为当前目标，其余为足迹
    })).sort((a, b) => a.date.localeCompare(b.date));
  }, []);

  // 缩放逻辑
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.4), 4));
  };

  // 拖拽逻辑
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.floating-ui')) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  };

  return (
    <div className="relative w-full h-[calc(100vh-64px)] bg-[#e5e7eb] dark:bg-[#1a1c1e] overflow-hidden select-none font-sans">
      
      {/* 顶部：搜索框与面包屑 (Floating Top Area) */}
      <div className="absolute top-0 left-0 right-0 p-6 pointer-events-none z-40 flex flex-col gap-4 floating-ui">
        <div className="flex flex-col md:flex-row gap-4 items-start w-full">
          {/* 搜索框 */}
          <div className="pointer-events-auto flex items-center bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800 w-full max-w-md h-12 px-4">
            <span className="material-symbols-outlined text-gray-400">search</span>
            <input 
              className="flex-1 bg-transparent border-none focus:ring-0 text-base font-normal placeholder:text-gray-400 dark:text-white" 
              placeholder="搜索高峰, 轨迹, 坐标..." 
              type="text"
            />
            <span className="material-symbols-outlined text-gray-400 cursor-pointer hover:text-primary">filter_list</span>
          </div>
          
          {/* 面包屑导航 */}
          <div className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md rounded-lg shadow-sm border border-gray-100 dark:border-zinc-800">
            <span className="text-[#6a817d] dark:text-zinc-400 text-sm font-medium">喜马拉雅山脉</span>
            <span className="material-symbols-outlined text-xs text-zinc-400">chevron_right</span>
            <span className="text-[#6a817d] dark:text-zinc-400 text-sm font-medium">尼泊尔</span>
            <span className="material-symbols-outlined text-xs text-zinc-400">chevron_right</span>
            <span className="text-zinc-900 dark:text-white text-sm font-bold">萨加玛塔国家公园</span>
          </div>
        </div>

        {/* 快速分类标签 (Filter Chips) */}
        <div className="pointer-events-auto flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          <button className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-[#339988] text-white px-4 shadow-md">
            <span className="material-symbols-outlined text-sm">mountain_flag</span>
            <p className="text-sm font-medium uppercase tracking-tighter">山峰</p>
            <span className="material-symbols-outlined text-sm">expand_more</span>
          </button>
          {['轨迹', '等高线', '天气'].map(label => (
            <button key={label} className="flex h-9 shrink-0 items-center justify-center gap-2 rounded-lg bg-white dark:bg-zinc-900 dark:text-white px-4 shadow-sm border border-gray-100 dark:border-zinc-800">
              <p className="text-sm font-medium uppercase tracking-tighter">{label}</p>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </button>
          ))}
        </div>
      </div>

      {/* 地图核心渲染引擎 */}
      <div 
        className="absolute inset-0 transition-transform duration-100 ease-out cursor-grab active:cursor-grabbing"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={() => setIsDragging(false)}
        onMouseLeave={() => setIsDragging(false)}
      >
        <div 
          className="absolute inset-0"
          style={{ 
            transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
            width: '2400px', height: '2400px',
            left: '50%', top: '50%', marginLeft: '-1200px', marginTop: '-1200px'
          }}
        >
          {/* 地貌渲染层 */}
          <svg width="2400" height="2400" className="absolute inset-0">
            <defs>
              <pattern id="grid" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 100 0 L 0 0 0 100" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-gray-200 dark:text-zinc-800" />
              </pattern>
            </defs>
            <rect width="2400" height="2400" fill="url(#grid)" />
            
            {/* 抽象地形区域 (浅色地貌块) */}
            <path d="M300,800 Q600,600 900,900 T1500,700 L1800,1200 Q1500,1500 1000,1400 T300,1200 Z" fill="#d1fae5" opacity="0.4" className="dark:fill-emerald-950/20" />
            <path d="M1200,300 Q1500,200 1800,400 L2000,900 Q1700,800 1400,900 Z" fill="#fecaca" opacity="0.2" className="dark:fill-red-950/10" />
            
            {/* 足迹连接轨迹 (Subtle Trail) */}
            <polyline 
              points={peaks.map(p => `${p.x},${p.y}`).join(' ')}
              fill="none"
              stroke="#94a3b8"
              strokeWidth="1.5"
              strokeDasharray="5,5"
              className="opacity-50"
            />
          </svg>

          {/* 交互标记点与标签 */}
          {peaks.map((peak) => (
            <div 
              key={peak.id}
              className="absolute z-30"
              style={{ left: `${peak.x}px`, top: `${peak.y}px`, transform: 'translate(-50%, -50%)' }}
            >
              <div className="flex flex-col items-center">
                {/* 标记点 */}
                <div className={`size-3 rounded-full border-2 border-white shadow-lg ${peak.title.includes('珠穆朗玛') ? 'bg-red-500' : 'bg-[#339988]'}`} />
                {/* 标签 */}
                <div className="mt-2 px-2 py-0.5 bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded border border-gray-200 dark:border-zinc-700 shadow-sm whitespace-nowrap">
                  <p className="text-[10px] font-bold text-zinc-900 dark:text-white uppercase">
                    {peak.title} ({peak.elevation})
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 右侧：地图控制按钮 (Action Stack) */}
      <div className="absolute top-6 right-6 z-40 floating-ui">
        {/* 指南针 */}
        <div className="size-12 rounded-full bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-center border border-gray-100 dark:border-zinc-800 shadow-lg">
          <div className="relative w-full h-full flex items-center justify-center">
            <span className="absolute top-1 text-[8px] font-black text-zinc-400">N</span>
            <span className="material-symbols-outlined text-[#339988] text-xl">navigation</span>
          </div>
        </div>
      </div>

      <div className="absolute bottom-12 right-8 z-40 flex flex-col gap-3 floating-ui">
        {/* 缩放按钮 */}
        <div className="flex flex-col rounded-xl bg-white dark:bg-zinc-900 shadow-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
          <button onClick={() => setScale(s => Math.min(s + 0.2, 4))} className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors border-b border-gray-100 dark:border-zinc-800">
            <span className="material-symbols-outlined text-zinc-800 dark:text-white">add</span>
          </button>
          <button onClick={() => setScale(s => Math.max(s - 0.2, 0.4))} className="p-3 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-colors">
            <span className="material-symbols-outlined text-zinc-800 dark:text-white">remove</span>
          </button>
        </div>
        
        {/* 我的位置 */}
        <button className="p-4 bg-[#339988] text-white rounded-xl shadow-2xl hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined">my_location</span>
        </button>
        
        {/* 3D 切换 */}
        <button className="p-4 bg-white dark:bg-zinc-900 text-zinc-800 dark:text-white rounded-xl shadow-2xl border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800 transition-all">
          <span className="material-symbols-outlined">3d_rotation</span>
        </button>
      </div>

      {/* 左下角：坐标与比例尺 (Coordinates & Scale) */}
      <div className="absolute bottom-10 left-8 flex items-end gap-8 pointer-events-none z-40">
        <div className="bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-gray-100 dark:border-zinc-800 shadow-sm pointer-events-auto">
          <p className="text-[10px] font-black text-zinc-400 tracking-widest uppercase mb-1">坐标</p>
          <p className="text-xs font-mono text-zinc-900 dark:text-white">27° 59' 17" N, 86° 55' 31" E</p>
        </div>
        
        {/* 可视化比例尺 */}
        <div className="flex flex-col gap-1 pb-1">
          <div className="flex justify-between w-24">
            <span className="text-[10px] font-bold dark:text-zinc-400">0</span>
            <span className="text-[10px] font-bold dark:text-zinc-400">{Math.round(5 / scale)}km</span>
          </div>
          <div className="h-1.5 w-24 bg-white dark:bg-zinc-800 border border-zinc-900 dark:border-white relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1/2 bg-zinc-900 dark:bg-white"></div>
          </div>
        </div>
      </div>

      {/* 底部：模式切换工具栏 (Map Toolbar) */}
      <div className="absolute bottom-0 left-0 right-0 h-14 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-t border-gray-100 dark:border-zinc-800 flex items-center justify-between px-8 z-50 floating-ui">
        <div className="flex gap-8 pointer-events-auto">
          <button 
            onClick={() => setActiveView('topo')}
            className={`flex items-center gap-2 transition-colors ${activeView === 'topo' ? 'text-[#339988]' : 'text-zinc-400'}`}
          >
            <span className="material-symbols-outlined text-xl">map</span>
            <span className="text-[10px] font-black uppercase tracking-widest">地形图</span>
          </button>
          <button 
            onClick={() => setActiveView('satellite')}
            className={`flex items-center gap-2 transition-colors ${activeView === 'satellite' ? 'text-[#339988]' : 'text-zinc-400'}`}
          >
            <span className="material-symbols-outlined text-xl">satellite_alt</span>
            <span className="text-[10px] font-black uppercase tracking-widest">卫星图</span>
          </button>
          <button className="flex items-center gap-2 text-zinc-400 hover:text-[#339988] transition-colors">
            <span className="material-symbols-outlined text-xl">straighten</span>
            <span className="text-[10px] font-black uppercase tracking-widest">测量</span>
          </button>
        </div>
        <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest">
           巅峰导航系统 ©2024 PEAKFINDER INC.
        </div>
      </div>
    </div>
  );
};

export default MapView;