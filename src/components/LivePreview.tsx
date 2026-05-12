import React, { useState, useCallback, useEffect } from 'react';
import type { UseCase } from '../data/useCases';
import { TrendingUp, TrendingDown, Truck, Zap, ShieldCheck, Target, Play, RotateCcw } from 'lucide-react';
import VizCanvas, { getVizType } from './VizCanvas';
import type { VizType } from './VizCanvas';

const parseToSeconds = (timeStr: string): number | null => {
  if (!timeStr) return null;
  if (/即時|リアルタイム/.test(timeStr)) return 0.05;
  if (/日次|翌朝/.test(timeStr)) return 86400;
  const weekMatch = timeStr.match(/([\d.]+)\s*週間/);
  if (weekMatch) return parseFloat(weekMatch[1]) * 7 * 86400;
  const monthMatch = timeStr.match(/([\d.]+)\s*[ヶヵ]月/);
  if (monthMatch) return parseFloat(monthMatch[1]) * 30 * 86400;
  const numMatch = timeStr.match(/([\d.]+)/);
  if (!numMatch) return null;
  const num = parseFloat(numMatch[1]);
  if (timeStr.includes('ms')) return num / 1000;
  if (timeStr.includes('秒')) return num;
  if (timeStr.includes('分')) return num * 60;
  if (timeStr.includes('時間')) return num * 3600;
  if (timeStr.includes('日')) return num * 86400;
  return num;
};

const fmtTime = (sec: number): string => {
  if (sec < 0.001) return `${(sec * 1_000_000).toFixed(0)}μs`;
  if (sec < 1)     return `${(sec * 1000).toFixed(0)}ms`;
  if (sec < 60)    return `${sec < 10 ? sec.toFixed(2) : sec.toFixed(1)}秒`;
  if (sec < 3600)  return `${(sec / 60).toFixed(1)}分`;
  if (sec < 86400) return `${(sec / 3600).toFixed(1)}時間`;
  if (sec < 86400 * 30) return `${(sec / 86400).toFixed(1)}日`;
  return `${(sec / (86400 * 30)).toFixed(1)}ヶ月`;
};

interface Props {
  activeUseCase: UseCase;
}

