import { useEffect, useState } from 'react';
import { Brain, Target, Cpu, Rocket, Clock } from 'lucide-react';
import { StatusIndicator } from '@/components/common/StatusIndicator';
import { useDashboard } from '@/store/dashboardStore.tsx';

export function TopBar() {
  const { cognitiveMode, resources, evolutionStages } = useDashboard();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const system1Load = resources.find(r => r.name === '系统1（边缘）')?.current || 0;
  const system15Load = resources.find(r => r.name === '系统1.5（缓存）')?.current || 0;
  const system2Load = resources.find(r => r.name === '系统2（云端）')?.current || 0;

  const currentStage = evolutionStages.find(s => s.status === 'in_progress');

  const getModeColor = () => {
    switch (cognitiveMode) {
      case 'auto': return 'text-emerald-400';
      case 'assist': return 'text-amber-400';
      case 'manual': return 'text-red-400';
      case 'evolution': return 'text-purple-400';
    }
  };

  const getModeLabel = () => {
    switch (cognitiveMode) {
      case 'auto': return '自动驾驶';
      case 'assist': return '辅助驾驶';
      case 'manual': return '手动控制';
      case 'evolution': return '进化模式';
    }
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-[#0a0a0f]/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left: Agent Identity */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyan-400 to-purple-600 flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-semibold text-white">Genesis-0</h1>
              <p className="text-xs text-zinc-500">AI Agent 自我意识中心</p>
            </div>
          </div>
          
          <div className="h-6 w-px bg-zinc-800" />
          
          <div className="flex items-center gap-2">
            <span className={`text-xs font-medium ${getModeColor()}`}>
              {getModeLabel()}
            </span>
          </div>
        </div>

        {/* Center: Key Metrics */}
        <div className="flex items-center gap-6">
          {/* Current Goal */}
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-xs text-zinc-500">当前目标</p>
              <p className="text-xs text-white truncate max-w-[150px]">处理客户投诉#2847</p>
            </div>
          </div>

          {/* Cognitive Load */}
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-purple-400" />
            <div>
              <p className="text-xs text-zinc-500">认知负载</p>
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-emerald-400">S1:{system1Load}%</span>
                <span className="text-xs text-amber-400">S1.5:{system15Load}%</span>
                <span className="text-xs text-emerald-400">S2:{system2Load}%</span>
              </div>
            </div>
          </div>

          {/* Evolution Status */}
          <div className="flex items-center gap-2">
            <Rocket className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-xs text-zinc-500">进化状态</p>
              <p className="text-xs text-white">
                {currentStage ? `SSEP - ${currentStage.name}` : 'Genesis-0'}
              </p>
            </div>
          </div>
        </div>

        {/* Right: Time & Status */}
        <div className="flex items-center gap-4">
          <StatusIndicator status="healthy" showLabel label="在线" />
          
          <div className="h-6 w-px bg-zinc-800" />
          
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-zinc-500" />
            <span className="text-xs text-zinc-400 font-mono-data">
              {currentTime.toLocaleTimeString('zh-CN', { hour12: false })}
            </span>
          </div>
          
          <div className="px-2 py-0.5 rounded bg-zinc-800">
            <span className="text-xs text-zinc-500 font-mono-data">
              #{Math.floor(Date.now() / 1000).toString().slice(-6)}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
