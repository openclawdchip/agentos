import { useEffect, useRef } from 'react';
import { Cpu, Thermometer, Zap, TrendingUp, MapPin, Clock } from 'lucide-react';
import { useDashboard } from '@/store/dashboardStore.tsx';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { HardwareStatus, CostMetric } from '@/types';

// Network Topology Visualization
function NetworkTopology() {
  const { networkNodes } = useDashboard();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      ctx.scale(2, 2);
    };
    resizeCanvas();

    let animationId: number;
    let time = 0;

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

      const centerX = canvas.offsetWidth / 2;
      const centerY = canvas.offsetHeight / 2;
      const radius = Math.min(centerX, centerY) * 0.6;

      // Draw connections
      networkNodes.forEach((node, i) => {
        const angle = (i / networkNodes.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Draw line to center
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(x, y);
        ctx.strokeStyle = node.isCurrent ? 'rgba(0, 212, 255, 0.3)' : 'rgba(100, 100, 120, 0.2)';
        ctx.lineWidth = node.isCurrent ? 2 : 1;
        ctx.stroke();

        // Animated data flow
        if (node.isCurrent) {
          const flowOffset = (time * 50) % radius;
          const flowX = centerX + Math.cos(angle) * flowOffset;
          const flowY = centerY + Math.sin(angle) * flowOffset;
          
          ctx.beginPath();
          ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
          ctx.fillStyle = '#00d4ff';
          ctx.fill();
        }
      });

      // Draw center node (current location)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 20, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Draw nodes
      networkNodes.forEach((node, i) => {
        const angle = (i / networkNodes.length) * Math.PI * 2 - Math.PI / 2;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;

        // Node circle
        ctx.beginPath();
        ctx.arc(x, y, node.isCurrent ? 15 : 12, 0, Math.PI * 2);
        ctx.fillStyle = node.type === 'cloud' ? '#7c3aed' : '#10b981';
        if (node.isCurrent) {
          ctx.shadowColor = '#00d4ff';
          ctx.shadowBlur = 15;
        }
        ctx.fill();
        ctx.shadowBlur = 0;

        // Load indicator ring
        ctx.beginPath();
        ctx.arc(x, y, node.isCurrent ? 20 : 16, -Math.PI / 2, -Math.PI / 2 + (node.load / 100) * Math.PI * 2);
        ctx.strokeStyle = node.load > 70 ? '#f59e0b' : '#10b981';
        ctx.lineWidth = 3;
        ctx.stroke();

        // Label
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#fff';
        ctx.textAlign = 'center';
        ctx.fillText(node.name, x, y + 35);
        ctx.fillStyle = '#71717a';
        ctx.fillText(node.location, x, y + 48);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [networkNodes]);

  return (
    <div className="relative h-[300px]">
      <canvas 
        ref={canvasRef}
        className="w-full h-full"
      />
      {/* Legend */}
      <div className="absolute bottom-2 left-2 flex gap-4 text-xs">
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-purple-500" />
          <span className="text-zinc-400">云端</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-zinc-400">边缘</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-zinc-400">当前位置</span>
        </div>
      </div>
    </div>
  );
}

// Hardware Status Card
function HardwareStatusCard({ status }: { status: HardwareStatus }) {
  return (
    <Card className="p-4 bg-[#1a1a24] border-zinc-800">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Cpu className="w-4 h-4 text-cyan-400" />
        本地硬件状态
      </h4>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">CIM阵列</span>
            <span className="text-white font-mono-data">
              {status.cimArray.active}/{status.cimArray.total} 激活
            </span>
          </div>
          <Progress 
            value={(status.cimArray.active / status.cimArray.total) * 100} 
            className="h-1.5"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">SRAM</span>
            <span className="text-white font-mono-data">
              {status.sram.used}/{status.sram.total}MB
            </span>
          </div>
          <Progress 
            value={(status.sram.used / status.sram.total) * 100} 
            className="h-1.5"
          />
        </div>
        
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-400">HBM</span>
            <span className="text-white font-mono-data">
              {status.hbm.used}/{status.hbm.total}GB
            </span>
          </div>
          <Progress 
            value={(status.hbm.used / status.hbm.total) * 100} 
            className="h-1.5"
          />
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <div>
              <p className="text-[10px] text-zinc-500">温度</p>
              <p className="text-sm font-mono-data text-white">{status.temperature}°C</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-zinc-800/50">
            <Zap className="w-4 h-4 text-cyan-400" />
            <div>
              <p className="text-[10px] text-zinc-500">功耗</p>
              <p className="text-sm font-mono-data text-white">{status.power}W</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Migration Timeline
function MigrationTimeline() {
  const migrations = [
    { time: '现在', location: '边缘节点A（新加坡）', isCurrent: true },
    { time: '-2小时', location: '云端集群（东京）', isCurrent: false },
    { time: '-1天', location: '边缘节点C（法兰克福）', isCurrent: false },
    { time: '-3天', location: '边缘节点A（新加坡）', isCurrent: false },
  ];

  return (
    <Card className="p-4 bg-[#1a1a24] border-zinc-800">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4 text-purple-400" />
        迁移历史
      </h4>
      <div className="space-y-3">
        {migrations.map((m, i) => (
          <div 
            key={i} 
            className={`flex items-center gap-3 p-2 rounded-lg ${
              m.isCurrent ? 'bg-cyan-500/10 border border-cyan-500/30' : 'bg-zinc-800/30'
            }`}
          >
            <span className={`text-xs font-mono-data ${m.isCurrent ? 'text-cyan-400' : 'text-zinc-500'}`}>
              {m.time}
            </span>
            <MapPin className={`w-3 h-3 ${m.isCurrent ? 'text-cyan-400' : 'text-zinc-600'}`} />
            <span className={`text-xs ${m.isCurrent ? 'text-white' : 'text-zinc-400'}`}>
              {m.location}
            </span>
            {m.isCurrent && (
              <span className="ml-auto text-[10px] text-cyan-400">当前</span>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// Cost Metrics Table
function CostMetricsTable({ metrics }: { metrics: CostMetric[] }) {
  return (
    <Card className="p-4 bg-[#1a1a24] border-zinc-800">
      <h4 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-4 h-4 text-emerald-400" />
        成本与效率分析
      </h4>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-zinc-700">
              <th className="text-left py-2 text-zinc-500 font-medium">指标</th>
              <th className="text-right py-2 text-zinc-500 font-medium">当前</th>
              <th className="text-right py-2 text-zinc-500 font-medium">7天平均</th>
              <th className="text-right py-2 text-zinc-500 font-medium">优化潜力</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, i) => (
              <tr key={i} className="border-b border-zinc-800/50">
                <td className="py-2 text-zinc-300">{metric.name}</td>
                <td className="py-2 text-right font-mono-data text-white">{metric.current}</td>
                <td className="py-2 text-right font-mono-data text-zinc-400">{metric.average}</td>
                <td className="py-2 text-right font-mono-data text-emerald-400">{metric.potential}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}

// Main Component
export function ResourceTopology() {
  const { networkNodes, hardwareStatus, costMetrics } = useDashboard();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">资源拓扑</h2>
          <p className="text-sm text-zinc-500">硬件状态与网络分布</p>
        </div>
        <div className="flex items-center gap-4">
          {networkNodes.filter(n => n.isCurrent).map(node => (
            <div key={node.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
              <MapPin className="w-3 h-3 text-cyan-400" />
              <span className="text-xs text-cyan-400">当前：{node.location}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Network Topology */}
        <div className="col-span-7">
          <Card className="h-full p-4 bg-[#1a1a24] border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-4">网络拓扑</h3>
            <NetworkTopology />
          </Card>
        </div>

        {/* Hardware & Migration */}
        <div className="col-span-5 space-y-4">
          <HardwareStatusCard status={hardwareStatus} />
          <MigrationTimeline />
        </div>
      </div>

      {/* Cost Metrics */}
      <CostMetricsTable metrics={costMetrics} />
    </div>
  );
}
