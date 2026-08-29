import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../lib/gameState';
import { mockPortfolioApi } from '../lib/mockPortfolioApi';
import type { PortfolioData, Instrument, TierType } from '../lib/mockPortfolioApi';
import { Shield, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, ArrowLeft, Landmark, Building, Sprout, Briefcase } from 'lucide-react';
import { Button } from '../components/ui/button';
import { useNavigate } from 'react-router-dom';

export function InvestmentDistrict() {
  const navigate = useNavigate();
  const { user, money, updateMoney, updateNetWorth } = useGameState();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [activeTab, setActiveTab] = useState<TierType>('foundation');
  const [loading, setLoading] = useState(true);
  const [selectedInstrument, setSelectedInstrument] = useState<{ tier: TierType, instrument: Instrument } | null>(null);
  const [investAmount, setInvestAmount] = useState('');
  const [investing, setInvesting] = useState(false);
  const [investError, setInvestError] = useState('');

  // Fallback user id if not logged in for mock purposes
  const userId = user?.userId || 'mock_user_1';

  useEffect(() => {
    mockPortfolioApi.getPortfolio(userId).then(data => {
      setPortfolio(data);
      setLoading(false);
    });
  }, [userId]);

  const handleInvest = async () => {
    if (!selectedInstrument) return;
    
    const amount = Number(investAmount);
    if (isNaN(amount) || amount <= 0) {
      setInvestError('Please enter a valid amount.');
      return;
    }
    if (amount > money) {
      setInvestError('Insufficient cash.');
      return;
    }

    setInvestError('');
    setInvesting(true);

    try {
      const response = await mockPortfolioApi.invest(userId, selectedInstrument.tier, selectedInstrument.instrument.id, amount);
      if (response.success) {
        // Deduct money from global state (Net Worth stays the same as cash becomes asset)
        // Wait, updateMoney adds money, so we pass negative
        updateMoney(-amount);
        if (portfolio) {
          updateNetWorth(response.updatedNetWorth - portfolio.totalNetWorth);
        }

        // Optimistically update local portfolio
        setPortfolio(prev => {
          if (!prev) return prev;
          const newPortfolio = { ...prev };
          const instruments = newPortfolio.tiers[selectedInstrument.tier].instruments;
          const index = instruments.findIndex(i => i.id === selectedInstrument.instrument.id);
          if (index !== -1) {
            instruments[index] = response.updatedInstrument;
          }
          newPortfolio.totalNetWorth = response.updatedNetWorth;
          return newPortfolio;
        });

        setSelectedInstrument(null);
        setInvestAmount('');
      }
    } catch (e: any) {
      setInvestError(e.message || 'Investment failed');
    } finally {
      setInvesting(false);
    }
  };

  const handleWithdraw = async () => {
    if (!selectedInstrument) return;
    
    const amount = Number(investAmount); // using the same input for amount
    if (isNaN(amount) || amount <= 0) {
      setInvestError('Please enter a valid amount.');
      return;
    }
    if (amount > selectedInstrument.instrument.currentValue) {
      setInvestError('Insufficient funds in instrument.');
      return;
    }

    setInvestError('');
    setInvesting(true);

    try {
      const response = await mockPortfolioApi.withdraw(userId, selectedInstrument.tier, selectedInstrument.instrument.id, amount);
      if (response.success) {
        // Add money to global state
        updateMoney(amount);
        if (portfolio) {
          updateNetWorth(response.updatedNetWorth - portfolio.totalNetWorth);
        }

        // Optimistically update local portfolio
        setPortfolio(prev => {
          if (!prev) return prev;
          const newPortfolio = { ...prev };
          const instruments = newPortfolio.tiers[selectedInstrument.tier].instruments;
          const index = instruments.findIndex(i => i.id === selectedInstrument.instrument.id);
          if (index !== -1) {
            instruments[index] = response.updatedInstrument;
          }
          newPortfolio.totalNetWorth = response.updatedNetWorth;
          return newPortfolio;
        });

        setSelectedInstrument(null);
        setInvestAmount('');
      }
    } catch (e: any) {
      setInvestError(e.message || 'Withdrawal failed');
    } finally {
      setInvesting(false);
    }
  };

  if (loading || !portfolio) {
    return (
      <div className="flex-1 w-full h-full flex items-center justify-center pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-primary"></div>
      </div>
    );
  }

  const activeInstruments = portfolio.tiers[activeTab].instruments;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto pb-32"
    >
      {/* Background Watermark */}
      <div className="fixed bottom-0 right-0 opacity-5 pointer-events-none -z-10 overflow-hidden translate-x-1/4 translate-y-1/4">
        <Landmark className="w-[600px] h-[600px] text-[#3E2723]" />
      </div>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div className="flex items-center space-x-4">
          <button 
            onClick={() => navigate('/world')}
            className="w-12 h-12 bg-surface rounded-full flex items-center justify-center shadow-md hover:scale-105 active:scale-95 transition-all text-text-secondary hover:text-text-primary"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="medieval-wood-plaque px-6 py-2 rounded-xl text-3xl md:text-4xl font-display font-black tracking-widest uppercase shadow-lg inline-block">Investment District</h1>
            <p className="text-[#E8DFCD] font-medium mt-2 drop-shadow-md">Build your wealth across different risk tiers.</p>
          </div>
        </div>
        <div className="medieval-wood-plaque px-6 py-3 rounded-2xl shadow-lg border-[3px] border-[#271510] text-right">
          <div className="text-xs font-black text-[#F4E4BC] uppercase tracking-wider opacity-80">Total Portfolio</div>
          <div className="text-2xl font-black text-[#FFD13B] drop-shadow-sm">₹{portfolio.totalNetWorth.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 md:space-x-4 mb-8 bg-[#E8DFCD] border-2 border-[#8D6E63]/50 p-2 rounded-2xl shadow-inner overflow-x-auto">
        <TabButton 
          active={activeTab === 'foundation'} 
          onClick={() => setActiveTab('foundation')}
          icon={<Shield className="w-5 h-5" />}
          label="Foundation"
        />
        <TabButton 
          active={activeTab === 'growth'} 
          onClick={() => setActiveTab('growth')}
          icon={<TrendingUp className="w-5 h-5" />}
          label="Growth"
        />
        <TabButton 
          active={activeTab === 'sandbox'} 
          onClick={() => setActiveTab('sandbox')}
          icon={<AlertTriangle className="w-5 h-5" />}
          label="High-Risk Sandbox"
        />
      </div>

      {/* Instruments List */}
      <div className="space-y-4">
        {activeInstruments.map(instrument => (
          <InstrumentCard 
            key={instrument.id} 
            instrument={instrument} 
            tier={activeTab}
            onClick={() => setSelectedInstrument({ tier: activeTab, instrument })}
          />
        ))}
      </div>

      {/* Invest Modal */}
      <AnimatePresence>
        {selectedInstrument && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedInstrument(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-surface rounded-3xl p-6 md:p-8 w-full max-w-md shadow-2xl border-4 border-border"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-2xl font-black text-[#3E2723] uppercase tracking-wide">{selectedInstrument.instrument.name}</h2>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-[#3E2723]" onClick={() => setSelectedInstrument(null)}>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>
              
              <p className="text-[#5D4037] font-medium mb-6">Enter an amount to invest or withdraw.</p>
              
              <div className="flex gap-4 mb-6">
                <div className="bg-[#E8DFCD] rounded-xl p-4 flex-1 border-2 border-[#8D6E63]/50 shadow-inner">
                  <div className="text-xs font-black text-[#8D6E63] uppercase tracking-wider mb-1">Available Cash</div>
                  <div className="font-black text-success text-xl">₹{money.toLocaleString()}</div>
                </div>
                <div className="bg-[#E8DFCD] rounded-xl p-4 flex-1 border-2 border-[#8D6E63]/50 shadow-inner">
                  <div className="text-xs font-black text-[#8D6E63] uppercase tracking-wider mb-1">Current Value</div>
                  <div className="font-black text-primary text-xl">₹{selectedInstrument.instrument.currentValue.toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-black text-[#5D4037] uppercase tracking-wider mb-2">Amount (₹)</label>
                <input 
                  type="number"
                  value={investAmount}
                  onChange={e => setInvestAmount(e.target.value)}
                  className="w-full bg-[#FFFAEE] border-4 border-[#8D6E63] rounded-xl px-4 py-3 font-bold text-lg focus:outline-none focus:border-primary text-[#3E2723]"
                  placeholder="e.g. 5000"
                />
                {investError && <p className="text-danger text-sm font-bold mt-2">{investError}</p>}
              </div>

              <div className="flex space-x-4">
                <Button className="game-btn-secondary flex-1 h-14 bg-danger/10 text-danger hover:bg-danger hover:text-white border-danger/20" onClick={handleWithdraw} disabled={investing || selectedInstrument.instrument.currentValue <= 0}>
                  {investing ? '...' : 'Withdraw'}
                </Button>
                <Button className="game-btn-primary flex-1 h-14" onClick={handleInvest} disabled={investing}>
                  {investing ? 'Processing...' : 'Invest'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function TabButton({ active, onClick, icon, label }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string }) {
  const activeClass = "medieval-wood-plaque shadow-md scale-[1.02] border-[#271510]";
  const inactiveClass = "text-[#5D4037] bg-[#F4E4BC]/50 hover:bg-[#F4E4BC] border-2 border-[#8D6E63]/30 shadow-sm";

  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-black uppercase tracking-wider transition-all duration-300 ${active ? activeClass : inactiveClass}`}
    >
      {icon}
      <span className="whitespace-nowrap">{label}</span>
    </button>
  );
}

function InstrumentCard({ instrument, tier, onClick }: { instrument: Instrument, tier: TierType, onClick: () => void }) {
  const gain = instrument.currentValue - instrument.amountInvested;
  const percent = instrument.amountInvested > 0 ? (gain / instrument.amountInvested) * 100 : 0;
  
  const isPositive = gain >= 0;
  
  // De-emphasize Sandbox visually
  const isSandbox = tier === 'sandbox';
  const cardStyles = isSandbox 
    ? "bg-[#D2C4A7] border-4 border-[#8D6E63]/50 shadow-sm opacity-90 grayscale-[0.2]"
    : "medieval-parchment hover:border-[#5D4037]";

  const getInstrumentIcon = () => {
    if (instrument.name.includes("Fixed Deposit")) return <Building className="w-8 h-8 text-[#8D6E63] shrink-0" />;
    if (instrument.name.includes("Index") || instrument.name.includes("Mutual")) return <Sprout className="w-8 h-8 text-[#8D6E63] shrink-0" />;
    if (instrument.type === "stock") return <TrendingUp className="w-8 h-8 text-[#8D6E63] shrink-0" />;
    return <Briefcase className="w-8 h-8 text-[#8D6E63] shrink-0" />;
  };

  return (
    <div 
      className={`rounded-2xl p-5 md:p-6 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 ${cardStyles}`}
      onClick={onClick}
    >
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <span className="text-xs font-black uppercase tracking-wider text-text-secondary bg-background border border-border/50 px-2 py-1 rounded-md">
            {instrument.type.replace('_', ' ')}
          </span>
          {instrument.interestRate && (
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">Fixed {instrument.interestRate}%</span>
          )}
          {instrument.riskLevel && (
            <span className="text-xs font-bold text-amber-600 capitalize bg-amber-50 px-2 py-1 rounded-md">Risk: {instrument.riskLevel}</span>
          )}
          {instrument.volatility && (
            <span className="text-xs font-bold text-slate-500 capitalize bg-slate-200 px-2 py-1 rounded-md">Volatility: {instrument.volatility}</span>
          )}
        </div>
        <div className="flex items-center space-x-4 mt-3">
          {getInstrumentIcon()}
          <h3 className={`text-xl font-black ${isSandbox ? 'text-slate-700' : 'text-text-primary'}`}>{instrument.name}</h3>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end md:space-x-8">
        <div className="text-left md:text-right">
          <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Invested</div>
          <div className="font-bold text-text-primary">₹{instrument.amountInvested.toLocaleString()}</div>
        </div>
        
        <div className="text-left md:text-right">
          <div className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">Current Value</div>
          <div className="flex items-center space-x-2">
            <span className="text-xl font-black text-text-primary">₹{instrument.currentValue.toLocaleString()}</span>
            {instrument.amountInvested > 0 && (
              <span className={`flex items-center text-sm font-bold px-2 py-0.5 rounded-full ${isPositive ? 'text-success bg-success/10' : 'text-danger bg-danger/10'} ${isSandbox ? 'grayscale opacity-70' : ''}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4 mr-1" /> : <ArrowDownRight className="w-4 h-4 mr-1" />}
                {Math.abs(percent).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
