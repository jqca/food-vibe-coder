import { useState, useEffect } from 'react';
import type { UseCase, Metric } from '../data/useCases';
import VizCanvas, { getVizType } from './VizCanvas';
import type { VizType } from './VizCanvas';

/* ---- helpers ---- */
function parseToSeconds(s: string): number {
  const m = s.match(/([\d.]+)\s*(ms|秒|分|時間|h|s)/);
  if (!m) return parseFloat(s) || 1;
  const v = parseFloat(m[1]);
  switch (m[2]) {
    case 'ms': return v / 1000;
    case '秒': case 's': return v;
    case '分': return v * 60;
    case '時間': case 'h': return v * 3600;
    default: return v;
  }
}
function fmtTime(sec: number): string {
  if (sec < 0.001) return `${(sec * 1e6).toFixed(0)}μs`;
  if (sec < 1) return `${(sec * 1000).toFixed(0)}ms`;
  if (sec < 60) return `${sec.toFixed(1)}秒`;
  if (sec < 3600) return `${(sec / 60).toFixed(1)}分`;
  return `${(sec / 3600).toFixed(1)}時間`;
}

/* ---- viz labels ---- */
const vizLabels: Record<VizType, { idle: string; running: string; done: string }> = {
  demand:       { idle: '需要予測モデル待機中',        running: '予測モデル推論中...',        done: '需要予測完了' },
  recipe:       { idle: 'レシピ配合モデル待機中',      running: '栄養バランス最適化中...',    done: '最適配合決定' },
  coldchain:    { idle: 'コールドチェーン待機中',      running: '温度帯ルート最適化中...',    done: '鮮度管理最適化完了' },
  factoryline:  { idle: '生産ライン待機中',            running: 'スケジュール最適化中...',    done: 'ライン最適化完了' },
  haccp:        { idle: 'HACCP監視待機中',             running: '異常パターン学習中...',      done: 'CCP監視アクティブ' },
  foodloss:     { idle: 'マッチング待機中',            running: '余剰食品マッチング中...',    done: 'マッチング完了' },
  nutrition:    { idle: '献立最適化待機中',            running: '栄養バランス計算中...',      done: '献立最適化完了' },
  blend:        { idle: 'ブレンド設計待機中',          running: '風味プロファイル最適化中...', done: 'ブレンド決定' },
  warehouse:    { idle: '倉庫配置待機中',              running: '温度帯ゾーニング最適化中...', done: '配置最適化完了' },
  procurement:  { idle: '調達戦略待機中',              running: 'ポートフォリオ最適化中...',  done: '調達戦略決定' },
  inspection:   { idle: '品質検査待機中',              running: 'QCNN推論中...',              done: '検査モデル稼働中' },
  allergen:     { idle: 'アレルゲン追跡待機中',        running: 'グラフ探索中...',            done: '全品目追跡完了' },
  traceability: { idle: 'トレーサビリティ待機中',      running: 'ブロックチェーン検証中...',  done: 'チェーン検証完了' },
  pbdev:        { idle: 'PB商品シミュレーション待機中', running: '市場フィット分析中...',      done: '最適商品決定' },
  delivery:     { idle: '配送ルート待機中',            running: '量子TSP求解中...',           done: 'ルート最適化完了' },
  packaging:    { idle: '包装設計待機中',              running: 'バリア性能最適化中...',      done: '最適構成決定' },
  fermentation: { idle: '発酵制御待機中',              running: '発酵プロファイル最適化中...', done: '最適制御決定' },
  pesticide:    { idle: 'スクリーニング待機中',        running: '量子フーリエ解析中...',      done: 'スクリーニング完了' },
  marketing:    { idle: 'セグメント分析待機中',        running: '量子クラスタリング中...',    done: 'セグメント抽出完了' },
  brewing:      { idle: '醸造レシピ待機中',            running: 'レシピ最適化中...',          done: '最適レシピ決定' },
  safetyrisk:   { idle: 'リスク予測待機中',            running: 'ベイズネット推論中...',      done: 'リスク予測完了' },
};

/* ---- main component ---- */
interface Props { activeUseCase: UseCase }

