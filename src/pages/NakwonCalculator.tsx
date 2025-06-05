import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

// 타입 정의
interface InputCardProps {
  label: string;
  unit: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  step?: number;
}
interface InputSectionProps {
  retireMonthlySpending: string;
  setRetireMonthlySpending: (v: string) => void;
  retirePeriodYears: string;
  setRetirePeriodYears: (v: string) => void;
  currentAssets: string;
  setCurrentAssets: (v: string) => void;
  monthlySavings: string;
  setMonthlySavings: (v: string) => void;
  annualInterestRate: string;
  setAnnualInterestRate: (v: string) => void;
}
interface ButtonProps {
  text: string;
  onClick: () => void;
  primary?: boolean;
  fullWidth?: boolean;
}
interface ErrorMessageProps {
  message: string;
}
interface ResultsSectionProps {
  years: number;
  months: number;
  neededAsset: number;
  currentAssets: string;
  monthlySavings: string;
  annualInterestRate: string;
}

interface CalcValues {
  retireMonthlySpending: string;
  retirePeriodYears: string;
  currentAssets: string;
  monthlySavings: string;
  annualInterestRate: string;
}

// HeaderComponent
const HeaderComponent = () => (
  <div className="text-center">
    <h1 className="text-3xl md:text-4xl font-bold text-indigo-700 mb-2">
      나의 낙원, 언제쯤 도착할까요?
    </h1>
    <p className="text-gray-600 text-sm md:text-base">
      목표를 설정하고 경제적 자유까지의 여정을 계획해보세요.
    </p>
  </div>
);

// InputCardComponent
const InputCardComponent = ({ label, unit, value, onChange, placeholder, icon, step }: InputCardProps) => (
  <div className="bg-slate-100 p-4 rounded-lg shadow flex flex-col">
    <label className="block text-sm font-medium text-gray-700 mb-1 flex items-center gap-1">
      {icon}
      {label}
    </label>
    <div className="flex items-center gap-2">
      <input
        type="number"
        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 focus:border-indigo-500 focus:shadow-lg transition-all duration-300 text-right bg-white"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={0}
        step={step}
        inputMode="numeric"
      />
      <span className="text-sm text-gray-500 whitespace-nowrap">{unit}</span>
    </div>
  </div>
);

// InputSectionComponent
const InputSectionComponent = ({
  retireMonthlySpending, setRetireMonthlySpending,
  retirePeriodYears, setRetirePeriodYears,
  currentAssets, setCurrentAssets,
  monthlySavings, setMonthlySavings,
  annualInterestRate, setAnnualInterestRate
}: InputSectionProps) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <InputCardComponent
      label="은퇴 후 월 소비액"
      unit="만원"
      value={retireMonthlySpending}
      onChange={e => setRetireMonthlySpending(e.target.value)}
      placeholder="50"
      icon={<span role="img" aria-label="소비">🛒</span>}
      step={50}
    />
    <InputCardComponent
      label="은퇴 후 예상 기간"
      unit="년"
      value={retirePeriodYears}
      onChange={e => setRetirePeriodYears(e.target.value)}
      placeholder="5"
      icon={<span role="img" aria-label="기간">⏳</span>}
      step={5}
    />
    <InputCardComponent
      label="현재 자산"
      unit="만원"
      value={currentAssets}
      onChange={e => setCurrentAssets(e.target.value)}
      placeholder="100"
      icon={<span role="img" aria-label="자산">💰</span>}
      step={100}
    />
    <InputCardComponent
      label="월 저축액"
      unit="만원"
      value={monthlySavings}
      onChange={e => setMonthlySavings(e.target.value)}
      placeholder="10"
      icon={<span role="img" aria-label="저축">💸</span>}
      step={10}
    />
    <InputCardComponent
      label="연 예상 수익률"
      unit="%"
      value={annualInterestRate}
      onChange={e => setAnnualInterestRate(e.target.value)}
      placeholder="5"
      icon={<span role="img" aria-label="수익률">📈</span>}
      step={1}
    />
  </div>
);

