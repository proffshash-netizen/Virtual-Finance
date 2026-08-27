import { motion } from 'framer-motion';
import { Building2, Landmark, TrendingUp, HandCoins, AlertTriangle, CloudRain, ShieldCheck, TreePine, Banknote } from 'lucide-react';
import { useState } from 'react';

export function StudyVisualRenderer({ visualId }: { visualId: string }) {
  switch (visualId) {
    case 'basics-visual':
      return <BasicsVisual />;
    case 'stock-metaphor':
      return <StockMetaphor />;
    case 'bond-metaphor':
      return <BondMetaphor />;
    case 'diversification-metaphor':
      return <DiversificationMetaphor />;
    case 'compounding-metaphor':
      return <CompoundingMetaphor />;
    case 'risk-scale':
      return <RiskScale />;
    case 'stock-challenge':
      return <StockChallenge />;
    default:
      return <div className="p-8 bg-surface-alt rounded-2xl border-4 border-dashed border-border text-center text-text-secondary">Visual Element Placeholder</div>;
  }
}

function BasicsVisual() {
  return (
    <div className="flex flex-col items-center justify-center py-8 space-y-6">
      <div className="flex items-center space-x-4">
        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 2, repeat: Infinity }}
          className="bg-surface p-6 rounded-[24px] border-4 border-border shadow-sm flex flex-col items-center"
        >
          <Banknote className="w-12 h-12 text-success mb-2" />
          <span className="font-black text-text-secondary text-sm">MONEY TODAY</span>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.8 }}
          animate={{ scale: [0.8, 1.1, 0.8] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-primary font-black text-2xl"
        >
          →
        </motion.div>

        <motion.div 
          animate={{ y: [0, -10, 0] }} 
          transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          className="bg-surface p-6 rounded-[24px] border-4 border-success shadow-sm flex flex-col items-center relative"
        >
          <div className="absolute -top-3 -right-3 bg-reward text-white text-xs font-black px-2 py-1 rounded-full border-2 border-white">+ RETURN</div>
          <div className="flex space-x-1 mb-2">
            <Banknote className="w-12 h-12 text-success" />
            <Banknote className="w-12 h-12 text-success" />
          </div>
          <span className="font-black text-text-secondary text-sm">MONEY TOMORROW</span>
        </motion.div>
      </div>
    </div>
  );
}

function StockMetaphor() {
  return (
    <div className="flex flex-col items-center justify-center p-8 bg-surface-alt rounded-[32px] border-4 border-border">
      <Building2 className="w-24 h-24 text-secondary mb-4 drop-shadow-md" />
      <h3 className="font-display font-black text-xl text-text-primary uppercase tracking-widest mb-6">HUGE COMPANY</h3>
      
      <div className="flex flex-wrap justify-center gap-2 max-w-sm">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.2, backgroundColor: '#3EA5EE', color: 'white' }}
            className={`w-10 h-10 rounded-lg border-2 border-border flex items-center justify-center text-xs font-bold cursor-pointer transition-colors ${
              i === 5 ? 'bg-secondary text-white ring-4 ring-secondary/30' : 'bg-surface text-text-secondary'
            }`}
          >
            {i === 5 ? 'YOU' : '1'}
          </motion.div>
        ))}
      </div>
      <p className="mt-6 text-sm font-bold text-text-secondary text-center">Each block is a "Share". When you buy one, you own that piece of the company!</p>
    </div>
  );
}

