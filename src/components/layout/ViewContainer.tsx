import { useDashboard } from '@/store/dashboardStore.tsx';
import { CognitivePanorama } from '@/components/views/CognitivePanorama';
import { ResourceTopology } from '@/components/views/ResourceTopology';
import { MemoryActivation } from '@/components/views/MemoryActivation';
import { SkillTree } from '@/components/views/SkillTree';
import { EvolutionWorkbench } from '@/components/views/EvolutionWorkbench';
import type { ViewType } from '@/types';

const viewComponents: Record<ViewType, React.ComponentType> = {
  panorama: CognitivePanorama,
  topology: ResourceTopology,
  memory: MemoryActivation,
  skills: SkillTree,
  evolution: EvolutionWorkbench,
};

export function ViewContainer() {
  const { currentView } = useDashboard();
  
  const CurrentView = viewComponents[currentView];

  return (
    <main className="flex-1 overflow-auto p-6 pt-20 pb-24">
      <div className="max-w-[1600px] mx-auto">
        <div className="view-transition">
          <CurrentView />
        </div>
      </div>
    </main>
  );
}