// ButtonComponent
const ButtonComponent = ({ text, onClick, primary, fullWidth }: ButtonProps) => (
  <button
    type="button"
    onClick={onClick}
    className={`py-2.5 px-5 rounded-lg font-semibold transition-all duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2
      ${primary
        ? 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500 hover:scale-105 active:scale-95'
        : 'bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400'}
      ${fullWidth ? 'w-full' : ''}`}
  >
    {text}
  </button>
);

// LoadingSpinnerComponent
const LoadingSpinnerComponent = () => (
  <div className="flex justify-center items-center py-4">
    <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-500"></div>
    <p className="ml-3 text-indigo-600">계산 중입니다...</p>
  </div>
);

// ErrorMessageComponent
const ErrorMessageComponent = ({ message }: ErrorMessageProps) => (
  <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
    <p>{message}</p>
  </div>
);

// 자산 성장 시뮬레이션 함수
function getGrowthData({
  currentAssets,
  monthlySavings,
  annualInterestRate,
  neededAsset
}: {
  currentAssets: number;
  monthlySavings: number;
  annualInterestRate: number;
  neededAsset: number;
}) {
  const data = [];
  let asset = currentAssets;
  const r_monthly = annualInterestRate > 0 ? Math.pow(1 + annualInterestRate / 100, 1 / 12) - 1 : 0;
  let month = 0;
  const maxMonths = 1200; // 100년 cap
  while (asset < neededAsset && month < maxMonths) {
    data.push({
      month,
      year: Math.floor(month / 12),
      asset: Math.floor(asset / 10000),
    });
    asset = asset * (1 + r_monthly) + monthlySavings;
    month++;
  }
  // 마지막 달(목표 달성)도 추가
  data.push({
    month,
    year: Math.floor(month / 12),
    asset: Math.floor(asset / 10000),
  });
  return data;
}

