import { useEffect, useRef, useState } from 'react';
import { Database, AlertTriangle, CheckCircle, Clock, RefreshCw, Search, Link2 } from 'lucide-react';
import { useDashboard } from '@/store/dashboardStore.tsx';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { MemoryLayer, MemoryNode } from '@/types';

// Knowledge Graph Visualization
function KnowledgeGraph({ nodes }: { nodes: MemoryNode[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredNode] = useState<string | null>(null);

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

    // Node positions (circular layout)
    const centerX = canvas.offsetWidth / 2;
    const centerY = canvas.offsetHeight / 2;
    const radius = Math.min(centerX, centerY) * 0.5;

    const nodePositions = nodes.map((_, i) => {
      const angle = (i / nodes.length) * Math.PI * 2 - Math.PI / 2;
      return {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius,
      };
    });

    const animate = () => {
      time += 0.02;
      ctx.clearRect(0, 0, canvas.width / 2, canvas.height / 2);

      // Draw connections to center
      nodes.forEach((node, i) => {
        const pos = nodePositions[i];
        
        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(pos.x, pos.y);
        ctx.strokeStyle = `rgba(0, 212, 255, ${node.activation * 0.3})`;
        ctx.lineWidth = node.activation * 2;
        ctx.stroke();

        // Animated pulse along connection
        const pulseOffset = (time * 30) % radius;
        const pulseX = centerX + (pos.x - centerX) * (pulseOffset / radius);
        const pulseY = centerY + (pos.y - centerY) * (pulseOffset / radius);
        
        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 212, 255, ${node.activation})`;
        ctx.fill();
      });

      // Draw center node (current query)
      ctx.beginPath();
      ctx.arc(centerX, centerY, 25, 0, Math.PI * 2);
      ctx.fillStyle = '#00d4ff';
      ctx.shadowColor = '#00d4ff';
      ctx.shadowBlur = 20;
      ctx.fill();
      ctx.shadowBlur = 0;

      // Center label
      ctx.font = '10px Inter, sans-serif';
      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.fillText('当前查询', centerX, centerY + 40);

      // Draw memory nodes
      nodes.forEach((node, i) => {
        const pos = nodePositions[i];
        const isHovered = hoveredNode === node.id;
        const nodeRadius = isHovered ? 20 : 15 + node.activation * 5;

        // Node glow
        if (isHovered || node.activation > 0.8) {
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, nodeRadius + 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(0, 212, 255, ${0.1 + node.activation * 0.2})`;
          ctx.fill();
        }

        // Node circle
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, nodeRadius, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(pos.x, pos.y, 0, pos.x, pos.y, nodeRadius);
        gradient.addColorStop(0, `rgba(124, 58, 237, ${node.activation})`);
        gradient.addColorStop(1, `rgba(124, 58, 237, ${node.activation * 0.3})`);
        ctx.fillStyle = gradient;
        ctx.fill();

        // Node label
        ctx.font = isHovered ? '11px Inter, sans-serif' : '9px Inter, sans-serif';
        ctx.fillStyle = isHovered ? '#fff' : '#a1a1aa';
        ctx.textAlign = 'center';
        ctx.fillText(node.label, pos.x, pos.y + nodeRadius + 15);

        // Activation level
        ctx.font = '10px Inter, sans-serif';
        ctx.fillStyle = '#00d4ff';
        ctx.fillText(`${(node.activation * 100).toFixed(0)}%`, pos.x, pos.y + 5);
      });

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animationId);
    };
  }, [nodes, hoveredNode]);

  return (
    <div className="relative h-[350px]">
      <canvas 
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
      />
    </div>
  );
}

// Memory Layer Card
function MemoryLayerCard({ layer }: { layer: MemoryLayer }) {
  const getConsistencyIcon = () => {
    switch (layer.consistency) {
      case 'synced':
        return <CheckCircle className="w-4 h-4 text-emerald-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      case 'disconnected':
        return <Clock className="w-4 h-4 text-zinc-500" />;
    }
  };

  const getConsistencyText = () => {
    switch (layer.consistency) {
      case 'synced':
        return '已同步';
      case 'warning':
        return '12小时前同步';
      case 'disconnected':
        return '未连接';
    }
  };

  return (
    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700/50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-white">L{layer.level}：{layer.name}</span>
        {getConsistencyIcon()}
      </div>
      <div className="grid grid-cols-2 gap-2 text-[10px]">
        <div>
          <span className="text-zinc-500">容量：</span>
          <span className="text-zinc-300">{layer.capacity}</span>
        </div>
        <div>
          <span className="text-zinc-500">使用：</span>
          <span className="text-zinc-300">{layer.currentUsage}</span>
        </div>
        <div>
          <span className="text-zinc-500">激活：</span>
          <span className="text-zinc-300">{layer.activationMode}</span>
        </div>
        <div>
          <span className="text-zinc-500">状态：</span>
          <span className={layer.consistency === 'synced' ? 'text-emerald-400' : layer.consistency === 'warning' ? 'text-amber-400' : 'text-zinc-500'}>
            {getConsistencyText()}
          </span>
        </div>
      </div>
    </div>
  );
}

// Memory Health Check
function MemoryHealthCheck() {
  return (
    <Card className="p-4 bg-gradient-to-r from-amber-500/10 to-transparent border-amber-500/30">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
        <div className="flex-1">
          <h4 className="text-sm font-medium text-white mb-1">记忆健康检查</h4>
          <p className="text-xs text-zinc-400 mb-1">
            发现：L2长期记忆有12小时未完整同步
          </p>
          <p className="text-xs text-red-400 mb-3">
            风险：硬件故障可能导致12小时经验丢失
          </p>
          <div className="flex gap-2">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-black">
              <RefreshCw className="w-3 h-3 mr-1" />
              立即同步
            </Button>
            <Button size="sm" variant="outline" className="border-zinc-700">
              <Clock className="w-3 h-3 mr-1" />
              延迟到低谷期
            </Button>
            <Button size="sm" variant="outline" className="border-zinc-700 text-zinc-500">
              忽略
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}

// Main Component
export function MemoryActivation() {
  const { memoryLayers, memoryNodes } = useDashboard();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">记忆激活</h2>
          <p className="text-sm text-zinc-500">知识流动与长期记忆状态</p>
        </div>
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-zinc-500" />
          <span className="text-xs text-zinc-400">当前查询："客户投诉处理"</span>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-12 gap-6">
        {/* Knowledge Graph */}
        <div className="col-span-8">
          <Card className="h-full p-4 bg-[#1a1a24] border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-cyan-400" />
              知识图谱
            </h3>
            <KnowledgeGraph nodes={memoryNodes} />
          </Card>
        </div>

        {/* Memory Layers */}
        <div className="col-span-4">
          <Card className="h-full p-4 bg-[#1a1a24] border-zinc-800">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Database className="w-4 h-4 text-purple-400" />
              记忆层次
            </h3>
            <div className="space-y-3">
              {memoryLayers.map((layer) => (
                <MemoryLayerCard key={layer.level} layer={layer} />
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Health Check */}
      <MemoryHealthCheck />
    </div>
  );
}
