import { useState } from 'react';
import { Cpu, ExternalLink } from 'lucide-react';
import './index.css';
import { useCases } from './data/useCases';
import type { UseCase } from './data/useCases';
import AIChat from './components/AIChat';
import CodeEditor from './components/CodeEditor';
import LivePreview from './components/LivePreview';

type HistoryEntry = { role: 'user' | 'assistant'; text: string };

export default function App() {
  const [activeUseCase, setActiveUseCase] = useState<UseCase | null>(null);
  const [generatedCode, setGeneratedCode] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isGenerated, setIsGenerated] = useState(false);
  const [history, setHistory] = useState<HistoryEntry[]>([]);

  const handleGenerateCommand = (useCaseId: string) => {
    const uc = useCases.find(u => u.id === useCaseId);
    if (!uc) return;
    setActiveUseCase(uc);
    setIsGenerating(true);
    setIsGenerated(false);
    setHistory(prev => [
      ...prev,
      { role: 'user', text: uc.prompt },
      { role: 'assistant', text: `食品量子最適化エンジンを起動中...\nユースケース: ${uc.title}\n\nQUBO行列を構築し、量子シミュレーテッドアニーリングで求解します。` }
    ]);
    setGeneratedCode(uc.codeSnippet);
    setTimeout(() => setIsGenerating(false), 2800);
  };

  const handleReset = () => {
    setActiveUseCase(null);
    setGeneratedCode('');
    setIsGenerating(false);
    setIsGenerated(false);
    setHistory([]);
  };

  return (
    <div className="app-container">
      {/* Portal button */}
      <a href="https://company-dashboard.up.railway.app/expo" target="_blank" rel="noopener noreferrer"
        style={{ position: 'fixed', top: 12, right: 16, zIndex: 999, display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px', borderRadius: 8, background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)',
          color: '#F97316', fontSize: '0.7rem', fontWeight: 600, textDecoration: 'none', backdropFilter: 'blur(8px)' }}>
        <ExternalLink size={12} /> EXPOポータル
      </a>

      {/* Left pane - AI Chat */}
      <div className="pane glass-panel" style={{ flex: '0 0 320px' }}>
        <div className="pane-header">
          <span style={{ color: 'var(--quantum-green)', fontSize: '1.1rem' }}>&#9883;</span>
          食品 Vibe Coder
        </div>
        <div className="pane-content">
          <AIChat onGenerate={handleGenerateCommand} onReset={handleReset} isGenerating={isGenerating} history={history} />
        </div>
      </div>

      {/* Center pane - Code Editor */}
      <div className="pane glass-panel" style={{ flex: 1 }}>
        <div className="pane-header">
          <span style={{ color: 'var(--quantum-blue)' }}>&#9675;</span>
          quantum_food_engine.py
        </div>
        <div className="pane-content">
          <CodeEditor code={generatedCode} isGenerating={isGenerating} onAnimationComplete={() => setIsGenerated(true)} />
        </div>
      </div>

      {/* Right pane - Live Preview */}
      <div className="pane glass-panel" style={{ flex: '0 0 380px' }}>
        <div className="pane-header">
          <span style={{ color: 'var(--quantum-green)' }}>&#9673;</span>
          ライブダッシュボード (食品 Control Center)
        </div>
        <div className="pane-content">
          {isGenerated && activeUseCase ? (
            <LivePreview activeUseCase={activeUseCase} />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--text-muted)' }}>
              <Cpu size={40} opacity={0.25} />
              <span style={{ fontSize: '0.8rem' }}>ユースケースを選択してVibe Codingを押してください</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