// ResultsSectionComponent
const ResultsSectionComponent = ({ years, months, neededAsset, currentAssets, monthlySavings, annualInterestRate }: ResultsSectionProps) => {
  const [displayYears, setDisplayYears] = useState(0);
  const [displayMonths, setDisplayMonths] = useState(0);
  // progressive rendering용 상태
  const [animatedData, setAnimatedData] = useState<{month:number, year:number, asset:number|null}[]>([]);
  const [popDot, setPopDot] = useState(0); // 0: 없음, 1: 팝(크게), 2: 작게(최종)

  // 전체 데이터 생성
  const growthData = getGrowthData({
    currentAssets: parseFloat(currentAssets) * 10000,
    monthlySavings: parseFloat(monthlySavings) * 10000,
    annualInterestRate: parseFloat(annualInterestRate),
    neededAsset: neededAsset,
  });

  // 숫자 카운트 애니메이션
  React.useEffect(() => {
    let y = 0, m = 0;
    const yTarget = years || 0;
    const mTarget = months || 0;
    const yStep = yTarget > 0 ? Math.max(1, Math.floor(yTarget / 20)) : 1;
    const mStep = mTarget > 0 ? Math.max(1, Math.floor(mTarget / 10)) : 1;
    let yInterval = setInterval(() => {
      y += yStep;
      if (y >= yTarget) {
        y = yTarget;
        clearInterval(yInterval);
      }
      setDisplayYears(y);
    }, 20);
    let mInterval = setInterval(() => {
      m += mStep;
      if (m >= mTarget) {
        m = mTarget;
        clearInterval(mInterval);
      }
      setDisplayMonths(m);
    }, 30);
    return () => {
      clearInterval(yInterval);
      clearInterval(mInterval);
    };
  }, [years, months]);

  // progressive rendering: 한 점씩 추가 (월 단위, 선이 이어지듯이)
  useEffect(() => {
    setAnimatedData([]);
    setPopDot(0);
    if (!growthData || growthData.length === 0) return;
    let i = 0;
    const total = growthData.length;
    let interval: NodeJS.Timeout;
    const start = () => {
      interval = setInterval(() => {
        setAnimatedData(
          growthData.map((d, idx) =>
            idx <= i ? d : { ...d, asset: null }
          )
        );
        i++;
        if (i >= total) {
          clearInterval(interval);
          setTimeout(() => setPopDot(1), 100); // 0.1초 후 팝 효과(1단계)
        }
      }, 7);
    };
    const timeout = setTimeout(start, 300);
    return () => {
      clearTimeout(timeout);
      clearInterval(interval);
    };
  }, [JSON.stringify(growthData)]);

  // 팝 애니메이션 단계별로 r값/transition 다르게
  useEffect(() => {
    if (popDot === 1) {
      // 커지자마자 바로 줄어듦 (10ms 딜레이)
      const t = setTimeout(() => setPopDot(2), 10);
      return () => clearTimeout(t);
    }
  }, [popDot]);

  // 마지막 점 커스텀 dot 렌더러
  const renderDot = (props: any) => {
    const { cx, cy, index } = props;
    if (popDot === 0) return <g />;
    if (index !== animatedData.length - 1) return <g />;
    let r = 6, transition = '';
    if (popDot === 1) { r = 14; transition = 'r 0.5s cubic-bezier(0.42,0,1,1)'; }
    if (popDot === 2) { r = 8; transition = 'r 0.2s cubic-bezier(0.22,0.61,0.36,1)'; }
    return (
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="#6366f1"
        stroke="#fff"
        strokeWidth={3}
        style={{
          transition,
          filter: 'drop-shadow(0 2px 8px #6366f155)',
        }}
      />
    );
  };

  return (
    <div className="mt-8 p-6 bg-indigo-50 rounded-lg shadow-lg text-center animate-fadeInUp">
      <h2 className="text-2xl font-bold text-indigo-700 mb-4">🎉 축하합니다! 🎉</h2>
      <p className="text-xl text-gray-800 mb-2">
        <span className="font-semibold text-indigo-600">{displayYears}</span>년
        <span className="font-semibold text-indigo-600 ml-1">{displayMonths}</span>개월 후,
      </p>
      <p className="text-xl text-gray-800">목표를 달성할 수 있어요!</p>
      <p className="text-lg text-gray-700 mt-4">은퇴를 위해 필요한 자산: <span className="font-bold text-indigo-600">{(neededAsset/10000).toLocaleString()} 만원</span></p>
      <div className="mt-4">
        <div className="w-full h-64 bg-white rounded-lg shadow flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={animatedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                ticks={animatedData.filter((d, i) => d.month % 12 === 0).map(d => d.month)}
                tickFormatter={m => `${Math.floor(m / 12)}년`}
                interval={0}
                allowDecimals={false}
              />
              <YAxis domain={[0, Math.max(...growthData.map(d => d.asset))]} tickFormatter={v => `${v.toLocaleString()} 만원`} />
              <Tooltip formatter={v => `${v?.toLocaleString()} 만원`} labelFormatter={l => {
                const d = animatedData[l];
                if (!d) return '0년 0개월';
                return `${d.year}년 ${d.month % 12}개월`;
              }} />
              <Line
                type="monotone"
                dataKey="asset"
                stroke="#6366f1"
                strokeWidth={3}
                dot={renderDot}
                isAnimationActive={false}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="text-sm text-gray-500 mt-2">자산 성장 그래프</div>
      </div>
    </div>
  );
};

