import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import axios from 'axios';
import QRCode from 'react-qr-code';
import './App.css';

const API_BASE_URL = 'https://near-ai.onrender.com';

const NETWORKS = {
  BASE: { name: 'Base', symbol: 'ETH' },
  ETHEREUM: { name: 'Ethereum', symbol: 'ETH' },
  BNB: { name: 'BNB Smart Chain', symbol: 'BNB' },
  AVAX: { name: 'Avalanche', symbol: 'AVAX' },
  ARBITRUM: { name: 'Arbitrum', symbol: 'ETH' },
  POLYGON: { name: 'Polygon', symbol: 'MATIC' },
  OPTIMISM: { name: 'Optimism', symbol: 'ETH' }
};

const COINS = ['ETH', 'USDC', 'USDT', 'DAI', 'BTC', 'WETH'];

const BOT_EXAMPLES = [
  {
    name: "ETH Micro Seller",
    prompt: "Create a precise trading bot that sells exactly 0.0002 ETH on Base for USDC every minute. This is a micro-selling strategy for consistent ETH liquidation.",
    config: {
      originSymbol: "ETH",
      originBlockchain: "BASE",
      destinationSymbol: "USDC",
      destinationBlockchain: "BASE",
      amount: "0.0002"
    }
  },
  {
    name: "DCA ETH Buyer",
    prompt: "Create a dollar-cost averaging bot that buys ETH with USDC every hour when ETH price is below $4000. This helps accumulate ETH during dips.",
    config: {
      originSymbol: "USDC",
      originBlockchain: "BASE",
      destinationSymbol: "ETH",
      destinationBlockchain: "BASE",
      amount: "5.0"
    }
  },
  {
    name: "Multi-Chain Arbitrage",
    prompt: "Create an arbitrage bot that monitors USDC price differences between Polygon and Base, executing swaps when profitable opportunities arise.",
    config: {
      originSymbol: "USDC",
      originBlockchain: "POLYGON",
      destinationSymbol: "USDC",
      destinationBlockchain: "BASE",
      amount: "10.0"
    }
  },
  {
    name: "BTC Profit Taker",
    prompt: "Create a profit-taking bot that sells small amounts of BTC when price increases by 5% from purchase price. Helps lock in gains systematically.",
    config: {
      originSymbol: "BTC",
      originBlockchain: "ETHEREUM",
      destinationSymbol: "USDT",
      destinationBlockchain: "ETHEREUM",
      amount: "0.001"
    }
  },
  {
    name: "Stablecoin Optimizer",
    prompt: "Create a yield optimization bot that swaps between USDC, USDT, and DAI to find the best yield opportunities across different protocols.",
    config: {
      originSymbol: "USDC",
      originBlockchain: "ETHEREUM",
      destinationSymbol: "DAI",
      destinationBlockchain: "ETHEREUM",
      amount: "100.0"
    }
  },
  {
    name: "Layer 2 Bridge Bot",
    prompt: "Create an automated bridge bot that moves ETH from Ethereum mainnet to Arbitrum when gas fees are low, optimizing for cost efficiency.",
    config: {
      originSymbol: "ETH",
      originBlockchain: "ETHEREUM",
      destinationSymbol: "ETH",
      destinationBlockchain: "ARBITRUM",
      amount: "0.1"
    }
  }
];