function BondMetaphor() {
  return (
    <div className="flex items-center justify-between max-w-lg mx-auto bg-surface-alt p-8 rounded-[32px] border-4 border-border relative">
      <div className="flex flex-col items-center z-10">
        <div className="w-16 h-16 bg-surface rounded-full flex items-center justify-center border-4 border-border mb-2 shadow-sm">
          <span className="text-2xl">👤</span>
        </div>
        <span className="font-black text-text-primary text-sm uppercase">YOU</span>
      </div>
      
      <div className="flex-1 flex flex-col items-center relative mx-4 z-10">
        <span className="font-black text-success text-xs mb-1 uppercase tracking-wider">Lend ₹1,000</span>
        <div className="w-full h-2 bg-border rounded-full mb-4"></div>
        <div className="w-full flex justify-between absolute top-10">
          {[1, 2, 3].map(i => (
            <motion.div 
              key={i}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: i * 0.5, repeat: Infinity, repeatDelay: 2 }}
              className="bg-reward text-white text-[10px] font-black px-2 py-1 rounded-full border-2 border-border shadow-sm flex items-center"
            >
              <HandCoins className="w-3 h-3 mr-1" />
              +₹40
            </motion.div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col items-center z-10">
        <Landmark className="w-16 h-16 text-primary mb-2 drop-shadow-md" />
        <span className="font-black text-text-primary text-sm uppercase text-center leading-tight">GOVERNMENT /<br/>COMPANY</span>
      </div>
    </div>
  );
}

function DiversificationMetaphor() {
  return (
    <div className="grid grid-cols-2 gap-8">
      <div className="bg-surface-alt p-6 rounded-[32px] border-4 border-border flex flex-col items-center text-center">
        <h4 className="font-black text-danger text-sm uppercase tracking-wider mb-4">1 Investment</h4>
        <div className="relative mb-4">
          <Building2 className="w-20 h-20 text-text-secondary" />
          <motion.div 
            animate={{ x: [-5, 5, -5] }} 
            transition={{ duration: 0.5, repeat: Infinity }}
            className="absolute -top-4 -right-4"
          >
            <CloudRain className="w-10 h-10 text-danger" />
          </motion.div>
        </div>
        <p className="text-xs font-bold text-text-primary">Storm hits → entire portfolio falls.</p>
      </div>
      
      <div className="bg-surface p-6 rounded-[32px] border-4 border-primary flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary"></div>
        <h4 className="font-black text-success text-sm uppercase tracking-wider mb-4">Diversified</h4>
        <div className="flex items-end justify-center space-x-2 mb-4">
          <div className="relative">
            <Building2 className="w-10 h-10 text-text-secondary" />
            <CloudRain className="w-6 h-6 text-danger absolute -top-4 -right-2" />
          </div>
          <Landmark className="w-12 h-12 text-primary" />
          <TreePine className="w-10 h-10 text-success" />
          <div className="w-8 h-8 bg-reward rounded-md flex items-center justify-center text-xs font-black text-white">ETF</div>
        </div>
        <p className="text-xs font-bold text-text-primary">Storm hits one → others remain stable.</p>
      </div>
    </div>
  );
}

function CompoundingMetaphor() {
  return (
    <div className="flex items-end justify-between max-w-lg mx-auto px-4 h-48 border-b-4 border-border">
      {[
        { year: 'YR 1', size: 1, icon: '🌱' },
        { year: 'YR 5', size: 1.5, icon: '🌿' },
        { year: 'YR 10', size: 2.2, icon: '🌳' },
        { year: 'YR 20', size: 3.5, icon: '🌳✨' },
      ].map((tree, i) => (
        <div key={i} className="flex flex-col items-center group">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: tree.size }}
            transition={{ delay: i * 0.4, type: 'spring' }}
            className="text-4xl origin-bottom mb-2 transition-transform group-hover:scale-110"
          >
            {tree.icon}
          </motion.div>
          <span className="font-black text-text-secondary text-xs">{tree.year}</span>
        </div>
      ))}
    </div>
  );
}