// 메인 ParadiseCalculator 컴포넌트
const NakwonCalculator: React.FC = () => {
  // 입력값 상태
  const [retireMonthlySpending, setRetireMonthlySpending] = useState('');
  const [retirePeriodYears, setRetirePeriodYears] = useState('');
  const [currentAssets, setCurrentAssets] = useState('');
  const [monthlySavings, setMonthlySavings] = useState('');
  const [annualInterestRate, setAnnualInterestRate] = useState('');
  // 계산/그래프용 상태
  const [calcValues, setCalcValues] = useState<CalcValues|null>(null);
  const [resultPeriodYears, setResultPeriodYears] = useState<number|null>(null);
  const [resultPeriodMonths, setResultPeriodMonths] = useState<number|null>(null);
  const [neededAsset, setNeededAsset] = useState<number|null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const resultRef = useRef<HTMLDivElement>(null);

  // 결과/그래프가 렌더링될 때 스크롤
  React.useEffect(() => {
    if (calcValues && resultPeriodYears !== null && resultPeriodMonths !== null && !isLoading && !error && neededAsset !== null) {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [calcValues, resultPeriodYears, resultPeriodMonths, isLoading, error, neededAsset]);

  // 입력값 변경 핸들러
  const handleInputChange = (setter: (v: string) => void, value: string) => {
    setter(value);
    setError('');
  };

  // 필요한 자산(목표금액) 계산 (연수익률 반영)
  const getNeededAsset = () => {
    const retireSpend = parseFloat(retireMonthlySpending) * 10000;
    const retireYears = parseFloat(retirePeriodYears);
    const r_annual_percent = parseFloat(annualInterestRate);
    const r = r_annual_percent / 100;
    if (isNaN(retireSpend) || isNaN(retireYears) || isNaN(r)) return 0;
    if (r === 0) {
      return retireSpend * 12 * retireYears;
    }
    // 연금수지 공식: PV = PMT × [1 - (1 + r)^-n] / r
    const n = retireYears;
    return retireSpend * 12 * (1 - Math.pow(1 + r, -n)) / r;
  };

  // 입력값 검증
  const validateInputs = () => {
    const pv = parseFloat(currentAssets) * 10000;
    const pmt = parseFloat(monthlySavings) * 10000;
    const retireSpend = parseFloat(retireMonthlySpending) * 10000;
    const retireYears = parseFloat(retirePeriodYears);
    const r_annual_percent = parseFloat(annualInterestRate);
    if ([pv, pmt, retireSpend, retireYears, r_annual_percent].some(v => isNaN(v) || v < 0)) {
      return '모든 입력값은 0 이상의 숫자여야 합니다.';
    }
    if (retireSpend === 0 || retireYears === 0) return '은퇴 후 월 소비액과 기간을 입력하세요.';
    return '';
  };

  // 계산 함수
  const calculateResult = async (customMonthlySavings?: number, customAnnualInterestRate?: number) => {
    setIsLoading(true);
    setError('');
    setResultPeriodYears(null);
    setResultPeriodMonths(null);
    setNeededAsset(null);
    // 입력값을 계산용 상태로 복사
    const newCalcValues: CalcValues = {
      retireMonthlySpending,
      retirePeriodYears,
      currentAssets,
      monthlySavings,
      annualInterestRate,
    };
    setCalcValues(newCalcValues);
    await new Promise(res => setTimeout(res, 500));
    // 아래는 기존 계산 로직(입력값 사용)
    const pv = parseFloat(newCalcValues.currentAssets) * 10000;
    const pmt = customMonthlySavings !== undefined ? Number(customMonthlySavings) * 10000 : parseFloat(newCalcValues.monthlySavings) * 10000;
    const retireSpend = parseFloat(newCalcValues.retireMonthlySpending) * 10000;
    const retireYears = parseFloat(newCalcValues.retirePeriodYears);
    const r_annual_percent = customAnnualInterestRate !== undefined ? Number(customAnnualInterestRate) : parseFloat(newCalcValues.annualInterestRate);
    const r = r_annual_percent / 100;
    // getNeededAsset도 newCalcValues 기반으로 계산
    const needed = (() => {
      if (isNaN(retireSpend) || isNaN(retireYears) || isNaN(r)) return 0;
      if (r === 0) {
        return retireSpend * 12 * retireYears;
      }
      const n = retireYears;
      return retireSpend * 12 * (1 - Math.pow(1 + r, -n)) / r;
    })();
    setNeededAsset(needed);
    // validateInputs도 newCalcValues 기반
    const validationError = (() => {
      if ([pv, pmt, retireSpend, retireYears, r_annual_percent].some(v => isNaN(v) || v < 0)) {
        return '모든 입력값은 0 이상의 숫자여야 합니다.';
      }
      if (retireSpend === 0 || retireYears === 0) return '은퇴 후 월 소비액과 기간을 입력하세요.';
      return '';
    })();
    if (validationError) {
      setError(validationError);
      setIsLoading(false);
      return;
    }
    if (needed <= pv) {
      setResultPeriodYears(0);
      setResultPeriodMonths(0);
      setIsLoading(false);
      return;
    }
    let r_monthly = 0;
    if (r_annual_percent > 0) {
      r_monthly = Math.pow(1 + r_annual_percent / 100, 1 / 12) - 1;
    }
    let N = 0;
    if (r_monthly === 0) {
      if (pmt === 0 && needed > pv) {
        setError('저축액과 수익률이 모두 0이면 목표 달성이 불가능합니다.');
        setIsLoading(false);
        return;
      } else if (pmt === 0 && needed <= pv) {
        N = 0;
      } else {
        N = (needed - pv) / pmt;
      }
    } else {
      if (pmt === 0) {
        if (pv <= 0) {
          setError('초기 자산이 0이고 저축액이 없으면 목표 달성이 불가능합니다.');
          setIsLoading(false);
          return;
        }
        N = Math.log(needed / pv) / Math.log(1 + r_monthly);
      } else {
        const numerator = Math.log((needed * r_monthly + pmt) / (pv * r_monthly + pmt));
        const denominator = Math.log(1 + r_monthly);
        if (denominator === 0 || isNaN(numerator) || isNaN(denominator) || (pv * r_monthly + pmt) <= 0 || (needed * r_monthly + pmt) <= 0) {
          setError('입력값으로는 목표 달성이 불가능합니다.');
          setIsLoading(false);
          return;
        }
        N = numerator / denominator;
      }
    }
    if (isNaN(N) || N < 0) {
      setError('입력값으로는 목표 달성이 불가능합니다.');
      setIsLoading(false);
      return;
    }
    let totalMonths = Math.ceil(N);
    if (totalMonths > 1200) {
      setError('100년 이상 소요됩니다. 목표를 조정해보세요.');
      setIsLoading(false);
      return;
    }
    setResultPeriodYears(Math.floor(totalMonths / 12));
    setResultPeriodMonths(totalMonths % 12);
    setIsLoading(false);
  };

  // 초기화 함수
  const resetCalculator = () => {
    setRetireMonthlySpending('');
    setRetirePeriodYears('');
    setCurrentAssets('');
    setMonthlySavings('');
    setAnnualInterestRate('');
    setResultPeriodYears(null);
    setResultPeriodMonths(null);
    setNeededAsset(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 font-['Pretendard'] flex flex-col items-center py-10">
      <div className="w-full max-w-xl p-6 bg-white rounded-xl shadow-2xl space-y-8">
        <HeaderComponent />
        <InputSectionComponent
          retireMonthlySpending={retireMonthlySpending}
          setRetireMonthlySpending={v => handleInputChange(setRetireMonthlySpending, v)}
          retirePeriodYears={retirePeriodYears}
          setRetirePeriodYears={v => handleInputChange(setRetirePeriodYears, v)}
          currentAssets={currentAssets}
          setCurrentAssets={v => handleInputChange(setCurrentAssets, v)}
          monthlySavings={monthlySavings}
          setMonthlySavings={v => handleInputChange(setMonthlySavings, v)}
          annualInterestRate={annualInterestRate}
          setAnnualInterestRate={v => handleInputChange(setAnnualInterestRate, v)}
        />
        <div className="flex space-x-4">
          <ButtonComponent text="결과 보기" onClick={() => calculateResult()} primary fullWidth />
          <ButtonComponent text="초기화" onClick={resetCalculator} fullWidth />
        </div>
        {isLoading && <LoadingSpinnerComponent />}
        {error && <ErrorMessageComponent message={error} />}
        {calcValues && resultPeriodYears !== null && resultPeriodMonths !== null && !isLoading && !error && neededAsset !== null && (
          <div ref={resultRef}>
            <ResultsSectionComponent
              years={resultPeriodYears}
              months={resultPeriodMonths}
              neededAsset={neededAsset}
              currentAssets={calcValues.currentAssets}
              monthlySavings={calcValues.monthlySavings}
              annualInterestRate={calcValues.annualInterestRate}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default NakwonCalculator; 