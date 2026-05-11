import { useState } from 'react';
import { FastForward, Loader2, RotateCcw } from 'lucide-react';
import { useCases } from '../data/useCases';

interface Props {
  onGenerate: (useCaseId: string) => void;
  onReset: () => void;
  isGenerating: boolean;
  history: { role: 'user' | 'assistant'; text: string }[];
}

export default function AIChat({ onGenerate, onReset, isGenerating, history }: Props) {
  const [prompt, setPrompt] = useState('');
  const [selectedId, setSelectedId] = useState('');

  const handleSelect = (id: string) => {
    const uc = useCases.find(u => u.id === id);
    if (!uc) return;
    setSelectedId(id);
    setPrompt(uc.prompt);
    fetch('/api/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ app_id: 'food', usecase_id: id, usecase_title: uc.title })
    }).catch(() => {});
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedId || isGenerating) return;
    onGenerate(selectedId);
  };

  /* If there's history, show conversation */
  if (history.length > 0) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <div style={{ flex: 1, overflowY: 'auto', padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
          {history.map((h, i) => (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                {h.role === 'user' ? '社長' : '食品 Quantum Copilot'}
              </span>
              <div style={{
                padding: '10px 12px', borderRadius: 8, fontSize: '0.75rem', lineHeight: 1.6, whiteSpace: 'pre-wrap',
                background: h.role === 'user' ? 'rgba(249,115,22,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${h.role === 'user' ? 'rgba(249,115,22,0.2)' : 'rgba(255,255,255,0.06)'}`,
                color: 'var(--text-main)'
              }}>
                {h.text}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderTop: '1px solid var(--border-color)' }}>
          <button onClick={onReset} style={{
            width: '100%', padding: '10px', borderRadius: 8, border: '1px solid var(--border-color)',
            background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontSize: '0.8rem',
            fontFamily: 'var(--font-sans)'
          }}>
            <RotateCcw size={14} /> ユースケース一覧に戻る
          </button>
        </div>
      </div>
    );
  }

  /* Default: UC list + prompt */
  return (
    <>
      <div style={{ padding: '12px 12px 4px', color: 'var(--text-muted)', fontSize: '0.75rem', lineHeight: 1.6 }}>
        <span style={{ color: 'var(--quantum-green)', fontWeight: 600 }}>食品 Quantum Copilot</span> へようこそ。
        下のユースケースを選んで <strong>Vibe Coding</strong> を押してください。
      </div>
      <div className="usecase-list">
        {useCases.map(uc => (
          <div key={uc.id} className={`usecase-item${selectedId === uc.id ? ' active' : ''}`} onClick={() => handleSelect(uc.id)}>
            <h3>{uc.title}</h3>
            <p>{uc.description}</p>
          </div>
        ))}
      </div>
      <div className="prompt-area">
        <form onSubmit={handleSubmit}>
          <textarea value={prompt} readOnly placeholder="ユースケースを選択してください..." />
          <button type="submit" className="btn-send" disabled={!selectedId || isGenerating}
            style={{ opacity: !selectedId || isGenerating ? 0.4 : 1 }}>
            {isGenerating ? <Loader2 size={20} className="anim-spin" /> : <FastForward size={20} />}
          </button>
        </form>
      </div>
    </>
  );
}
