import { useState, useRef, useEffect } from 'react';
import { Rocket, CheckCircle, Clock, AlertTriangle, Terminal, Cpu, Play, Pause, RotateCcw } from 'lucide-react';
import { useDashboard } from '@/store/dashboardStore.tsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { EvolutionStage, EvolutionTask, LogEntry } from '@/types';

// Stage Progress Bar
function StageProgress({ stages }: { stages: EvolutionStage[] }) {
  const currentIndex = stages.findIndex(s => s.status === 'in_progress');

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-zinc-500">SSEP进化状态</span>
        <span className="text-xs text-cyan-400">Genesis-0 → Genesis-1</span>
      </div>
      
      <div className="relative">
        {/* Progress line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-zinc-800">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-cyan-400 to-purple-500 transition-all duration-500"
            style={{ width: `${((currentIndex + 0.5) / stages.length) * 100}%` }}
          />
        </div>

        {/* Stage nodes */}
        <div className="relative flex justify-between">
          {stages.map((stage) => {
            const isCompleted = stage.status === 'completed';
            const isInProgress = stage.status === 'in_progress';
            const isPending = stage.status === 'pending';

            return (
              <div key={stage.id} className="flex flex-col items-center">
                <div 
                  className={`
                    w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300
                    ${isCompleted ? 'bg-emerald-500 border-emerald-500' : ''}
                    ${isInProgress ? 'bg-cyan-500 border-cyan-500 animate-pulse' : ''}
                    ${isPending ? 'bg-zinc-800 border-zinc-700' : ''}
                  `}
                >
                  {isCompleted && <CheckCircle className="w-4 h-4 text-white" />}
                  {isInProgress && <Rocket className="w-4 h-4 text-white" />}
                  {isPending && <Clock className="w-4 h-4 text-zinc-500" />}
                </div>
                <span className={`text-[10px] mt-2 ${isInProgress ? 'text-cyan-400' : 'text-zinc-500'}`}>
                  {stage.name}
                </span>
                <span className="text-[9px] text-zinc-600">{stage.duration}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Task List
function TaskList({ tasks }: { tasks: EvolutionTask[] }) {
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div 
          key={task.id}
          className={`
            p-3 rounded-lg border transition-all duration-300
            ${task.status === 'completed' ? 'bg-emerald-500/10 border-emerald-500/30' : ''}
            ${task.status === 'in_progress' ? 'bg-cyan-500/10 border-cyan-500/30' : ''}
            ${task.status === 'pending' ? 'bg-zinc-800/50 border-zinc-700' : ''}
          `}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {task.status === 'completed' && <CheckCircle className="w-4 h-4 text-emerald-400" />}
              {task.status === 'in_progress' && <Rocket className="w-4 h-4 text-cyan-400 animate-pulse" />}
              {task.status === 'pending' && <Clock className="w-4 h-4 text-zinc-500" />}
              <span className={`text-sm ${task.status === 'pending' ? 'text-zinc-500' : 'text-white'}`}>
                {task.name}
              </span>
            </div>
            <span className={`text-xs ${
              task.status === 'completed' ? 'text-emerald-400' :
              task.status === 'in_progress' ? 'text-cyan-400' :
              'text-zinc-500'
            }`}>
              {task.status === 'completed' ? '完成' :
               task.status === 'in_progress' ? '进行中' :
               '待启动'}
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Progress value={task.progress} className="h-1.5" />
            </div>
            <span className="text-xs font-mono-data text-zinc-400">{task.progress}%</span>
          </div>

          {task.estimatedCompletion && (
            <div className="flex items-center gap-4 mt-2 text-[10px] text-zinc-500">
              <span>预计完成：{task.estimatedCompletion}</span>
              {task.cost && <span>成本：{task.cost}</span>}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// Log Stream
function LogStream({ logs }: { logs: LogEntry[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  const getLogIcon = (type: string) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-3 h-3 text-amber-400" />;
      case 'error':
        return <AlertTriangle className="w-3 h-3 text-red-400" />;
      case 'decision':
        return <CheckCircle className="w-3 h-3 text-cyan-400" />;
      default:
        return <Terminal className="w-3 h-3 text-zinc-500" />;
    }
  };

  const getLogColor = (type: string) => {
    switch (type) {
      case 'warning':
        return 'text-amber-400';
      case 'error':
        return 'text-red-400';
      case 'decision':
        return 'text-cyan-400';
      default:
        return 'text-zinc-400';
    }
  };

  return (
    <Card className="h-[300px] bg-[#0a0a0f] border-zinc-800">
      <div className="flex items-center justify-between p-3 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span className="text-sm font-medium text-white">实时日志</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-zinc-500">实时</span>
        </div>
      </div>
      
      <ScrollArea className="h-[calc(300px-48px)]" ref={scrollRef}>
        <div className="p-3 space-y-1 font-mono-data text-xs">
          {logs.map((log, index) => (
            <div 
              key={index}
              className="flex items-start gap-2 animate-fade-in"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <span className="text-zinc-600 whitespace-nowrap">[{log.timestamp}]</span>
              {getLogIcon(log.type)}
              <span className={getLogColor(log.type)}>{log.message}</span>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
}

// Decision Panel
function DecisionPanel() {
  return (
    <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-white mb-2">决策请求：时序收敛与功耗权衡</h4>
          
          <div className="grid grid-cols-3 gap-3 mb-4 text-xs">
            <div className="p-2 rounded-lg bg-zinc-800/50">
              <span className="text-zinc-500 block mb-1">时序</span>
              <span className="text-emerald-400">满足 500MHz（目标）</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-800/50">
              <span className="text-zinc-500 block mb-1">功耗</span>
              <span className="text-amber-400">15.2W（超支 1.3%）</span>
            </div>
            <div className="p-2 rounded-lg bg-zinc-800/50">
              <span className="text-zinc-500 block mb-1">面积</span>
              <span className="text-amber-400">412 mm²（超支 3%）</span>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="p-3 rounded-lg border border-zinc-700 bg-zinc-800/30">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-sm font-medium text-white mb-1">选项A：接受当前解</h5>
                  <p className="text-xs text-red-400">风险：轻微超预算，可能影响良率</p>
                </div>
                <Button size="sm" variant="outline" className="border-emerald-500/50 text-emerald-400">
                  选择A
                </Button>
              </div>
            </div>
            <div className="p-3 rounded-lg border border-zinc-700 bg-zinc-800/30">
              <div className="flex items-start justify-between">
                <div>
                  <h5 className="text-sm font-medium text-white mb-1">选项B：继续优化</h5>
                  <p className="text-xs text-amber-400">成本：+3天，+500 NRN</p>
                  <p className="text-xs text-emerald-400">预期：功耗降至 14.5W，面积 398 mm²</p>
                </div>
                <Button size="sm" variant="outline" className="border-cyan-500/50 text-cyan-400">
                  选择B
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="border-zinc-700">
              请求人类建议
            </Button>
            <Button size="sm" variant="outline" className="border-zinc-700">
              延迟24小时
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Main Component
export function EvolutionWorkbench() {
  const { evolutionStages, logs } = useDashboard();
  const [isRunning, setIsRunning] = useState(true);

  // Mock tasks for current stage
  const currentTasks: EvolutionTask[] = [
    { id: '1', name: '逻辑综合', status: 'completed', progress: 100, cost: '已支付' },
    { id: '2', name: '布局规划', status: 'completed', progress: 100, cost: '已支付' },
    { id: '3', name: '布局布线', status: 'in_progress', progress: 67, estimatedCompletion: '3天' },
    { id: '4', name: '时序优化', status: 'pending', progress: 0, estimatedCompletion: '5天' },
    { id: '5', name: '物理验证', status: 'pending', progress: 0, estimatedCompletion: '7天' },
    { id: '6', name: '签核', status: 'pending', progress: 0, estimatedCompletion: '10天' },
  ];

  const currentStage = evolutionStages.find(s => s.status === 'in_progress');

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">进化工作台</h2>
          <p className="text-sm text-zinc-500">SSEP全流程管理</p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-zinc-700"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="w-4 h-4 mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            {isRunning ? '暂停' : '继续'}
          </Button>
          <Button size="sm" variant="outline" className="border-zinc-700">
            <RotateCcw className="w-4 h-4 mr-1" />
            重置
          </Button>
        </div>
      </div>

      {/* Stage Progress */}
      <Card className="p-5 bg-[#1a1a24] border-zinc-800">
        <StageProgress stages={evolutionStages} />
      </Card>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Task List */}
        <div className="col-span-5">
          <Card className="h-full p-4 bg-[#1a1a24] border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                当前阶段任务
              </h3>
              <span className="text-xs text-cyan-400">{currentStage?.name}</span>
            </div>
            <TaskList tasks={currentTasks} />
          </Card>
        </div>

        {/* Log Stream & Decision */}
        <div className="col-span-7 space-y-4">
          <LogStream logs={logs} />
          <DecisionPanel />
        </div>
      </div>
    </div>
  );
}
