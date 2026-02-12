import { useState } from 'react';
import { ChevronUp, ChevronDown, Terminal, AlertTriangle, CheckCircle } from 'lucide-react';
import { useDashboard } from '@/store/dashboardStore.tsx';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';

export function BottomDrawer() {
  const { isDrawerOpen, setDrawerOpen, logs, pendingDecision, makeDecision } = useDashboard();
  const [activeTab, setActiveTab] = useState<'logs' | 'decisions'>('logs');

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
    <div 
      className={`fixed left-0 right-0 z-40 transition-all duration-300 ${
        isDrawerOpen ? 'bottom-16' : 'bottom-16 translate-y-[calc(100%-40px)]'
      }`}
    >
      {/* Toggle Handle */}
      <div 
        className="absolute -top-8 left-1/2 -translate-x-1/2 cursor-pointer"
        onClick={() => setDrawerOpen(!isDrawerOpen)}
      >
        <div className="flex items-center gap-2 px-4 py-2 bg-[#1a1a24] border border-zinc-700 border-b-0 rounded-t-lg">
          {isDrawerOpen ? (
            <ChevronDown className="w-4 h-4 text-zinc-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-zinc-400" />
          )}
          <span className="text-xs text-zinc-400">
            {isDrawerOpen ? '收起工作台' : '展开工作台'}
          </span>
          {pendingDecision && (
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          )}
        </div>
      </div>

      {/* Drawer Content */}
      <div className="bg-[#1a1a24] border-t border-zinc-700 h-[300px]">
        <div className="h-full flex">
          {/* Tabs */}
          <div className="w-12 border-r border-zinc-700 flex flex-col items-center py-4 gap-2">
            <button
              onClick={() => setActiveTab('logs')}
              className={`p-2 rounded-lg transition-colors ${
                activeTab === 'logs' ? 'bg-zinc-700 text-cyan-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Terminal className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveTab('decisions')}
              className={`p-2 rounded-lg transition-colors relative ${
                activeTab === 'decisions' ? 'bg-zinc-700 text-amber-400' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4" />
              {pendingDecision && (
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-500" />
              )}
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-4">
            {activeTab === 'logs' ? (
              <ScrollArea className="h-full">
                <div className="space-y-2">
                  {logs.map((log, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 text-sm font-mono-data animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="text-zinc-600 whitespace-nowrap">[{log.timestamp}]</span>
                      {getLogIcon(log.type)}
                      <span className={getLogColor(log.type)}>{log.message}</span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="h-full flex flex-col">
                {pendingDecision ? (
                  <>
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-5 h-5 text-amber-400" />
                      <h3 className="text-lg font-semibold text-white">{pendingDecision.title}</h3>
                    </div>
                    <p className="text-sm text-zinc-400 mb-4">{pendingDecision.description}</p>
                    <div className="flex-1 space-y-3">
                      {pendingDecision.options.map((option) => (
                        <div 
                          key={option.id}
                          className="p-4 rounded-lg border border-zinc-700 bg-zinc-800/50 hover:border-amber-500/50 transition-colors"
                        >
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="text-sm font-medium text-white mb-1">{option.label}</h4>
                              <p className="text-xs text-zinc-400">{option.description}</p>
                              {option.risk && (
                                <p className="text-xs text-red-400 mt-1">风险：{option.risk}</p>
                              )}
                              {option.cost && (
                                <p className="text-xs text-amber-400 mt-1">成本：{option.cost}</p>
                              )}
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => makeDecision(pendingDecision.id, option.id)}
                              className="border-amber-500/50 text-amber-400 hover:bg-amber-500/10"
                            >
                              选择
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="h-full flex items-center justify-center text-zinc-500">
                    <div className="text-center">
                      <CheckCircle className="w-12 h-12 mx-auto mb-3 text-emerald-500" />
                      <p>暂无待处理决策</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