function App() {
  const [activeTab, setActiveTab] = useState('launch'); // 'launch' or 'explore'
  const [currentStep, setCurrentStep] = useState('wallet'); // wallet, configure, fund, deploy, manage
  const [wallet, setWallet] = useState(null);
  const [botConfig, setBotConfig] = useState({
    name: '',
    prompt: '',
    targetCoin: 'USDC',
    originSymbol: 'ETH',
    originBlockchain: 'BASE',
    destinationSymbol: 'USDC',
    destinationBlockchain: 'BASE',
    amount: '',
    isTest: false
  });
  const [deployedBots, setDeployedBots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Mobula API integration
  const [walletPortfolios, setWalletPortfolios] = useState({});
  const [walletTransactions, setWalletTransactions] = useState({});
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  // Generate new EVM wallet
  const generateWallet = () => {
    try {
      const newWallet = ethers.Wallet.createRandom();
      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic.phrase
      });
      setError('');
      setSuccess('New wallet generated successfully!');
    } catch (err) {
      setError('Failed to generate wallet: ' + err.message);
    }
  };

  // Import existing wallet
  const importWallet = (privateKeyOrMnemonic) => {
    try {
      let newWallet;
      if (privateKeyOrMnemonic.includes(' ')) {
        // It's a mnemonic
        newWallet = ethers.Wallet.fromMnemonic(privateKeyOrMnemonic);
      } else {
        // It's a private key
        newWallet = new ethers.Wallet(privateKeyOrMnemonic);
      }
      
      setWallet({
        address: newWallet.address,
        privateKey: newWallet.privateKey,
        mnemonic: newWallet.mnemonic ? newWallet.mnemonic.phrase : 'Imported from private key'
      });
      setError('');
      setSuccess('Wallet imported successfully!');
    } catch (err) {
      setError('Failed to import wallet: ' + err.message);
    }
  };

  // Check API health
  const checkAPIHealth = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/health`);
      return response.data.success;
    } catch (err) {
      setError('Trading bot API is not accessible');
      return false;
    }
  };

  // Mobula API functions
  const fetchWalletPortfolio = async (walletAddress) => {
    if (!walletAddress || walletPortfolios[walletAddress]) return;
    
    setLoadingPortfolio(true);
    try {
      const response = await axios.get('https://api.mobula.io/api/1/wallet/portfolio', {
        params: {
          wallet: walletAddress,
        },
        headers: {
          'Authorization': 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
        }
      });
      
      if (response.data && response.data.data) {
        setWalletPortfolios(prev => ({
          ...prev,
          [walletAddress]: response.data.data
        }));
      }
    } catch (err) {
      console.error('Failed to fetch wallet portfolio:', err);
    } finally {
      setLoadingPortfolio(false);
    }
  };

  const fetchWalletTransactions = async (walletAddress, limit = 50) => {
    if (!walletAddress) return;
    
    try {
      const response = await axios.get('https://api.mobula.io/api/1/wallet/transactions', {
        params: {
          wallet: walletAddress,
          limit: limit,
          order: 'desc'
        },
        headers: {
          'Authorization': 'e26c7e73-d918-44d9-9de3-7cbe55b63b99'
        }
      });
      
      if (response.data && response.data.data) {
        setWalletTransactions(prev => ({
          ...prev,
          [walletAddress]: response.data.data.transactions || []
        }));
      }
    } catch (err) {
      console.error('Failed to fetch wallet transactions:', err);
    }
  };

  // Deploy bot to API
  const deployBot = async () => {
    if (!wallet) {
      setError('Please generate or import a wallet first');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const isAPIHealthy = await checkAPIHealth();
      if (!isAPIHealthy) {
        throw new Error('Trading bot API is not responding');
      }

      const botData = {
        name: botConfig.name,
        prompt: botConfig.prompt,
        targetCoin: botConfig.targetCoin,
        swapConfig: {
          senderAddress: wallet.address,
          senderPrivateKey: wallet.privateKey,
          recipientAddress: wallet.address,
          originSymbol: botConfig.originSymbol,
          originBlockchain: botConfig.originBlockchain,
          destinationSymbol: botConfig.destinationSymbol,
          destinationBlockchain: botConfig.destinationBlockchain,
          amount: botConfig.amount,
          isTest: botConfig.isTest
        }
      };

      const response = await axios.post(`${API_BASE_URL}/api/bots`, botData, {
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.data.success) {
        setSuccess(`Bot "${botConfig.name}" deployed successfully!`);
        fetchDeployedBots();
        setCurrentStep('manage');
      } else {
        throw new Error(response.data.error || 'Failed to deploy bot');
      }
    } catch (err) {
      setError('Deployment failed: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Activate bot
  const activateBot = async (botId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bots/${botId}/activate`);
      if (response.data.success) {
        setSuccess('Bot activated successfully!');
        fetchDeployedBots();
      }
    } catch (err) {
      setError('Failed to activate bot: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Deactivate bot
  const deactivateBot = async (botId) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_BASE_URL}/api/bots/${botId}/deactivate`);
      if (response.data.success) {
        setSuccess('Bot deactivated successfully!');
        fetchDeployedBots();
      }
    } catch (err) {
      setError('Failed to deactivate bot: ' + (err.response?.data?.error || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Fetch deployed bots
  const fetchDeployedBots = async () => {
    try {
      console.log('🔍 Fetching bots from:', `${API_BASE_URL}/api/bots`);
      const response = await axios.get(`${API_BASE_URL}/api/bots`);
      console.log('📊 API Response:', response.data);
      if (response.data.success) {
        console.log('✅ Found', response.data.data.length, 'bots');
        setDeployedBots(response.data.data);
      } else {
        console.error('❌ API returned success: false');
      }
    } catch (err) {
      console.error('❌ Failed to fetch bots:', err);
      setError('Failed to fetch bots: ' + err.message);
    }
  };

  // Fetch bot logs
  const fetchBotLogs = async (botId) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/bots/${botId}/logs`);
      return response.data.data || [];
    } catch (err) {
      console.error('Failed to fetch logs:', err);
      return [];
    }
  };

  useEffect(() => {
    if (currentStep === 'manage') {
      fetchDeployedBots();
    }
  }, [currentStep]);

  useEffect(() => {
    if (activeTab === 'explore') {
      // Fetch deployed bots when switching to explore tab
      fetchDeployedBots();
    }
  }, [activeTab]);

  useEffect(() => {
    if (activeTab === 'explore' && deployedBots.length > 0) {
      // Fetch portfolio data for all deployed bots
      deployedBots.forEach(bot => {
        if (bot.swapConfig?.senderAddress) {
          fetchWalletPortfolio(bot.swapConfig.senderAddress);
          fetchWalletTransactions(bot.swapConfig.senderAddress);
        }
      });
    }
  }, [activeTab, deployedBots]);

  const renderWalletStep = () => (
    <div className="step-container">
      <h2>🔐 Step 1: Generate or Import Wallet</h2>
      <p>Create a new EVM wallet or import an existing one. This wallet will work across all supported networks.</p>
      
      <div className="wallet-actions">
        <button onClick={generateWallet} className="btn-primary">
          🎲 Generate New Wallet
        </button>
        
        <div className="import-section">
          <h4>Or Import Existing Wallet:</h4>
          <input
            type="password"
            placeholder="Enter private key or mnemonic phrase"
            onKeyPress={(e) => {
              if (e.key === 'Enter' && e.target.value.trim()) {
                importWallet(e.target.value.trim());
                e.target.value = '';
              }
            }}
          />
          <small>Press Enter to import</small>
        </div>
      </div>

      {wallet && (
        <div className="wallet-display">
          <h3>✅ Wallet Generated Successfully!</h3>
          <div className="wallet-info">
            <div className="wallet-field">
              <label>📍 Address (Public Key):</label>
              <code className="address">{wallet.address}</code>
              <button onClick={() => navigator.clipboard.writeText(wallet.address)}>📋</button>
            </div>
            
            <div className="wallet-field">
              <label>🔑 Private Key:</label>
              <code className="private-key">{wallet.privateKey}</code>
              <button onClick={() => navigator.clipboard.writeText(wallet.privateKey)}>📋</button>
            </div>

            <div className="wallet-field">
              <label>🔤 Mnemonic Phrase:</label>
              <code className="mnemonic">{wallet.mnemonic}</code>
              <button onClick={() => navigator.clipboard.writeText(wallet.mnemonic)}>📋</button>
            </div>

            <div className="qr-section">
              <h4>📱 QR Code for Address:</h4>
              <QRCode value={wallet.address} size={150} />
            </div>

            <div className="network-support">
              <h4>🌐 Supported Networks:</h4>
              <div className="networks-grid">
                {Object.entries(NETWORKS).map(([key, network]) => (
                  <div key={key} className="network-item">
                    <span className="network-name">{network.name}</span>
                    <span className="network-symbol">({network.symbol})</span>
                  </div>
                ))}
              </div>
            </div>


          </div>
        </div>
      )}
    </div>
  );

  const applyBotExample = (example) => {
    setBotConfig({
      ...botConfig,
      name: example.name,
      prompt: example.prompt,
      originSymbol: example.config.originSymbol,
      originBlockchain: example.config.originBlockchain,
      destinationSymbol: example.config.destinationSymbol,
      destinationBlockchain: example.config.destinationBlockchain,
      amount: example.config.amount
    });
    setSuccess(`Applied "${example.name}" configuration!`);
  };

  const renderConfigureStep = () => (
    <div className="step-container">
      <h2>⚙️ Step 2: Configure Trading Bot</h2>
      
      <div className="bot-examples-section">
        <h3>🎯 Popular Bot Examples</h3>
        <p>Click any example to auto-configure your bot:</p>
        <div className="examples-grid">
          {BOT_EXAMPLES.map((example, index) => (
            <div key={index} className="example-card" onClick={() => applyBotExample(example)}>
              <h4>{example.name}</h4>
              <p>{example.prompt}</p>
              <div className="example-config">
                <span>{example.config.originSymbol} → {example.config.destinationSymbol}</span>
                <span>{example.config.amount} {example.config.originSymbol}</span>
                <span>{NETWORKS[example.config.originBlockchain]?.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="config-form">
        <div className="form-group">
          <label>🤖 Bot Name:</label>
          <input
            type="text"
            value={botConfig.name}
            onChange={(e) => setBotConfig({...botConfig, name: e.target.value})}
            placeholder="e.g., ETH Micro Sell Bot"
          />
        </div>

        <div className="form-group">
          <label>📝 Bot Description/Prompt:</label>
          <textarea
            value={botConfig.prompt}
            onChange={(e) => setBotConfig({...botConfig, prompt: e.target.value})}
            placeholder="Describe what your bot should do..."
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>💱 From (Origin):</label>
            <select
              value={botConfig.originSymbol}
              onChange={(e) => setBotConfig({...botConfig, originSymbol: e.target.value})}
            >
              {COINS.map(coin => <option key={coin} value={coin}>{coin}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>🌐 Origin Network:</label>
            <select
              value={botConfig.originBlockchain}
              onChange={(e) => setBotConfig({...botConfig, originBlockchain: e.target.value})}
            >
              {Object.entries(NETWORKS).map(([key, network]) => (
                <option key={key} value={key}>{network.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>💰 To (Destination):</label>
            <select
              value={botConfig.destinationSymbol}
              onChange={(e) => setBotConfig({...botConfig, destinationSymbol: e.target.value})}
            >
              {COINS.map(coin => <option key={coin} value={coin}>{coin}</option>)}
            </select>
          </div>

          <div className="form-group">
            <label>🌐 Destination Network:</label>
            <select
              value={botConfig.destinationBlockchain}
              onChange={(e) => setBotConfig({...botConfig, destinationBlockchain: e.target.value})}
            >
              {Object.entries(NETWORKS).map(([key, network]) => (
                <option key={key} value={key}>{network.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>🔢 Amount per Trade:</label>
          <input
            type="number"
            step="0.0001"
            value={botConfig.amount}
            onChange={(e) => setBotConfig({...botConfig, amount: e.target.value})}
            placeholder="e.g., 0.0002"
          />
        </div>

        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={botConfig.isTest}
              onChange={(e) => setBotConfig({...botConfig, isTest: e.target.checked})}
            />
            🧪 Test Mode (recommended for first deployment)
          </label>
        </div>

        <div className="config-preview">
          <h4>📋 Configuration Preview:</h4>
          <pre>{JSON.stringify(botConfig, null, 2)}</pre>
        </div>


      </div>
    </div>
  );

  const renderFundStep = () => (
    <div className="step-container">
      <div className="fund-header">
        <h2>💰 Step 3: Fund Your Wallet</h2>
        <p>Send tokens to your wallet to power your trading bot</p>
      </div>

      <div className="funding-grid">
        {/* Left Column - Wallet Info */}
        <div className="wallet-funding-card">
          <div className="card-header">
            <h3>📍 Your Wallet Address</h3>
            <span className="network-badge">{NETWORKS[botConfig.originBlockchain]?.name}</span>
          </div>
          
          <div className="address-section">
            <div className="address-display">
              <div className="address-label">Send {botConfig.originSymbol} to:</div>
              <div className="address-box">
                <code>{wallet?.address}</code>
                <button 
                  onClick={() => navigator.clipboard.writeText(wallet?.address)}
                  className="copy-btn"
                >
                  📋
                </button>
              </div>
            </div>
            
            <div className="qr-section">
              <div className="qr-container">
                <QRCode 
                  value={wallet?.address || ''} 
                  size={180}
                  bgColor="#1a1a1a"
                  fgColor="#ffffff"
                  level="H"
                />
              </div>
              <p className="qr-label">Scan with mobile wallet</p>
            </div>
          </div>
        </div>

        {/* Right Column - Requirements & Checklist */}
        <div className="funding-details">
          <div className="requirements-card">
            <h3>💸 Funding Requirements</h3>
            <div className="requirements-grid">
              <div className="req-item">
                <div className="req-icon">🌐</div>
                <div className="req-content">
                  <span className="req-label">Network</span>
                  <span className="req-value">{NETWORKS[botConfig.originBlockchain]?.name}</span>
                </div>
              </div>
              <div className="req-item">
                <div className="req-icon">🪙</div>
                <div className="req-content">
                  <span className="req-label">Token</span>
                  <span className="req-value">{botConfig.originSymbol}</span>
                </div>
              </div>
              <div className="req-item">
                <div className="req-icon">💰</div>
                <div className="req-content">
                  <span className="req-label">Amount Needed</span>
                  <span className="req-value">{botConfig.amount} {botConfig.originSymbol}</span>
                </div>
              </div>
              <div className="req-item">
                <div className="req-icon">⛽</div>
                <div className="req-content">
                  <span className="req-label">Gas Buffer</span>
                  <span className="req-value">~10% extra recommended</span>
                </div>
              </div>
            </div>
          </div>

          <div className="instructions-card">
            <h3>📋 Step-by-Step Instructions</h3>
            <div className="instruction-steps">
              <div className="instruction-step">
                <div className="step-number">1</div>
                <div className="step-content">
                  <strong>Open your wallet</strong>
                  <p>Use MetaMask, Trust Wallet, or any Web3 wallet</p>
                </div>
              </div>
              <div className="instruction-step">
                <div className="step-number">2</div>
                <div className="step-content">
                  <strong>Switch to {NETWORKS[botConfig.originBlockchain]?.name}</strong>
                  <p>Make sure you're on the correct network</p>
                </div>
              </div>
              <div className="instruction-step">
                <div className="step-number">3</div>
                <div className="step-content">
                  <strong>Send {botConfig.originSymbol} tokens</strong>
                  <p>Send at least {botConfig.amount} {botConfig.originSymbol} + gas fees</p>
                </div>
              </div>
              <div className="instruction-step">
                <div className="step-number">4</div>
                <div className="step-content">
                  <strong>Wait for confirmation</strong>
                  <p>Transaction must be confirmed before deployment</p>
                </div>
              </div>
            </div>
          </div>

          <div className="checklist-card">
            <h3>✅ Pre-deployment Checklist</h3>
            <div className="checklist-items">
              <label className="checklist-item">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <div className="check-content">
                  <strong>Tokens sent</strong>
                  <p>I have sent {botConfig.originSymbol} to the wallet address</p>
                </div>
              </label>
              <label className="checklist-item">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <div className="check-content">
                  <strong>Transaction confirmed</strong>
                  <p>My transaction is confirmed on {NETWORKS[botConfig.originBlockchain]?.name}</p>
                </div>
              </label>
              <label className="checklist-item">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <div className="check-content">
                  <strong>Sufficient balance</strong>
                  <p>I have enough funds for multiple trades + gas fees</p>
                </div>
              </label>
              <label className="checklist-item">
                <input type="checkbox" />
                <span className="checkmark"></span>
                <div className="check-content">
                  <strong>Risk understood</strong>
                  <p>I understand this will use real funds {!botConfig.isTest && '(Live mode)'}</p>
                </div>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Safety Banner */}
      <div className="safety-banner">
        <div className="safety-icon">🛡️</div>
        <div className="safety-content">
          <h4>Safety Reminder</h4>
          <p>
            {botConfig.isTest 
              ? "🧪 Test mode is enabled - your bot will validate trades without executing them"
              : "⚠️ Live mode is active - your bot will execute real trades with your funds"
            }
          </p>
        </div>
      </div>
    </div>
  );

  const renderDeployStep = () => (
    <div className="step-container">
      <h2>🚀 Step 4: Deploy Trading Bot</h2>
      
      <div className="deploy-summary">
        <h4>📋 Final Configuration:</h4>
        <div className="config-summary">
          <div className="summary-item">
            <span className="label">Bot Name:</span>
            <span className="value">{botConfig.name}</span>
          </div>
          <div className="summary-item">
            <span className="label">Trading Pair:</span>
            <span className="value">{botConfig.originSymbol} → {botConfig.destinationSymbol}</span>
          </div>
          <div className="summary-item">
            <span className="label">Networks:</span>
            <span className="value">{NETWORKS[botConfig.originBlockchain]?.name} → {NETWORKS[botConfig.destinationBlockchain]?.name}</span>
          </div>
          <div className="summary-item">
            <span className="label">Amount per Trade:</span>
            <span className="value">{botConfig.amount} {botConfig.originSymbol}</span>
          </div>
          <div className="summary-item">
            <span className="label">Wallet Address:</span>
            <span className="value">{wallet?.address}</span>
          </div>
          <div className="summary-item">
            <span className="label">Mode:</span>
            <span className="value">{botConfig.isTest ? '🧪 Test Mode' : '💰 Live Trading'}</span>
          </div>
        </div>

        <div className="deploy-actions">
          <button 
            onClick={deployBot} 
            className="btn-deploy" 
            disabled={loading}
          >
            {loading ? '🔄 Deploying...' : '🚀 Deploy Trading Bot'}
          </button>
        </div>
      </div>
    </div>
  );

  const renderManageStep = () => (
    <div className="step-container">
      <h2>🎛️ Manage Trading Bots</h2>
      
      <div className="bots-overview">
        <div className="overview-stats">
          <div className="stat-item">
            <span className="stat-number">{deployedBots.length}</span>
            <span className="stat-label">Total Bots</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{deployedBots.filter(bot => bot.isActive).length}</span>
            <span className="stat-label">Active Bots</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{deployedBots.filter(bot => !bot.isActive).length}</span>
            <span className="stat-label">Inactive Bots</span>
          </div>
        </div>

        <div className="bots-list">
          {deployedBots.map(bot => (
            <BotCard 
              key={bot.id} 
              bot={bot} 
              onActivate={activateBot}
              onDeactivate={deactivateBot}
              onFetchLogs={fetchBotLogs}
            />
          ))}
        </div>

        <div className="manage-actions">
          <button onClick={fetchDeployedBots} className="btn-secondary">
            🔄 Refresh Bots
          </button>
        </div>
      </div>
    </div>
  );

  const renderExploreAgents = () => (
    <div className="explore-container">
      <div className="explore-header">
        <h2>🔍 Explore Active Agents</h2>
        <p>Monitor performance, transactions, and portfolio data of running trading agents</p>
      </div>

      {deployedBots.length === 0 ? (
        <div className="no-agents">
          <div className="no-agents-icon">🤖</div>
          <h3>No Active Agents</h3>
          <p>Switch to "Launch Agent" tab to create your first trading bot</p>
          <button onClick={() => setActiveTab('launch')} className="btn-primary">
            Launch Your First Agent
          </button>
        </div>
      ) : (
        <div className="agents-grid">
          {deployedBots.map(bot => (
            <AgentCard 
              key={bot.id} 
              bot={bot}
              portfolio={walletPortfolios[bot.swapConfig?.senderAddress]}
              transactions={walletTransactions[bot.swapConfig?.senderAddress] || []}
              onActivate={activateBot}
              onDeactivate={deactivateBot}
              onFetchLogs={fetchBotLogs}
              loadingPortfolio={loadingPortfolio}
            />
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="App">
      <header className="app-header">
        <h1>🤖 AI Trading Bot Platform</h1>
        <p>Deploy automated trading bots across multiple EVM networks</p>
        
        {/* Tab Selector */}
        <div className="tab-selector">
          <button 
            className={`tab-btn ${activeTab === 'launch' ? 'active' : ''}`}
            onClick={() => setActiveTab('launch')}
          >
            🚀 Launch Agent
          </button>
          <button 
            className={`tab-btn ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            🔍 Explore Agents
          </button>
        </div>
      </header>

      <main className="app-main">
        {error && <div className="alert alert-error">❌ {error}</div>}
        {success && <div className="alert alert-success">✅ {success}</div>}

        {activeTab === 'launch' ? (
          <div className="single-page-layout">
            {/* Step 1: Wallet */}
            <div className="section-card">
              {renderWalletStep()}
            </div>

            {/* Step 2: Configure */}
            {wallet && (
              <div className="section-card">
                {renderConfigureStep()}
              </div>
            )}

            {/* Step 3: Fund */}
            {wallet && botConfig.name && botConfig.amount && (
              <div className="section-card">
                {renderFundStep()}
              </div>
            )}

            {/* Step 4: Deploy */}
            {wallet && botConfig.name && botConfig.amount && (
              <div className="section-card">
                {renderDeployStep()}
              </div>
            )}

            {/* Step 5: Manage */}
            {deployedBots.length > 0 && (
              <div className="section-card">
                {renderManageStep()}
              </div>
            )}
          </div>
        ) : (
          renderExploreAgents()
        )}
      </main>
    </div>
  );
}

// Enhanced Agent Card Component with Mobula Integration
const AgentCard = ({ bot, portfolio, transactions, onActivate, onDeactivate, onFetchLogs, loadingPortfolio }) => {
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);
  const [activeView, setActiveView] = useState('overview'); // 'overview', 'portfolio', 'transactions', 'logs'

  const loadLogs = async () => {
    const botLogs = await onFetchLogs(bot.id);
    setLogs(botLogs);
    setActiveView('logs');
  };

  const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 6
    }).format(amount || 0);
  };

  const formatToken = (amount, decimals = 6) => {
    return Number(amount || 0).toFixed(decimals);
  };

  const calculate24hChange = (portfolio) => {
    if (!portfolio) return null;
    
    // Try to get 24h change from pnl_history
    if (portfolio.pnl_history?.['24h'] && portfolio.pnl_history['24h'].length > 0) {
      const todayPnl = portfolio.pnl_history['24h'];
      const latestPnl = todayPnl[todayPnl.length - 1];
      const firstPnl = todayPnl[0];
      
      if (latestPnl && firstPnl && latestPnl[1] && firstPnl[1]) {
        const currentValue = parseFloat(latestPnl[1]);
        const previousValue = parseFloat(firstPnl[1]);
        if (previousValue !== 0) {
          return ((currentValue - previousValue) / previousValue) * 100;
        }
      }
    }
    
    // Fallback: calculate from total_pnl_history if available
    if (portfolio.total_pnl_history?.['24h']) {
      const totalPnl24h = portfolio.total_pnl_history['24h'].realized || 0;
      const currentBalance = portfolio.total_wallet_balance || 0;
      if (currentBalance > 0) {
        return (totalPnl24h / currentBalance) * 100;
      }
    }
    
    // Another fallback: use assets price changes
    if (portfolio.assets && portfolio.assets.length > 0) {
      let totalChange = 0;
      let totalWeight = 0;
      
      portfolio.assets.forEach(asset => {
        if (asset.price_change_24h !== undefined && asset.estimated_balance) {
          const weight = asset.estimated_balance;
          totalChange += asset.price_change_24h * weight;
          totalWeight += weight;
        }
      });
      
      if (totalWeight > 0) {
        return (totalChange / totalWeight) * 100;
      }
    }
    
    return null;
  };

  const getWalletAddress = () => bot.swapConfig?.senderAddress || 'N/A';

  return (
    <div className={`agent-card ${bot.isActive ? 'active' : 'inactive'}`}>
      {/* Agent Header */}
      <div className="agent-header">
        <div className="agent-title">
          <h4>{bot.name}</h4>
          <span className={`status-badge ${bot.isActive ? 'active' : 'inactive'}`}>
            {bot.isActive ? '🟢 Active' : '🔴 Inactive'}
          </span>
        </div>
        <div className="agent-wallet">
          <span className="wallet-label">Wallet:</span>
          <code className="wallet-address">{getWalletAddress().slice(0, 6)}...{getWalletAddress().slice(-4)}</code>
        </div>
      </div>

      {/* Agent Navigation */}
      <div className="agent-nav">
        <button 
          className={`nav-btn ${activeView === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveView('overview')}
        >
          📊 Overview
        </button>
        <button 
          className={`nav-btn ${activeView === 'portfolio' ? 'active' : ''}`}
          onClick={() => setActiveView('portfolio')}
        >
          💰 Portfolio
        </button>
        <button 
          className={`nav-btn ${activeView === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveView('transactions')}
        >
          📈 Transactions
        </button>
        <button 
          className={`nav-btn ${activeView === 'logs' ? 'active' : ''}`}
          onClick={() => loadLogs()}
        >
          📋 Logs
        </button>
      </div>

      {/* Agent Content */}
      <div className="agent-content">
        {activeView === 'overview' && (
          <div className="overview-content">
            <div className="trading-info">
              <div className="info-item">
                <span className="info-label">Trading Pair:</span>
                <span className="info-value">{bot.swapConfig.originSymbol} → {bot.swapConfig.destinationSymbol}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Amount per Trade:</span>
                <span className="info-value">{bot.swapConfig.amount} {bot.swapConfig.originSymbol}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Network:</span>
                <span className="info-value">{bot.swapConfig.originBlockchain}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Created:</span>
                <span className="info-value">{new Date(bot.createdAt).toLocaleString()}</span>
              </div>
            </div>
            
            {portfolio && (
              <div className="portfolio-summary">
                <h5>💰 Wallet Summary</h5>
                <div className="summary-stats">
                  <div className="stat-item">
                    <span className="stat-label">Total Balance</span>
                    <span className="stat-value">{formatCurrency(portfolio.total_wallet_balance)}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">Assets</span>
                    <span className="stat-value">{portfolio.assets?.length || 0}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">24h Change</span>
                    <span className={`stat-value ${calculate24hChange(portfolio) >= 0 ? 'positive' : 'negative'}`}>
                      {calculate24hChange(portfolio) !== null 
                        ? `${calculate24hChange(portfolio) >= 0 ? '+' : ''}${calculate24hChange(portfolio).toFixed(2)}%`
                        : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeView === 'portfolio' && (
          <div className="portfolio-content">
            {loadingPortfolio ? (
              <div className="loading-state">
                <div className="loading-spinner">⏳</div>
                <p>Loading portfolio data...</p>
              </div>
            ) : portfolio ? (
              <>
                <div className="portfolio-header">
                  <h5>💰 Portfolio Holdings</h5>
                  <div className="balance-info">
                    <div className="total-balance">
                      {formatCurrency(portfolio.total_wallet_balance)}
                    </div>
                    {calculate24hChange(portfolio) !== null && (
                      <div className="portfolio-24h-change">
                        <span className={`change-value ${calculate24hChange(portfolio) >= 0 ? 'positive' : 'negative'}`}>
                          {calculate24hChange(portfolio) >= 0 ? '+' : ''}
                          {calculate24hChange(portfolio).toFixed(2)}% (24h)
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="assets-list">
                  {portfolio.assets?.slice(0, 5).map((asset, index) => (
                    <div key={index} className="asset-item">
                      <div className="asset-info">
                        <div className="asset-name">{asset.asset?.symbol || 'Unknown'}</div>
                        <div className="asset-balance">{formatToken(asset.token_balance)} tokens</div>
                      </div>
                      <div className="asset-value">
                        <div className="usd-value">{formatCurrency(asset.estimated_balance)}</div>
                        <div className={`price-change ${asset.price_change_24h >= 0 ? 'positive' : 'negative'}`}>
                          {asset.price_change_24h >= 0 ? '+' : ''}{(asset.price_change_24h * 100).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {(portfolio.total_realized_pnl !== undefined || portfolio.total_pnl_history) && (
                  <div className="pnl-summary">
                    <h6>📈 Performance Metrics</h6>
                    <div className="pnl-grid">
                      {portfolio.total_realized_pnl !== undefined && (
                        <div className="pnl-item">
                          <span>Total Realized P&L:</span>
                          <span className={portfolio.total_realized_pnl >= 0 ? 'positive' : 'negative'}>
                            {formatCurrency(portfolio.total_realized_pnl)}
                          </span>
                        </div>
                      )}
                      {portfolio.total_unrealized_pnl !== undefined && (
                        <div className="pnl-item">
                          <span>Total Unrealized P&L:</span>
                          <span className={portfolio.total_unrealized_pnl >= 0 ? 'positive' : 'negative'}>
                            {formatCurrency(portfolio.total_unrealized_pnl)}
                          </span>
                        </div>
                      )}
                      {calculate24hChange(portfolio) !== null && (
                        <div className="pnl-item">
                          <span>24h Change:</span>
                          <span className={calculate24hChange(portfolio) >= 0 ? 'positive' : 'negative'}>
                            {calculate24hChange(portfolio) >= 0 ? '+' : ''}
                            {calculate24hChange(portfolio).toFixed(2)}%
                          </span>
                        </div>
                      )}
                      {portfolio.total_pnl_history?.['7d'] && (
                        <div className="pnl-item">
                          <span>7d P&L:</span>
                          <span className={portfolio.total_pnl_history['7d'].realized >= 0 ? 'positive' : 'negative'}>
                            {formatCurrency(portfolio.total_pnl_history['7d'].realized)}
                          </span>
                        </div>
                      )}
                      {portfolio.total_pnl_history?.['30d'] && (
                        <div className="pnl-item">
                          <span>30d P&L:</span>
                          <span className={portfolio.total_pnl_history['30d'].realized >= 0 ? 'positive' : 'negative'}>
                            {formatCurrency(portfolio.total_pnl_history['30d'].realized)}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="no-data">
                <p>No portfolio data available</p>
                <small>Portfolio data will load automatically for active agents</small>
              </div>
            )}
          </div>
        )}

        {activeView === 'transactions' && (
          <div className="transactions-content">
            <h5>📈 Recent Transactions</h5>
            {transactions && transactions.length > 0 ? (
              <div className="transactions-list">
                {transactions.slice(0, 10).map((tx, index) => (
                  <div key={index} className="transaction-item">
                    <div className="tx-info">
                      <div className="tx-type">{tx.type || 'Transfer'}</div>
                      <div className="tx-time">{new Date(tx.timestamp * 1000).toLocaleDateString()}</div>
                    </div>
                    <div className="tx-details">
                      <div className="tx-amount">{formatToken(tx.amount)} {tx.asset?.symbol}</div>
                      <div className="tx-usd">{formatCurrency(tx.amount_usd)}</div>
                    </div>
                    <div className="tx-hash">
                      <a 
                        href={`https://etherscan.io/tx/${tx.hash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hash-link"
                      >
                        {tx.hash?.slice(0, 6)}...{tx.hash?.slice(-4)}
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No recent transactions</p>
                <small>Transaction history will appear here once the agent starts trading</small>
              </div>
            )}
          </div>
        )}

        {activeView === 'logs' && (
          <div className="logs-content">
            <h5>📋 Execution Logs</h5>
            {logs.length > 0 ? (
              <div className="logs-container">
                {logs.map((log, index) => (
                  <div key={index} className="log-entry">
                    <span className="log-time">{new Date(log.timestamp).toLocaleString()}</span>
                    <span className="log-action">{log.action}</span>
                    <span className="log-message">{log.message}</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-data">
                <p>No logs available</p>
                <small>Agent execution logs will appear here</small>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Agent Actions */}
      <div className="agent-actions">
        {bot.isActive ? (
          <button onClick={() => onDeactivate(bot.id)} className="btn-danger">
            ⏹️ Deactivate
          </button>
        ) : (
          <button onClick={() => onActivate(bot.id)} className="btn-success">
            ▶️ Activate
          </button>
        )}
      </div>
    </div>
  );
};

// Simple Bot Card Component for Launch Tab
const BotCard = ({ bot, onActivate, onDeactivate, onFetchLogs }) => {
  const [logs, setLogs] = useState([]);
  const [showLogs, setShowLogs] = useState(false);

  const loadLogs = async () => {
    const botLogs = await onFetchLogs(bot.id);
    setLogs(botLogs);
    setShowLogs(true);
  };

  return (
    <div className={`bot-card ${bot.isActive ? 'active' : 'inactive'}`}>
      <div className="bot-header">
        <h4>{bot.name}</h4>
        <span className={`status-badge ${bot.isActive ? 'active' : 'inactive'}`}>
          {bot.isActive ? '🟢 Active' : '🔴 Inactive'}
        </span>
      </div>

      <div className="bot-details">
        <div className="detail-row">
          <span>Trading:</span>
          <span>{bot.swapConfig.originSymbol} → {bot.swapConfig.destinationSymbol}</span>
        </div>
        <div className="detail-row">
          <span>Amount:</span>
          <span>{bot.swapConfig.amount} {bot.swapConfig.originSymbol}</span>
        </div>
        <div className="detail-row">
          <span>Network:</span>
          <span>{bot.swapConfig.originBlockchain}</span>
        </div>
        <div className="detail-row">
          <span>Created:</span>
          <span>{new Date(bot.createdAt).toLocaleString()}</span>
        </div>
      </div>

      <div className="bot-actions">
        {bot.isActive ? (
          <button onClick={() => onDeactivate(bot.id)} className="btn-danger">
            ⏹️ Deactivate
          </button>
        ) : (
          <button onClick={() => onActivate(bot.id)} className="btn-success">
            ▶️ Activate
          </button>
        )}
        <button onClick={loadLogs} className="btn-secondary">
          📋 View Logs
        </button>
      </div>

      {showLogs && (
        <div className="bot-logs">
          <h5>📋 Execution Logs:</h5>
          {logs.length > 0 ? (
            <div className="logs-container">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  <span className="log-time">{new Date(log.timestamp).toLocaleString()}</span>
                  <span className="log-action">{log.action}</span>
                  <span className="log-message">{log.message}</span>
                </div>
              ))}
            </div>
          ) : (
            <p>No logs available</p>
          )}
          <button onClick={() => setShowLogs(false)} className="btn-secondary">
            Hide Logs
          </button>
        </div>
      )}
    </div>
  );
};

export default App;