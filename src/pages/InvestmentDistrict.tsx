import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameState } from '../lib/gameState';
import { mockPortfolioApi } from '../lib/mockPortfolioApi';
import type { PortfolioData, Instrument, TierType } from '../lib/mockPortfolioApi';
import { Shield, TrendingUp, AlertTriangle, ArrowUpRight, ArrowDownRight, ArrowLeft } from 'lucide-react';
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
            <h1 className="text-3xl md:text-4xl font-display font-black text-text-primary">Investment District</h1>
            <p className="text-text-secondary font-medium mt-1">Build your wealth across different risk tiers.</p>
          </div>
        </div>
        <div className="bg-surface px-6 py-3 rounded-2xl shadow-sm border-2 border-border/50 text-right">
          <div className="text-xs font-bold text-text-secondary uppercase tracking-wider">Total Portfolio</div>
          <div className="text-2xl font-black text-primary">₹{portfolio.totalNetWorth.toLocaleString()}</div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 md:space-x-4 mb-8 bg-surface p-2 rounded-2xl shadow-sm overflow-x-auto">
        <TabButton 
          active={activeTab === 'foundation'} 
          onClick={() => setActiveTab('foundation')}
          icon={<Shield className="w-5 h-5" />}
          label="Foundation"
          color="blue"
        />
        <TabButton 
          active={activeTab === 'growth'} 
          onClick={() => setActiveTab('growth')}
          icon={<TrendingUp className="w-5 h-5" />}
          label="Growth"
          color="green"
        />
        <TabButton 
          active={activeTab === 'sandbox'} 
          onClick={() => setActiveTab('sandbox')}
          icon={<AlertTriangle className="w-5 h-5" />}
          label="High-Risk Sandbox"
          color="gray"
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
                <h2 className="text-2xl font-black text-text-primary">{selectedInstrument.instrument.name}</h2>
                <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={() => setSelectedInstrument(null)}>
                  <ArrowLeft className="w-4 h-4 rotate-180" />
                </Button>
              </div>
              
              <p className="text-text-secondary font-medium mb-6">Enter an amount to invest or withdraw.</p>
              
              <div className="flex gap-4 mb-6">
                <div className="bg-background rounded-xl p-4 flex-1 border-2 border-border/50">
                  <div className="text-xs font-bold text-text-secondary uppercase mb-1">Available Cash</div>
                  <div className="font-black text-success text-xl">₹{money.toLocaleString()}</div>
                </div>
                <div className="bg-background rounded-xl p-4 flex-1 border-2 border-border/50">
                  <div className="text-xs font-bold text-text-secondary uppercase mb-1">Current Value</div>
                  <div className="font-black text-primary text-xl">₹{selectedInstrument.instrument.currentValue.toLocaleString()}</div>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-bold text-text-secondary uppercase tracking-wider mb-2">Amount (₹)</label>
                <input 
                  type="number"
                  value={investAmount}
                  onChange={e => setInvestAmount(e.target.value)}
                  className="w-full bg-surface-alt border-2 border-border rounded-xl px-4 py-3 font-bold text-lg focus:outline-none focus:border-primary text-text-primary"
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

function TabButton({ active, onClick, icon, label, color }: { active: boolean, onClick: () => void, icon: React.ReactNode, label: string, color: 'blue' | 'green' | 'gray' }) {
  let colorClasses = '';
  if (color === 'blue') {
    colorClasses = active ? 'bg-blue-500 text-white shadow-md' : 'text-text-secondary hover:bg-blue-50 hover:text-blue-600';
  } else if (color === 'green') {
    colorClasses = active ? 'bg-primary text-white shadow-md' : 'text-text-secondary hover:bg-green-50 hover:text-primary';
  } else if (color === 'gray') {
    colorClasses = active ? 'bg-slate-700 text-white shadow-md' : 'text-text-secondary hover:bg-slate-100 hover:text-slate-700';
  }

  return (
    <button 
      onClick={onClick}
      className={`flex-1 flex items-center justify-center space-x-2 py-3 px-4 rounded-xl font-bold transition-all ${colorClasses}`}
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
    ? "bg-slate-100 border-2 border-slate-300 shadow-sm opacity-90 grayscale-[0.2]"
    : "bg-surface border-4 border-border shadow-md hover:border-primary/50 transition-colors";

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
        <h3 className={`text-xl font-black ${isSandbox ? 'text-slate-700' : 'text-text-primary'}`}>{instrument.name}</h3>
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
