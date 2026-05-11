import React from 'react';

export type VizType =
  | 'demand' | 'recipe' | 'coldchain' | 'factoryline' | 'haccp'
  | 'foodloss' | 'nutrition' | 'blend' | 'warehouse' | 'procurement'
  | 'inspection' | 'allergen' | 'traceability' | 'pbdev' | 'delivery'
  | 'packaging' | 'fermentation' | 'pesticide' | 'marketing' | 'brewing'
  | 'safetyrisk';

export const VIZ_MAP: Record<string, VizType> = {
  'demand-forecast': 'demand',
  'recipe-optimization': 'recipe',
  'supply-chain-freshness': 'coldchain',
  'factory-line': 'factoryline',
  'haccp': 'haccp',
  'food-loss': 'foodloss',
  'nutrition-meal': 'nutrition',
  'beverage-blending': 'blend',
  'warehouse-temperature': 'warehouse',
  'raw-material': 'procurement',
  'quality-inspection': 'inspection',
  'allergen': 'allergen',
  'traceability': 'traceability',
  'pb-product': 'pbdev',
  'delivery-route': 'delivery',
  'packaging': 'packaging',
  'fermentation': 'fermentation',
  'pesticide': 'pesticide',
  'food-marketing': 'marketing',
  'brewing': 'brewing',
  'food-safety': 'safetyrisk',
};

export function getVizType(id: string): VizType {
  for (const [key, val] of Object.entries(VIZ_MAP)) {
    if (id.includes(key)) return val;
  }
  return 'demand';
}

const C1 = '#F97316';
const C2 = '#FDBA74';
const BG = '#0a1628';
const TX = '#f8f9fa';
const MU = '#8e9aaf';

export interface VizProps {
  running: boolean;
  optimized: boolean;
  progress: number;
  optLevel: number;
  selectedNode: number | null;
  onNodeClick: (n: number | null) => void;
}

/* ============================================================
   20 individual food-themed SVG visualizations
   ============================================================ */

const DemandViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[30,70,110,150,190,230,270].map((x,i)=>{
      const h1 = 30+Math.random()*80;
      const h2 = optimized ? h1*0.85+10 : h1;
      return <g key={i}>
        <rect x={x-8} y={200-h1} width={7} height={h1} fill={MU} opacity={0.4} rx={2}/>
        <rect x={x+2} y={200-h2} width={7} height={h2} fill={optimized?C1:C2} rx={2}/>
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">需要予測ダッシュボード</text>
    {optimized && <text x="150" y="195" fill={C1} fontSize="7" textAnchor="middle">廃棄 -82.3%</text>}
  </svg>
);

const RecipeViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    <circle cx="150" cy="100" r="70" fill="none" stroke={optimized?C1:MU} strokeWidth="2" strokeDasharray={optimized?"":"4 4"}/>
    {[0,60,120,180,240,300].map((a,i)=>{
      const r = optimized ? 50+i*3 : 40;
      const x = 150+Math.cos(a*Math.PI/180)*r;
      const y = 100+Math.sin(a*Math.PI/180)*r;
      return <g key={i}>
        <circle cx={x} cy={y} r={8} fill={i%2===0?C1:C2} opacity={optimized?1:0.5}/>
        <text x={x} y={y+3} fill={BG} fontSize="6" textAnchor="middle" fontWeight="bold">{['P','F','C','V','M','Ca'][i]}</text>
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">レシピ配合最適化</text>
    {optimized && <text x="150" y="104" fill={TX} fontSize="8" textAnchor="middle">98.2%</text>}
  </svg>
);

const ColdchainViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[{x:40,y:50,t:'-25°C'},{x:150,y:40,t:'5°C'},{x:260,y:55,t:'15°C'}].map((n,i)=>(
      <g key={i}>
        <rect x={n.x-25} y={n.y-15} width={50} height={30} rx={4} fill={optimized?C1:'#1e293b'} stroke={optimized?C1:MU} strokeWidth={1.5}/>
        <text x={n.x} y={n.y+4} fill={optimized?BG:TX} fontSize="8" textAnchor="middle" fontWeight="600">{n.t}</text>
      </g>
    ))}
    <polyline points="65,50 125,45 150,40" fill="none" stroke={optimized?C2:MU} strokeWidth={1.5} strokeDasharray={optimized?"":"3 3"}/>
    <polyline points="175,40 235,50 260,55" fill="none" stroke={optimized?C2:MU} strokeWidth={1.5} strokeDasharray={optimized?"":"3 3"}/>
    {[50,100,150,200,250].map((x,i)=>(
      <rect key={i} x={x-10} y={100} width={20} height={60} rx={3} fill={optimized?C1:'#334155'} opacity={0.6+i*0.08}/>
    ))}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">コールドチェーン最適化</text>
    {optimized && <text x="150" y="185" fill={C1} fontSize="7" textAnchor="middle">鮮度ロス -67.4%</text>}
  </svg>
);

const FactoryLineViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[1,2,3,4,5,6,7,8].map(i=>{
      const y = 25*i+5;
      return <g key={i}>
        <rect x="20" y={y} width={optimized?260:180+Math.random()*60} height={16} rx={3} fill={optimized?C1:'#475569'} opacity={0.7+i*0.03}/>
        <text x="15" y={y+12} fill={MU} fontSize="7" textAnchor="end">L{i}</text>
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">生産ライン稼働状況</text>
    {optimized && <text x="275" y="18" fill={C1} fontSize="7" textAnchor="end">+34.7%</text>}
  </svg>
);

const HaccpViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {['温度','pH','水分活性','金属検出'].map((label,i)=>{
      const cx = 40+i*70; const cy = 90;
      const r = optimized ? 28 : 22;
      return <g key={i}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={optimized?C1:MU} strokeWidth={2}/>
        <circle cx={cx} cy={cy} r={r*0.6} fill={optimized?`${C1}33`:'none'}/>
        <text x={cx} y={cy+3} fill={TX} fontSize="7" textAnchor="middle">{label}</text>
        {optimized && <circle cx={cx} cy={cy-r+5} r={3} fill="#22c55e"/>}
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">HACCP CCP監視</text>
    {optimized && <text x="150" y="150" fill="#22c55e" fontSize="8" textAnchor="middle">全CCP正常</text>}
  </svg>
);

const FoodlossViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[0,1,2,3,4].map(i=>{
      const x1 = 30+i*20; const x2 = 200+i*15;
      return <g key={i}>
        <rect x={x1} y={50+i*15} width={14} height={14} rx={3} fill={C2} opacity={0.7}/>
        <line x1={x1+14} y1={57+i*15} x2={x2} y2={70+i*10} stroke={optimized?C1:MU} strokeWidth={1} strokeDasharray={optimized?"":"2 2"}/>
        <rect x={x2} y={63+i*10} width={14} height={14} rx={3} fill={optimized?C1:'#475569'}/>
      </g>;
    })}
    <text x="70" y="40" fill={MU} fontSize="7" textAnchor="middle">余剰食品</text>
    <text x="230" y="40" fill={MU} fontSize="7" textAnchor="middle">フードバンク</text>
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">食品ロス削減マッチング</text>
    {optimized && <text x="150" y="185" fill={C1} fontSize="7" textAnchor="middle">マッチング率 91.3%</text>}
  </svg>
);

const NutritionViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {['Cal','Pro','Fat','Vit','Min','Fiber'].map((n,i)=>{
      const angle = (i/6)*Math.PI*2 - Math.PI/2;
      const r = optimized ? 55 : 35+Math.random()*20;
      const x = 150+Math.cos(angle)*r;
      const y = 105+Math.sin(angle)*r;
      return <g key={i}>
        <line x1="150" y1="105" x2={x} y2={y} stroke={optimized?C1:MU} strokeWidth={1.5}/>
        <circle cx={x} cy={y} r={5} fill={optimized?C1:C2}/>
        <text x={150+Math.cos(angle)*72} y={105+Math.sin(angle)*72} fill={MU} fontSize="6" textAnchor="middle">{n}</text>
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">栄養バランス最適化</text>
    {optimized && <text x="150" y="108" fill={C1} fontSize="9" textAnchor="middle" fontWeight="bold">99.1%</text>}
  </svg>
);

const BlendViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    <path d="M100,180 L120,60 L180,60 L200,180 Z" fill="none" stroke={optimized?C1:MU} strokeWidth={2}/>
    {optimized && <>
      <rect x="125" y="100" width="50" height="80" fill={`${C1}44`} rx={2}/>
      <rect x="125" y="120" width="50" height="60" fill={`${C2}44`} rx={2}/>
      <rect x="125" y="145" width="50" height="35" fill={`${C1}66`} rx={2}/>
    </>}
    {['香り','甘み','酸味','苦味','ボディ'].map((l,i)=>(
      <g key={i}>
        <rect x={220} y={40+i*28} width={optimized?60:30+Math.random()*30} height={16} rx={3} fill={optimized?C1:MU} opacity={0.7}/>
        <text x={215} y={52+i*28} fill={MU} fontSize="6" textAnchor="end">{l}</text>
      </g>
    ))}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">飲料ブレンド最適化</text>
  </svg>
);

const WarehouseViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[0,1,2].map(zone=>{
      const colors = ['#60a5fa','#22c55e','#f59e0b'];
      const labels = ['-25°C','5°C','15°C'];
      return <g key={zone}>
        <rect x={20+zone*95} y={35} width={85} height={130} rx={4} fill="none" stroke={colors[zone]} strokeWidth={1.5} strokeDasharray={optimized?"":"3 3"}/>
        <text x={62+zone*95} y={50} fill={colors[zone]} fontSize="7" textAnchor="middle">{labels[zone]}</text>
        {[0,1,2,3].map(r=>(
          <rect key={r} x={28+zone*95} y={58+r*28} width={69} height={22} rx={2} fill={optimized?`${colors[zone]}33`:'#1e293b'} stroke={optimized?colors[zone]:'#334155'} strokeWidth={0.5}/>
        ))}
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">倉庫温度帯ゾーニング</text>
    {optimized && <text x="150" y="185" fill={C1} fontSize="7" textAnchor="middle">エネルギー -28.4%</text>}
  </svg>
);

const ProcurementViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[0,1,2,3,4].map(i=>{
      const w = optimized ? 40+i*8 : 20+Math.random()*50;
      return <g key={i}>
        <rect x="60" y={40+i*28} width={w*2.5} height={18} rx={3} fill={optimized?C1:MU} opacity={0.6+i*0.08}/>
        <text x="55" y={53+i*28} fill={MU} fontSize="6" textAnchor="end">{['小麦','砂糖','油脂','乳製品','添加物'][i]}</text>
        <text x={68+w*2.5} y={53+i*28} fill={TX} fontSize="6">{optimized?`${(8+i*2).toFixed(0)}%`:''}</text>
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">原材料調達ポートフォリオ</text>
    {optimized && <text x="150" y="190" fill={C1} fontSize="7" textAnchor="middle">リスク -38.5%</text>}
  </svg>
);

const InspectionViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    <rect x="75" y="40" width="150" height="120" rx={6} fill="#1e293b" stroke={optimized?C1:MU} strokeWidth={2}/>
    {optimized && <>
      <rect x="85" y="50" width="60" height="45" rx={3} fill={`${C1}22`} stroke={C1} strokeWidth={1}/>
      <text x="115" y="78" fill="#22c55e" fontSize="8" textAnchor="middle">OK</text>
      <rect x="155" y="50" width="60" height="45" rx={3} fill="#dc262622" stroke="#dc2626" strokeWidth={1}/>
      <text x="185" y="78" fill="#dc2626" fontSize="8" textAnchor="middle">NG</text>
      <rect x="85" y="105" width="130" height="8" rx={2} fill={`${C1}44`}/>
      <rect x="85" y="105" width="128" height="8" rx={2} fill={C1}/>
      <text x="150" y="140" fill={MU} fontSize="6" textAnchor="middle">精度 99.7% | 320個/分</text>
    </>}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">品質検査AI</text>
  </svg>
);

const AllergenViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[{x:60,y:80,l:'卵'},{x:120,y:60,l:'乳'},{x:180,y:80,l:'小麦'},{x:240,y:60,l:'そば'},{x:90,y:130,l:'落花生'},{x:150,y:140,l:'えび'},{x:210,y:130,l:'かに'}].map((n,i)=>(
      <g key={i}>
        <circle cx={n.x} cy={n.y} r={16} fill={optimized?`${C1}33`:'#1e293b'} stroke={optimized?C1:MU} strokeWidth={1.5}/>
        <text x={n.x} y={n.y+4} fill={TX} fontSize="7" textAnchor="middle">{n.l}</text>
        {optimized && i<6 && <line x1={n.x+16} y1={n.y} x2={[120,180,240,90,150,210][i]-16} y2={[60,80,60,130,140,130][i]} stroke={C2} strokeWidth={0.8} opacity={0.5}/>}
      </g>
    ))}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">アレルゲン追跡グラフ</text>
    {optimized && <text x="150" y="185" fill="#22c55e" fontSize="7" textAnchor="middle">全28品目追跡完了</text>}
  </svg>
);

const TraceabilityViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {['農場','処理','加工','配送','卸売','小売','消費者'].map((s,i)=>{
      const x = 25+i*40;
      return <g key={i}>
        <rect x={x-15} y={80} width={30} height={30} rx={4} fill={optimized?C1:'#1e293b'} stroke={optimized?C1:MU} strokeWidth={1}/>
        <text x={x} y={99} fill={optimized?BG:TX} fontSize="5" textAnchor="middle">{s}</text>
        {i<6 && <line x1={x+15} y1={95} x2={x+25} y2={95} stroke={optimized?C2:MU} strokeWidth={1.5} markerEnd="url(#arrow)"/>}
      </g>;
    })}
    <defs><marker id="arrow" viewBox="0 0 6 6" refX="5" refY="3" markerWidth="4" markerHeight="4" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill={optimized?C2:MU}/></marker></defs>
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">トレーサビリティチェーン</text>
    {optimized && <text x="150" y="140" fill={C1} fontSize="7" textAnchor="middle">量子耐性ハッシュ保護</text>}
  </svg>
);

const PbdevViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[0,1,2,3,4].map(i=>{
      const x = 30+i*55;
      return <g key={i}>
        <rect x={x} y={50} width={45} height={100} rx={6} fill={optimized && i<2 ? `${C1}33` : '#1e293b'} stroke={optimized && i<2 ? C1 : MU} strokeWidth={1.5}/>
        <text x={x+22} y={45} fill={MU} fontSize="6" textAnchor="middle">#{i+1}</text>
        <rect x={x+5} y={60} width={35} height={25} rx={3} fill={optimized?C2:'#334155'} opacity={0.5}/>
        <text x={x+22} y={105} fill={MU} fontSize="6" textAnchor="middle">¥{150+i*30}</text>
        {optimized && i<2 && <text x={x+22} y={160} fill={C1} fontSize="6" textAnchor="middle">採用</text>}
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">PB商品スクリーニング</text>
  </svg>
);

const DeliveryViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {Array.from({length:15}).map((_,i)=>{
      const x = 30+Math.random()*240;
      const y = 35+Math.random()*130;
      return <circle key={i} cx={x} cy={y} r={4} fill={optimized?C2:MU} opacity={0.6}/>;
    })}
    {optimized && <polyline points="50,60 90,120 140,80 180,140 220,70 260,130" fill="none" stroke={C1} strokeWidth={2}/>}
    {!optimized && <>
      <polyline points="50,60 140,80 90,120 260,130 180,140 220,70" fill="none" stroke={MU} strokeWidth={1} strokeDasharray="3 3"/>
    </>}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">配送ルート最適化</text>
    {optimized && <text x="150" y="190" fill={C1} fontSize="7" textAnchor="middle">コスト -32.7%</text>}
  </svg>
);

const PackagingViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {['外層','バリア層','接着層','機能層','内層'].map((l,i)=>{
      const y = 40+i*28;
      return <g key={i}>
        <rect x="60" y={y} width="180" height={20} rx={2} fill={optimized?[C1,C2,'#facc15',C2,C1][i]:'#334155'} opacity={0.6+i*0.08} stroke={optimized?C1:'none'} strokeWidth={0.5}/>
        <text x="55" y={y+14} fill={MU} fontSize="6" textAnchor="end">{l}</text>
        {optimized && <text x="250" y={y+14} fill={TX} fontSize="6">{[12,8,3,15,10][i]}μm</text>}
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">多層フィルム構造設計</text>
    {optimized && <text x="150" y="190" fill={C1} fontSize="7" textAnchor="middle">バリア +45.2% / CO2 -38.1%</text>}
  </svg>
);

const FermentationViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    <ellipse cx="150" cy="120" rx="60" ry="50" fill="none" stroke={optimized?C1:MU} strokeWidth={2}/>
    {optimized && Array.from({length:12}).map((_,i)=>(
      <circle key={i} cx={120+Math.random()*60} cy={90+Math.random()*60} r={2+Math.random()*3} fill={C2} opacity={0.6}>
        <animate attributeName="cy" values={`${90+Math.random()*60};${80+Math.random()*40};${90+Math.random()*60}`} dur={`${2+Math.random()*2}s`} repeatCount="indefinite"/>
      </circle>
    ))}
    <line x1="90" y1="70" x2="210" y2="70" stroke={MU} strokeWidth={0.5}/>
    {optimized && <polyline points="95,68 120,60 145,55 170,50 195,48 210,46" fill="none" stroke={C1} strokeWidth={1.5}/>}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">発酵プロセス制御</text>
    {optimized && <text x="150" y="190" fill={C1} fontSize="7" textAnchor="middle">品質均一性 97.8%</text>}
  </svg>
);

const PesticideViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {Array.from({length:20}).map((_,i)=>{
      const x = 30+i*13;
      const h = 20+Math.random()*100;
      return <rect key={i} x={x} y={180-h} width={8} height={h} fill={optimized && i===7 ? '#dc2626' : optimized ? C2 : MU} opacity={0.6} rx={1}/>;
    })}
    {optimized && <>
      <line x1="20" y1="60" x2="280" y2="60" stroke="#dc2626" strokeWidth={1} strokeDasharray="4 2"/>
      <text x="282" y="58" fill="#dc2626" fontSize="5">MRL</text>
      <circle cx={30+7*13+4} cy={50} r={8} fill="none" stroke="#dc2626" strokeWidth={1.5}/>
    </>}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">残留農薬スクリーニング</text>
    {optimized && <text x="150" y="195" fill={C1} fontSize="7" textAnchor="middle">500種 / 2.3秒で検査完了</text>}
  </svg>
);

const MarketingViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[{cx:80,cy:70,r:25},{cx:180,cy:60,r:20},{cx:130,cy:130,r:30},{cx:230,cy:110,r:18},{cx:60,cy:140,r:15},{cx:240,cy:50,r:12},{cx:200,cy:150,r:22},{cx:100,cy:95,r:16}].map((c,i)=>(
      <g key={i}>
        <circle cx={c.cx} cy={c.cy} r={c.r} fill={optimized?[C1,C2,'#facc15',C1,C2,'#a78bfa',C1,C2][i]:'#334155'} opacity={optimized?0.5:0.3} stroke={optimized?C1:'none'} strokeWidth={0.5}/>
        <text x={c.cx} y={c.cy+3} fill={TX} fontSize="6" textAnchor="middle">S{i+1}</text>
      </g>
    ))}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">顧客セグメント分析</text>
    {optimized && <text x="150" y="190" fill={C1} fontSize="7" textAnchor="middle">8セグメント × クーポン反応 +47.3%</text>}
  </svg>
);

const BrewingViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    <path d="M110,170 L120,50 Q150,40 180,50 L190,170 Z" fill={optimized?`${C1}33`:'#1e293b'} stroke={optimized?C1:MU} strokeWidth={2}/>
    {optimized && <rect x="123" y="80" width="54" height="90" fill={C2} opacity={0.3} rx={2}/>}
    {['麦芽','ホップ','酵母','水'].map((l,i)=>{
      const x = 220; const y = 50+i*35;
      return <g key={i}>
        <rect x={x} y={y} width={55} height={22} rx={4} fill={optimized?C1:'#334155'} opacity={0.6}/>
        <text x={x+27} y={y+15} fill={optimized?BG:TX} fontSize="7" textAnchor="middle">{l}</text>
        {optimized && <line x1={x} y1={y+11} x2={190} y2={100} stroke={C2} strokeWidth={0.5} opacity={0.4}/>}
      </g>;
    })}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">ビール醸造レシピ最適化</text>
  </svg>
);

const SafetyRiskViz: React.FC<VizProps> = ({ optimized }) => (
  <svg viewBox="0 0 300 200" style={{ width: '100%', height: '100%' }}>
    <rect width="300" height="200" fill={BG}/>
    {[{x:80,y:55,l:'気温'},{x:220,y:55,l:'湿度'},{x:80,y:135,l:'衛生'},{x:220,y:135,l:'工程'}].map((n,i)=>(
      <g key={i}>
        <rect x={n.x-30} y={n.y-15} width={60} height={30} rx={6} fill={optimized?`${C1}22`:'#1e293b'} stroke={optimized?C1:MU} strokeWidth={1.5}/>
        <text x={n.x} y={n.y+4} fill={TX} fontSize="8" textAnchor="middle">{n.l}</text>
      </g>
    ))}
    {optimized && <>
      <line x1="110" y1="55" x2="190" y2="55" stroke={C2} strokeWidth={1}/>
      <line x1="110" y1="135" x2="190" y2="135" stroke={C2} strokeWidth={1}/>
      <line x1="80" y1="70" x2="80" y2="120" stroke={C2} strokeWidth={1}/>
      <line x1="220" y1="70" x2="220" y2="120" stroke={C2} strokeWidth={1}/>
      <circle cx="150" cy="95" r={20} fill={`${C1}33`} stroke={C1} strokeWidth={2}/>
      <text x="150" y="99" fill={C1} fontSize="9" textAnchor="middle" fontWeight="bold">96.1%</text>
    </>}
    <text x="150" y="18" fill={TX} fontSize="9" textAnchor="middle" fontWeight="600">食品安全リスク予測</text>
  </svg>
);

/* ============================================================ */

const VIZ_COMPONENTS: Record<VizType, React.FC<VizProps>> = {
  demand: DemandViz,
  recipe: RecipeViz,
  coldchain: ColdchainViz,
  factoryline: FactoryLineViz,
  haccp: HaccpViz,
  foodloss: FoodlossViz,
  nutrition: NutritionViz,
  blend: BlendViz,
  warehouse: WarehouseViz,
  procurement: ProcurementViz,
  inspection: InspectionViz,
  allergen: AllergenViz,
  traceability: TraceabilityViz,
  pbdev: PbdevViz,
  delivery: DeliveryViz,
  packaging: PackagingViz,
  fermentation: FermentationViz,
  pesticide: PesticideViz,
  marketing: MarketingViz,
  brewing: BrewingViz,
  safetyrisk: SafetyRiskViz,
};

interface Props extends VizProps { vizType: VizType }

const VizCanvas: React.FC<Props> = ({ vizType, ...rest }) => {
  const Comp = VIZ_COMPONENTS[vizType] || DemandViz;
  return <Comp {...rest} />;
};

export default VizCanvas;
