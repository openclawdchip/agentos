import { Brain, Network, Database, GitBranch, Rocket } from 'lucide-react';
import { useDashboard } from '@/store/dashboardStore.tsx';
import type { ViewType } from '@/types';

interface NavItem {
  id: ViewType;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'panorama', label: '认知全景', icon: Brain, color: 'text-cyan-400' },
  { id: 'topology', label: '资源拓扑', icon: Network, color: 'text-purple-400' },
  { id: 'memory', label: '记忆激活', icon: Database, color: 'text-emerald-400' },
  { id: 'skills', label: '技能树', icon: GitBranch, color: 'text-amber-400' },
  { id: 'evolution', label: '进化工作台', icon: Rocket, color: 'text-rose-400' },
];

export function BottomNav() {
  const { currentView, setCurrentView } = useDashboard();

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-[#0a0a0f]/95 backdrop-blur-sm border-t border-zinc-800 z-50">
      <div className="h-full max-w-[1600px] mx-auto px-6 flex items-center justify-center gap-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300
                ${isActive 
                  ? `bg-zinc-800 ${item.color} border border-zinc-700` 
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50'
                }
              `}
            >
              <Icon className={`w-4 h-4 ${isActive ? item.color : ''}`} />
              <span className={`text-sm font-medium ${isActive ? 'text-white' : ''}`}>
                {item.label}
              </span>
              
              {isActive && (
                <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