function RiskScale() {
  return (
    <div className="bg-surface-alt p-8 rounded-[32px] border-4 border-border max-w-md mx-auto">
      <div className="flex justify-between items-center mb-6">
        <span className="font-black text-text-secondary text-xs uppercase">Lower Risk</span>
        <span className="font-black text-danger text-xs uppercase">Higher Risk</span>
      </div>
      <div className="relative w-full h-4 bg-gradient-to-r from-success via-warning to-danger rounded-full border-2 border-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]">
        {/* Points */}
        <div className="absolute top-6 left-0 flex flex-col items-center -translate-x-1/2">
          <div className="w-3 h-3 bg-success rounded-full border-2 border-white mb-2"></div>
          <span className="text-[10px] font-bold text-text-primary">Cash</span>
        </div>
        <div className="absolute top-6 left-1/4 flex flex-col items-center -translate-x-1/2">
          <div className="w-3 h-3 bg-success rounded-full border-2 border-white mb-2"></div>
          <span className="text-[10px] font-bold text-text-primary">Gov Bonds</span>
        </div>
        <div className="absolute top-6 left-2/4 flex flex-col items-center -translate-x-1/2">
          <div className="w-3 h-3 bg-warning rounded-full border-2 border-white mb-2"></div>
          <span className="text-[10px] font-bold text-text-primary">Corp Bonds</span>
        </div>
        <div className="absolute top-6 left-3/4 flex flex-col items-center -translate-x-1/2">
          <div className="w-3 h-3 bg-danger rounded-full border-2 border-white mb-2"></div>
          <span className="text-[10px] font-bold text-text-primary">Stocks</span>
        </div>
        <div className="absolute top-6 left-full flex flex-col items-center -translate-x-1/2">
          <div className="w-3 h-3 bg-danger rounded-full border-2 border-white mb-2"></div>
          <span className="text-[10px] font-bold text-text-primary text-center">Crypto /<br/>Speculation</span>
        </div>
      </div>
      <div className="mt-16 text-center">
        <p className="text-sm font-bold text-text-primary">
          Potential Return <TrendingUp className="w-4 h-4 inline text-primary mb-1" /> goes up as Risk <AlertTriangle className="w-4 h-4 inline text-danger mb-1" /> goes up.
        </p>
      </div>
    </div>
  );
}

function StockChallenge() {
  const [selected, setSelected] = useState<number | null>(null);

  const companies = [
    { name: 'EcoGrow Farms', sector: 'Agriculture', risk: 'Low', return: '+5%' },
    { name: 'FutureTech Labs', sector: 'Technology', risk: 'High', return: '+25% or -15%' },
    { name: 'Solid State Banks', sector: 'Finance', risk: 'Medium', return: '+8%' }
  ];

  return (
    <div className="flex flex-col items-center w-full">
      <div className="bg-surface px-4 py-2 rounded-full border-2 border-primary mb-6 shadow-sm inline-block">
        <span className="font-black text-primary text-sm">🎮 FINLIT SIMULATION</span>
      </div>
      <p className="text-sm font-bold text-text-primary mb-6 text-center">You have ₹10,000 to invest. Which company will you buy shares in?</p>
      
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
        {companies.map((c, i) => (
          <div 
            key={i}
            onClick={() => setSelected(i)}
            className={`p-4 rounded-[24px] border-4 cursor-pointer transition-all ${
              selected === i 
                ? 'border-primary bg-primary/10 scale-105' 
                : 'border-border bg-surface hover:border-secondary hover:-translate-y-1'
            }`}
          >
            <h5 className="font-black text-sm uppercase text-text-primary mb-1">{c.name}</h5>
            <p className="text-[10px] font-bold text-text-secondary uppercase mb-3">{c.sector}</p>
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-secondary">Risk:</span>
                <span className={`font-black ${c.risk === 'High' ? 'text-danger' : c.risk === 'Low' ? 'text-success' : 'text-warning'}`}>{c.risk}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-bold text-text-secondary">Est. Return:</span>
                <span className="font-black text-text-primary">{c.return}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {selected !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-surface-alt rounded-2xl border-2 border-border text-center max-w-md"
        >
          <ShieldCheck className="w-8 h-8 text-success mx-auto mb-2" />
          <p className="text-sm font-bold text-text-primary">
            Great choice! In real life, choosing a mix of all these (diversification) might be safer than picking just one.
          </p>
        </motion.div>
      )}
    </div>
  );
}
