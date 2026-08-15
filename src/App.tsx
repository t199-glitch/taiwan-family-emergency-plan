// 我的家庭安全避難計畫 - App 根組件 (App.tsx)

import React from 'react';
import { PlanProvider, usePlan } from './context/PlanContext';
import { HeaderProgress } from './components/HeaderProgress';
import { BottomNav } from './components/BottomNav';
import { HomePage } from './pages/HomePage';
import { FamilyPage } from './pages/FamilyPage';
import { PreparePage } from './pages/PreparePage';
import { GoBagPage } from './pages/GoBagPage';
import { HazardsPage } from './pages/HazardsPage';
import { MapPage } from './pages/MapPage';
import { FamilyPlanPage } from './pages/FamilyPlanPage';
import { MyPlanPage } from './pages/MyPlanPage';

const StepRouter: React.FC = () => {
  const { plan } = usePlan();
  const step = plan.currentStep;

  switch (step) {
    case 0:
      return <HomePage />;
    case 1:
      return <FamilyPage />;
    case 2:
      return <PreparePage />;
    case 3:
      return <GoBagPage />;
    case 4:
      return <HazardsPage />;
    case 5:
      return <MapPage />;
    case 6:
      return <FamilyPlanPage />;
    case 7:
      return <MyPlanPage />;
    default:
      return <HomePage />;
  }
};

export const AppContent: React.FC = () => {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 font-sans flex flex-col antialiased selection:bg-amber-200 selection:text-amber-900">
      <HeaderProgress />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-6">
        <StepRouter />
      </main>

      <BottomNav />
    </div>
  );
};

export default function App() {
  return (
    <PlanProvider>
      <AppContent />
    </PlanProvider>
  );
}
