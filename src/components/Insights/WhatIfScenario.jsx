import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { getCategoryBreakdown, formatCurrency } from '../../utils/helpers';
import { CATEGORY_ICONS } from '../../data/mockData';

export default function WhatIfScenario({ transactions }) {
  const categoryData = useMemo(() => getCategoryBreakdown(transactions), [transactions]);
  const top = categoryData[0];
  const [pct, setPct] = useState(15);

  if (!top) {
    return (
      <div className="card what-if-card animate-fade-up-3">
        <div className="chart-title" style={{ marginBottom: 8 }}>
          What-if: category trim
        </div>
        <p className="what-if-empty">Add expense data to simulate cutting your top category.</p>
      </div>
    );
  }

  const monthsCount = Math.max(
    1,
    new Set(transactions.map((t) => t.date.substring(0, 7))).size
  );

  const savedIfApplied = top.value * (pct / 100);
  const perMonthApprox = savedIfApplied / monthsCount;

  return (
    <div className="card what-if-card animate-fade-up-3">
      <div className="chart-header" style={{ marginBottom: 18 }}>
        <div>
          <div className="chart-title">
            <Sparkles size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 8 }} />
            What-if : trim top category
          </div>
          <div className="chart-subtitle">
            Slide to see rough savings if you reduce {CATEGORY_ICONS[top.name]} {top.name} spending in this
            period.
          </div>
        </div>
      </div>

      <div className="what-if-top">
        <span className="what-if-cat">
          {CATEGORY_ICONS[top.name]} {top.name}
        </span>
        <span className="what-if-amount tabular-nums">{formatCurrency(top.value)}</span>
        <span className="what-if-pct">({top.pct.toFixed(0)}% of expenses in period)</span>
      </div>

      <label className="what-if-label" htmlFor="what-if-range">
        Reduction: <strong>{pct}%</strong> of this category in the selected period
      </label>
      <input
        id="what-if-range"
        type="range"
        min={0}
        max={50}
        step={1}
        value={pct}
        onChange={(e) => setPct(Number(e.target.value))}
        className="what-if-slider"
      />

      <div className="what-if-results">
        <div>
          <div className="what-if-result-label">Freed in period (approx.)</div>
          <div className="what-if-result-value tabular-nums">{formatCurrency(savedIfApplied)}</div>
        </div>
        <div>
          <div className="what-if-result-label">Per month (spread over {monthsCount} mo. in period)</div>
          <div className="what-if-result-value tabular-nums">{formatCurrency(perMonthApprox)}</div>
        </div>
      </div>
      <p className="what-if-footnote">
        Illustrative only — assumes savings scale linearly with the slider. Real budgets have fixed costs
        and behavior change.
      </p>
    </div>
  );
}
