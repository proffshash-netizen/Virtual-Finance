import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { GlobalLayout } from './components/layout/GlobalLayout';
import { FinAcademy } from './pages/FinAcademy';
import { InvestmentDistrict } from './pages/InvestmentDistrict';
import { MarketCity } from './pages/MarketCity';
import { LifeHub } from './pages/LifeHub';
import { Entry } from './pages/Entry';
import { WorldMap } from './pages/WorldMap';
import { GameStateProvider } from './lib/gameState';

function AnimatedRoutes() {
  const location = useLocation();
  
  // Use a different key logic so that navigating from Entry to App triggers the exit animation of Entry
  const routeKey = location.pathname === '/' ? 'entry' : 'app';

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={routeKey}>
        <Route path="/" element={<Entry />} />
        
        {/* We wrap the GlobalLayout in a motion.div to give it a cinematic entry when arriving from the home screen */}
        <Route element={
          <motion.div
            initial={{ opacity: 0, scale: 0.95, rotateX: 10, y: 20 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, rotateX: -10, y: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }} // smooth spring-like easing
            className="w-full h-full perspective-1000"
            style={{ transformStyle: 'preserve-3d' }}
          >
            <GlobalLayout />
          </motion.div>
        }>
          <Route path="world" element={<WorldMap />} />
          <Route path="academy" element={<FinAcademy />} />
          <Route path="investment" element={<InvestmentDistrict />} />
          <Route path="market" element={<MarketCity />} />
          <Route path="life" element={<LifeHub />} />
        </Route>
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <GameStateProvider>
      <BrowserRouter>
        <AnimatedRoutes />
      </BrowserRouter>
    </GameStateProvider>
  );
}

export default App;
