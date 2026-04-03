import { useMemo } from 'react';
import { CalendarRange } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { getReportPeriodLabel } from '../../utils/helpers';
import CustomSelect from './CustomSelect';

function periodSelectValue(period) {
  if (period.mode === 'all') return 'all';
  return `range:${period.startMonth}:${period.endMonth}`;
}

function parseSelectValue(v) {
  if (v === 'all') return { mode: 'all' };
  const m = v.match(/^range:(\d{4}-\d{2}):(\d{4}-\d{2})$/);
  if (!m) return { mode: 'all' };
  return { mode: 'range', startMonth: m[1], endMonth: m[2] };
}

export default function PeriodSelector() {
  const { state, setReportPeriod } = useApp();
  const { transactions, reportPeriod } = state;

  const options = useMemo(() => {
    const opts = [{ value: 'all', label: 'All data' }];
    const monthSet = new Set(transactions.map((t) => t.date.substring(0, 7)));
    const months = [...monthSet].sort();
    if (months.length === 0) return opts;

    const min = months[0];
    const max = months[months.length - 1];
    opts.push({
      value: `range:${min}:${max}`,
      label: `Dataset span (${min} → ${max})`,
    });

    const addIf = (start, end, label) => {
      if (months.some((m) => m >= start && m <= end)) {
        opts.push({ value: `range:${start}:${end}`, label });
      }
    };

    addIf('2024-01', '2024-03', 'Q1 2024');
    addIf('2024-04', '2024-06', 'Q2 2024');
    addIf('2024-01', '2024-06', 'H1 2024 (Jan–Jun)');

    return opts;
  }, [transactions]);

  const currentVal = periodSelectValue(reportPeriod);
  const matched = options.some((o) => o.value === currentVal);
  const selectValue = matched ? currentVal : reportPeriod.mode === 'range' ? currentVal : 'all';

  const listOptions = useMemo(() => {
    if (!matched && reportPeriod.mode === 'range') {
      return [
        { value: currentVal, label: getReportPeriodLabel(reportPeriod) },
        ...options,
      ];
    }
    return options;
  }, [matched, reportPeriod, currentVal, options]);

  return (
    <div
      className="period-selector"
      title="Report period: dashboard, insights, transaction scope, and exports all align to this range."
    >
      <CalendarRange size={15} className="period-selector-icon" aria-hidden />
      <label id="report-period-label" htmlFor="report-period-select" className="visually-hidden">
        Report period
      </label>
      <CustomSelect
        id="report-period-select"
        ariaLabelledBy="report-period-label"
        value={selectValue}
        onChange={(v) => setReportPeriod(parseSelectValue(v))}
        options={listOptions}
        triggerClassName="period-selector-select"
      />
    </div>
  );
}
