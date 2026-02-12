import { useEffect, useState } from 'react';
import { Zap, TrendingUp, Lightbulb, Play, Clock, Search } from 'lucide-react';
import { useDashboard } from '@/store/dashboardStore.tsx';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';
import { PulseRing } from '@/components/common/PulseRing';
import { MetricCard } from '@/components/common/MetricCard';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import type { Goal } from '@/types';

// Goal Tree Component
function GoalTree({ goals, level = 0 }: { goals: Goal[]; level?: number }) {
  return (
    <div className="space-y-2">
      {goals.map((goal) => (
        <div key={goal.id} className="animate-slide-in" style={{ animationDelay: `${level * 100}ms` }}>
          <div 
            className={`flex items-center gap-2 p-2 rounded-lg ${
              goal.status === 'in_progress' 
                ? 'bg-cyan-500/10 border border-cyan-500/30' 
                : 'bg-zinc-800/50'
            }`}
            style={{ marginLeft: `${level * 16}px` }}
          >
            <div className={`w-1.5 h-1.5 rounded-full ${
              goal.type === 'mission' ? 'bg-purple-400' :
              goal.type === 'subgoal' ? 'bg-cyan-400' :
              goal.type === 'evolution' ? 'bg-amber-400' :
              'bg-zinc-500'
            }`} />
            <span className={`text-xs ${
              goal.status === 'in_progress' ? 'text-cyan-400 font-medium' : 'text-zinc-400'
            }`}>
              {goal.title}
            </span>
            {goal.status === 'in_progress' && (
              <span className="ml-auto text-[10px] text-cyan-400 animate-pulse">进行中</span>
            )}
          </div>
          {goal.children && <GoalTree goals={goal.children} level={level + 1} />}
        </div>
      ))}
    </div>
  );
}

// Thinking Core Component
function ThinkingCore() {
  const { thinkingState } = useDashboard();
  const [pulsePhase, setPulsePhase] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPulsePhase(p => (p + 1) % 4);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center py-8">
      {/* Outer rings */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-64 h-64 rounded-full border border-cyan-500/20 animate-pulse-ring"
          style={{ animationDuration: '3s' }}
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          className="w-48 h-48 rounded-full border border-purple-500/20 animate-pulse-ring"
          style={{ animationDuration: '2.5s', animationDelay: '0.5s' }}
        />
      </div>
      
      {/* Central core */}
      <PulseRing color="cyan" size="lg">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center border border-cyan-500/30">
          <BrainIcon phase={pulsePhase} />
        </div>
      </PulseRing>

      {/* Status text */}
      <div className="mt-8 text-center space-y-2">
        <h3 className="text-lg font-semibold text-white">{thinkingState.title}</h3>
        <p className="text-sm text-cyan-400">{thinkingState.currentStep}</p>
        
        <div className="flex items-center justify-center gap-6 mt-4">
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">模拟步数</p>
            <p className="text-sm font-mono-data text-white">
              <AnimatedNumber value={thinkingState.simulationStep} />/{thinkingState.totalSteps}
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">置信度</p>
            <p className="text-sm font-mono-data text-cyan-400">
              <AnimatedNumber value={thinkingState.confidence} decimals={0} suffix="%" />
            </p>
          </div>
          <div className="text-center">
            <p className="text-xs text-zinc-500 mb-1">目标</p>
            <p className="text-sm font-mono-data text-zinc-400">
              {thinkingState.targetConfidence}%
            </p>
          </div>
        </div>
      </div>

      {/* Cache hit indicator */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center">
        <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-zinc-800/80 border border-zinc-700">
          <div className="flex items-center gap-2">
            <Zap className="w-3 h-3 text-amber-400" />
            <span className="text-xs text-zinc-400">系统1.5缓存命中</span>
            <span className="text-xs font-mono-data text-amber-400">
              {thinkingState.cacheHitRate}%
            </span>
          </div>
          <div className="w-px h-4 bg-zinc-700" />
          <div className="flex items-center gap-2">
            <Search className="w-3 h-3 text-cyan-400" />
            <span className="text-xs text-zinc-400">相似案例</span>
            <span className="text-xs font-mono-data text-cyan-400">
              {thinkingState.similarCases}个
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Brain icon with animation
function BrainIcon({ phase }: { phase: number }) {
  return (
    <svg 
      className="w-10 h-10 text-cyan-400 transition-all duration-300"
      viewBox="0 0 24 24" 
      fill="currentColor"
      style={{ 
        filter: `drop-shadow(0 0 ${8 + phase * 4}px rgba(0, 212, 255, 0.6))`,
        transform: `scale(${1 + phase * 0.05})`
      }}
    >
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z" />
    </svg>
  );
}

// Decision Bar Component
function DecisionBar() {
  return (
    <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-amber-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white mb-1">
            检测到：系统2推理延迟影响客户响应时间
          </h4>
          <p className="text-xs text-zinc-400 mb-3">
            建议行动（置信度：87%）：升级至OCPU-Pro实例（延迟↓40%，成本↑20%）
          </p>
          <div className="flex gap-2">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
              <Play className="w-3 h-3 mr-1" />
              立即执行
            </Button>
            <Button size="sm" variant="outline" className="border-zinc-700">
              <Clock className="w-3 h-3 mr-1" />
              稍后提醒
            </Button>
            <Button size="sm" variant="outline" className="border-zinc-700">
              <Search className="w-3 h-3 mr-1" />
              深度分析
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Main Component
export function CognitivePanorama() {
  const { goals, resources } = useDashboard();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">认知全景</h2>
          <p className="text-sm text-zinc-500">实时思考状态与资源监控</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-zinc-500">系统2激活中</span>
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left: Goal Hierarchy */}
        <div className="col-span-3">
          <Card className="h-full p-4 bg-[#1a1a24] border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-400" />
              目标层次
            </h3>
            <GoalTree goals={goals} />
          </Card>
        </div>

        {/* Center: Thinking Core */}
        <div className="col-span-6">
          <Card className="h-full p-6 bg-[#1a1a24] border-zinc-800 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 to-transparent" />
            <ThinkingCore />
          </Card>
        </div>

        {/* Right: Resource Gauges */}
        <div className="col-span-3">
          <Card className="h-full p-4 bg-[#1a1a24] border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              认知资源
            </h3>
            <div className="space-y-3">
              {resources.map((resource) => (
                <MetricCard
                  key={resource.name}
                  title={resource.name}
                  value={resource.current}
                  max={resource.max}
                  unit={resource.unit}
                  trend={resource.trend}
                  status={resource.status}
                  className="animate-slide-in"
                />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Bottom: Decision Bar */}
      <DecisionBar />
    </div>
  );
}
