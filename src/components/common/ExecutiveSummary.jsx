import { Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { buildExecutiveBullets, getReportPeriodLabel } from '../../utils/helpers';

export default function ExecutiveSummary() {
  const { scopedTransactions, state } = useApp();
  const bullets = buildExecutiveBullets(scopedTransactions);
  const periodLabel = getReportPeriodLabel(state.reportPeriod);

  return (
    <div className="executive-summary card animate-fade-up-1" role="region" aria-label="Executive summary">
      <div className="executive-summary-head">
        <div className="executive-summary-icon-wrap" aria-hidden>
          <Sparkles size={18} />
        </div>
        <div>
          <div className="executive-summary-title">Executive summary</div>
          <div className="executive-summary-period">Period: {periodLabel}</div>
        </div>
      </div>
      <ul className="executive-summary-list">
        {bullets.map((text, i) => (
          <li key={i} className="executive-summary-item">
            <span className="executive-summary-bullet" aria-hidden />
            {text}
          </li>
        ))}
      </ul>
    </div>
  );
}