export default function LivePreview({ activeUseCase }: Props) {
  const [optimizationLevel, setOptimizationLevel] = useState(75);
  const [dataSize, setDataSize] = useState(1);
  const [isRunning, setIsRunning] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [useQuantum, setUseQuantum] = useState(true);
  const [progress, setProgress] = useState(0);

  const vizType = getVizType(activeUseCase.id);
  const labels = vizLabels[vizType] || vizLabels.demand;
  const isActionMode = activeUseCase.id.includes('haccp') || activeUseCase.id.includes('inspection') || activeUseCase.id.includes('safety');

  useEffect(() => { setIsOptimized(false); setIsRunning(false); setProgress(0); setSelectedNode(null); }, [activeUseCase.id]);

  useEffect(() => {
    if (!isRunning) return;
    let p = 0;
    const iv = setInterval(() => { p += 2; setProgress(p); if (p >= 100) { clearInterval(iv); setIsRunning(false); setIsOptimized(true); } }, 60);
    return () => clearInterval(iv);
  }, [isRunning]);

  const qSec = parseToSeconds(activeUseCase.quantumVsClassical.quantumTime);
  const cSec = parseToSeconds(activeUseCase.quantumVsClassical.classicalTime);
  const scales = [
    { label: '小規模', cMult: 1, qMult: 1 },
    { label: '中規模', cMult: 10, qMult: 1.5 },
    { label: '大規模', cMult: 100, qMult: 2 },
  ];

  function getAdjustedValue(m: Metric): string {
    if (!isOptimized) return m.value;
    const n = parseFloat(m.value);
    if (isNaN(n)) return m.value;
    const factor = 1 + (optimizationLevel - 50) / 200;
    return m.trend === 'up' ? `${(n * factor).toFixed(1)}${m.value.replace(/[\d.]+/, '')}` :
           m.trend === 'down' ? `${(n / factor).toFixed(1)}${m.value.replace(/[\d.]+/, '')}` : m.value;
  }

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* Control Panel */}
      <div className="control-panel">
        <div className="control-row">
          <label>最適化レベル</label>
          <input type="range" min={0} max={100} value={optimizationLevel} onChange={e => setOptimizationLevel(+e.target.value)} className="slider" />
          <span className="slider-val">{optimizationLevel}%</span>
        </div>
        <div className="control-row">
          <label>データ規模</label>
          <div className="toggle-group">
            {['S','M','L'].map((l, i) => (
              <button key={l} className={`toggle-btn${dataSize === i ? ' active' : ''}`} onClick={() => setDataSize(i)}>{l}</button>
            ))}
          </div>
          <button className={`toggle-btn${useQuantum ? ' active' : ''}`} onClick={() => setUseQuantum(!useQuantum)} style={{ marginLeft: 8, fontSize: '0.6rem' }}>
            {useQuantum ? '量子' : '古典'}
          </button>
        </div>
        <div className="control-row" style={{ gap: 6 }}>
          <button className="run-btn" disabled={isRunning} onClick={() => { setIsOptimized(false); setProgress(0); setIsRunning(true); }}>
            {isRunning ? '実行中...' : isActionMode ? 'アクティベート' : '最適化実行'}
          </button>
          <button className="reset-btn" onClick={() => { setIsOptimized(false); setIsRunning(false); setProgress(0); setSelectedNode(null); }}>リセット</button>
        </div>
      </div>

      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '8px 10px', display: 'flex', flexDirection: 'column', gap: 10 }}>

        {/* Visualization */}
        <div className={`visualization-box${isOptimized ? ' optimized' : ''}${isActionMode ? ' action-mode' : ''}`}>
          <VizCanvas vizType={vizType} running={isRunning} optimized={isOptimized} progress={progress} optLevel={optimizationLevel} selectedNode={selectedNode} onNodeClick={setSelectedNode} />
          <div className={`viz-overlay${isOptimized ? ' optimized' : ''}`}>{isRunning ? labels.running : isOptimized ? labels.done : labels.idle}</div>
          {isRunning && <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
        </div>

        {/* QvC 3-scale breakdown */}
        <div className="qvc-breakdown">
          <div className="qvc-title">量子 vs 古典 — 3スケール比較</div>
          {scales.map((sc, i) => {
            const ct = cSec * sc.cMult; const qt = qSec * sc.qMult;
            const ratio = ct / qt;
            const verdict = ratio > 100 ? 'verdict-quantum' : ratio > 10 ? 'verdict-neutral' : 'verdict-critical';
            return (
              <div key={i} className="qvc-scale-block">
                <span className="qvc-scale-label">{sc.label}</span>
                <span className="qvc-time">古典 {fmtTime(ct)}</span>
                <span className="qvc-time" style={{ color: 'var(--quantum-green)' }}>量子 {fmtTime(qt)}</span>
                <span className={`qvc-verdict ${verdict}`}>{ratio.toFixed(0)}x</span>
              </div>
            );
          })}
        </div>

        {/* Metrics */}
        <div className="metrics-grid">
          {activeUseCase.metrics.map((m, i) => (
            <div key={i} className={`metric-card${isOptimized ? ' optimized' : ''}`}>
              <div>
                <div className="metric-label">{m.label}</div>
                <div className="metric-value" style={isOptimized ? { color: 'var(--quantum-green)', textShadow: '0 0 12px rgba(249,115,22,0.4)' } : {}}>
                  {getAdjustedValue(m)}
                </div>
              </div>
              <span style={{ fontSize: '1.2rem' }}>{m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '→'}</span>
            </div>
          ))}
        </div>

        {/* Insight cards */}
        <div className="insight-card impact-card">
          <div className="insight-tag">BUSINESS IMPACT</div>
          <div className="insight-title">経営インパクト</div>
          <p className="insight-body">{activeUseCase.businessImpact}</p>
        </div>

        <div className="insight-card qvc-card">
          <div className="insight-tag">QUANTUM vs CLASSICAL</div>
          <div className="insight-title">量子アドバンテージ</div>
          <p className="insight-body">
            量子: {activeUseCase.quantumVsClassical.quantumTime} / 古典: {activeUseCase.quantumVsClassical.classicalTime} ={' '}
            <strong style={{ color: 'var(--quantum-green)' }}>{activeUseCase.quantumVsClassical.advantage}</strong>
          </p>
        </div>

        <div className="insight-card verify-card">
          <div className="insight-tag">VERIFICATION SUMMARY</div>
          <div className="insight-title">検証・信頼性サマリー</div>
          <p className="insight-body">{activeUseCase.verificationSummary}</p>
        </div>
      </div>
    </div>
  );
}
