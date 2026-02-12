import { DashboardProvider } from '@/store/dashboardStore.tsx';
import { TopBar } from '@/components/layout/TopBar';
import { ViewContainer } from '@/components/layout/ViewContainer';
import { BottomNav } from '@/components/layout/BottomNav';
import { BottomDrawer } from '@/components/layout/BottomDrawer';
import './App.css';

function App() {
  return (
    <DashboardProvider>
      <div className="min-h-screen bg-[#0a0a0f] text-white">
        <TopBar />
        <ViewContainer />
        <BottomDrawer />
        <BottomNav />
      </div>
    </DashboardProvider>
  );
}

export default App;