const LivePreview: React.FC<Props> = ({ activeUseCase }) => {
  const [optimizationLevel, setOptimizationLevel] = useState(50);
  const [dataSize, setDataSize] = useState(5000);
  const [isRunning, setIsRunning] = useState(false);
  const [isOptimized, setIsOptimized] = useState(false);
  const [selectedNode, setSelectedNode] = useState<number | null>(null);
  const [useQuantum, setUseQuantum] = useState(true);
  const [progress, setProgress] = useState(0);

  const vizType = getVizType(activeUseCase.id);
  const isActionMode = activeUseCase.id.includes('haccp') || activeUseCase.id.includes('inspection') || activeUseCase.id.includes('safety');

  useEffect(() => {
    setIsOptimized(false);
    setIsRunning(false);
    setSelectedNode(null);
    setProgress(0);
    setOptimizationLevel(50);
    setDataSize(5000);
  }, [activeUseCase.id]);

  const statusClass = isActionMode || isOptimized ? 'action-mode' : '';

  const getTrendIcon = (trend: string, active: boolean) => {
    const color = active ? "#eab308" : "#2dd4bf";
    if (trend === 'up') return <TrendingUp size={20} color={color} />;
    if (trend === 'down') return <TrendingDown size={20} color={color} />;
    return <Truck size={20} color={color} />;
  };

  const handleRunSimulation = useCallback(() => {
    setIsRunning(true);
    setIsOptimized(false);
    setProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        p = 100;
        clearInterval(interval);
        setTimeout(() => {
          setIsRunning(false);
          setIsOptimized(true);
          setProgress(0);
        }, 300);
      }
      setProgress(Math.min(p, 100));
    }, 120);
  }, []);

  const handleReset = useCallback(() => {
    setIsOptimized(false);
    setIsRunning(false);
    setProgress(0);
    setOptimizationLevel(50);
    setDataSize(5000);
    setSelectedNode(null);
    setUseQuantum(true);
  }, []);

  const getAdjustedValue = (value: string, trend: 'up' | 'down' | 'neutral') => {
    if (!isOptimized) return value;
    const match = value.match(/([\d.]+)/);
    if (!match) return value;
    const num = parseFloat(match[1]);
    const qBoost = useQuantum ? 1.15 : 1.0;
    const factor = (optimizationLevel / 100) * qBoost;
    const adjusted = trend === 'down'
      ? num * (1 - factor * 0.25)
      : num * (1 + factor * 0.3);
    const decimals = match[1].includes('.') ? match[1].split('.')[1].length : 0;
    return value.replace(match[1], adjusted.toFixed(decimals));
  };

  const vizLabels: Record<string, { idle: string; running: string; done: string }> = {
    demand:       { idle: '需要予測モデル待機中',        running: '予測モデル推論中',          done: '✓ 需要予測完了' },
    recipe:       { idle: 'レシピ配合モデル待機中',      running: '栄養バランス最適化中',      done: '✓ 最適配合決定' },
    coldchain:    { idle: 'コールドチェーン待機中',      running: '温度帯ルート最適化中',      done: '✓ 鮮度管理最適化完了' },
    factoryline:  { idle: '生産ライン待機中',            running: 'スケジュール最適化中',      done: '✓ ライン最適化完了' },
    haccp:        { idle: 'HACCP監視待機中',             running: '異常パターン学習中',        done: '✓ CCP監視アクティブ' },
    foodloss:     { idle: 'マッチング待機中',            running: '余剰食品マッチング中',      done: '✓ マッチング完了' },
    nutrition:    { idle: '献立最適化待機中',            running: '栄養バランス計算中',        done: '✓ 献立最適化完了' },
    blend:        { idle: 'ブレンド設計待機中',          running: '風味プロファイル最適化中',   done: '✓ ブレンド決定' },
    warehouse:    { idle: '倉庫配置待機中',              running: '温度帯ゾーニング最適化中',   done: '✓ 配置最適化完了' },
    procurement:  { idle: '調達戦略待機中',              running: 'ポートフォリオ最適化中',    done: '✓ 調達戦略決定' },
    inspection:   { idle: '品質検査待機中',              running: 'QCNN推論中',               done: '✓ 検査モデル稼働中' },
    allergen:     { idle: 'アレルゲン追跡待機中',        running: 'グラフ探索中',              done: '✓ 全品目追跡完了' },
    traceability: { idle: 'トレーサビリティ待機中',      running: 'ブロックチェーン検証中',    done: '✓ チェーン検証完了' },
    pbdev:        { idle: 'PB商品シミュレーション待機中', running: '市場フィット分析中',        done: '✓ 最適商品決定' },
    delivery:     { idle: '配送ルート待機中',            running: '量子TSP求解中',             done: '✓ ルート最適化完了' },
    packaging:    { idle: '包装設計待機中',              running: 'バリア性能最適化中',        done: '✓ 最適構成決定' },
    fermentation: { idle: '発酵制御待機中',              running: '発酵プロファイル最適化中',   done: '✓ 最適制御決定' },
    pesticide:    { idle: 'スクリーニング待機中',        running: '量子フーリエ解析中',        done: '✓ スクリーニング完了' },
    marketing:    { idle: 'セグメント分析待機中',        running: '量子クラスタリング中',      done: '✓ セグメント抽出完了' },
    brewing:      { idle: '醸造レシピ待機中',            running: 'レシピ最適化中',            done: '✓ 最適レシピ決定' },
    safetyrisk:   { idle: 'リスク予測待機中',            running: 'ベイズネット推論中',        done: '✓ リスク予測完了' },
  };

  const getVizLabel = () => {
    const labels = vizLabels[vizType] || vizLabels.demand;
    if (isRunning) return `${labels.running} ${Math.round(progress)}%`;
    if (isOptimized) return `${labels.done} (${useQuantum ? '量子' : '古典'})`;
    return labels.idle;
  };

  return (
    <div className="preview-container">
      {/* ビジュアライゼーション */}
      <div className={`visualization-box ${statusClass} ${isRunning ? 'viz-running' : ''}`}>
        <VizCanvas
          vizType={vizType}
          running={isRunning}
          optimized={isOptimized}
          progress={progress}
          optLevel={optimizationLevel}
          selectedNode={selectedNode}
          onNodeClick={(idx) => setSelectedNode(selectedNode === idx ? null : idx)}
        />

        {isRunning && (
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        )}

        <div className={`viz-overlay ${statusClass}`}>{getVizLabel()}</div>
      </div>

      {/* コントロールパネル */}
      <div className="control-panel">
        <div className="control-sliders">
          <div className="control-group">
            <label className="control-label">
              最適化レベル
              <span className="control-value">{optimizationLevel}%</span>
            </label>
            <input
              type="range" min="10" max="100" value={optimizationLevel}
              onChange={(e) => { setOptimizationLevel(Number(e.target.value)); setIsOptimized(false); }}
              className="control-slider"
              disabled={isRunning}
            />
          </div>
          <div className="control-group">
            <label className="control-label">
              データ件数
              <span className="control-value">{dataSize.toLocaleString()}件</span>
            </label>
            <input
              type="range" min="1000" max="10000" step="500" value={dataSize}
              onChange={(e) => { setDataSize(Number(e.target.value)); setIsOptimized(false); }}
              className="control-slider"
              disabled={isRunning}
            />
          </div>
        </div>

        <div className="control-actions">
          <div className="toggle-group">
            <button
              className={`toggle-btn ${useQuantum ? 'active' : ''}`}
              onClick={() => { setUseQuantum(true); setIsOptimized(false); }}
              disabled={isRunning}
            >
              量子
            </button>
            <button
              className={`toggle-btn ${!useQuantum ? 'active' : ''}`}
              onClick={() => { setUseQuantum(false); setIsOptimized(false); }}
              disabled={isRunning}
            >
              古典
            </button>
          </div>

          <button
            className={`run-btn ${isRunning ? 'running' : ''}`}
            onClick={handleRunSimulation}
            disabled={isRunning}
          >
            <Play size={13} />
            {isRunning ? '実行中...' : 'シミュレーション実行'}
          </button>

          <button className="reset-btn" onClick={handleReset} disabled={isRunning}>
            <RotateCcw size={13} />
            リセット
          </button>
        </div>
      </div>

      {/* KPIメトリクス */}
      <div className="metrics-grid">
        {activeUseCase.metrics.map((m, idx) => (
          <div key={idx} className={`metric-card ${statusClass} ${isOptimized ? 'metric-optimized' : ''}`}>
            <div>
              <div className="metric-label">{m.label}</div>
              <div className={`metric-value ${isOptimized ? 'metric-value-updated' : ''}`}>
                {getAdjustedValue(m.value, m.trend)}
              </div>
              {isOptimized && <div className="metric-badge">最適化済</div>}
            </div>
            <div>{getTrendIcon(m.trend, !!(isActionMode || isOptimized))}</div>
          </div>
        ))}
      </div>

      {/* インサイトパネル */}
      <div className="insights-panel">
        <div className={`insight-card impact-card ${statusClass}`}>
          <div className="card-header">
            <Target size={16} className="insight-icon" />
            <span>経営インパクト (Business Impact)</span>
          </div>
          <div className="card-body impact-text">{activeUseCase.businessImpact}</div>
        </div>

        <div className={`insight-card qvc-card ${statusClass}`}>
          <div className="card-header">
            <Zap size={16} className="insight-icon" />
            <span>量子 vs 古典 ― 規模別比較</span>
          </div>
          <div className="card-body">
            {(() => {
              const cSec = parseToSeconds(activeUseCase.quantumVsClassical.classicalTime);
              const qSec = parseToSeconds(activeUseCase.quantumVsClassical.quantumTime);
              const scales = [
                {
                  label: '小規模',
                  sublabel: '〜1,000件',
                  cMult: 0.04,
                  qMult: 0.18,
                  classicalComment: '古典計算でも許容範囲内',
                  quantumComment: '量子優位性は限定的・コスト対効果を要検討',
                  verdict: '古典で対応可能',
                  verdictClass: 'verdict-neutral',
                },
                {
                  label: '中規模',
                  sublabel: '1,000〜10,000件',
                  cMult: 1.0,
                  qMult: 1.0,
                  classicalComment: '処理時間が長くなり業務効率への影響が顕在化',
                  quantumComment: '量子優位性が明確に現れ始める規模',
                  verdict: '量子優位性が顕在化',
                  verdictClass: 'verdict-quantum',
                },
                {
                  label: '大規模',
                  sublabel: '10,000件超',
                  cMult: 16.0,
                  qMult: 3.5,
                  classicalComment: '実用的な時間内での処理はほぼ不可能',
                  quantumComment: '量子処理が事実上の必須要件',
                  verdict: '量子処理が必須',
                  verdictClass: 'verdict-critical',
                },
              ];
              return (
                <div className="qvc-scales">
                  {scales.map((s) => {
                    const cTime = cSec != null ? fmtTime(cSec * s.cMult) : activeUseCase.quantumVsClassical.classicalTime;
                    const qTime = qSec != null ? fmtTime(qSec * s.qMult) : activeUseCase.quantumVsClassical.quantumTime;
                    const ratio = (cSec != null && qSec != null && qSec * s.qMult > 0)
                      ? Math.round((cSec * s.cMult) / (qSec * s.qMult))
                      : null;
                    return (
                      <div key={s.label} className="qvc-scale-block">
                        <div className="qvc-scale-header">
                          <span className="qvc-scale-label">{s.label}</span>
                          <span className="qvc-scale-sublabel">{s.sublabel}</span>
                          <span className={`qvc-verdict ${s.verdictClass}`}>{s.verdict}</span>
                        </div>
                        <div className="qvc-scale-rows">
                          <div className="qvc-scale-row">
                            <span className="qvc-scale-type classical-type">古典</span>
                            <span className="qvc-time classical-time">{cTime}</span>
                            <span className="qvc-scale-comment">{s.classicalComment}</span>
                          </div>
                          <div className="qvc-scale-row">
                            <span className="qvc-scale-type quantum-type">量子</span>
                            <span className="qvc-time quantum-time">{qTime}</span>
                            <span className="qvc-scale-comment">{s.quantumComment}</span>
                          </div>
                          {ratio != null && ratio > 1 && (
                            <div className="qvc-speedup">
                              量子が <strong>{ratio.toLocaleString()}倍</strong> 高速
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  <div className="advantage-text" style={{ marginTop: '8px' }}>
                    {activeUseCase.quantumVsClassical.advantage}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>

        <div className={`insight-card verify-card ${statusClass}`}>
          <div className="card-header">
            <ShieldCheck size={16} className="insight-icon" />
            <span>検証・信頼性サマリー (Safety & Compliance)</span>
          </div>
          <div className="card-body verify-text">{activeUseCase.verificationSummary}</div>
        </div>
      </div>
    </div>
  );
};

export default LivePreview;
