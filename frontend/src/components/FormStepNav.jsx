import React from 'react';
import { Link } from 'react-router-dom';

const StepDot = ({ active, done, label }) => (
  <div className="flex items-center gap-2 min-w-0">
    <span
      className={[
        'inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0',
        done
          ? 'bg-green-600 text-white'
          : active
            ? 'bg-primary text-white'
            : 'bg-gray-200 text-gray-700',
      ].join(' ')}
      aria-label={label}
      title={label}
    >
      {done ? '✓' : '•'}
    </span>
    <span
      className={[
        'text-xs sm:text-sm truncate',
        active ? 'text-gray-900 font-semibold' : 'text-gray-600',
      ].join(' ')}
    >
      {label}
    </span>
  </div>
);

const FormStepNav = ({ currentPath, steps }) => {
  const idx = Math.max(
    0,
    steps.findIndex((s) => s.to === currentPath),
  );
  const prev = steps[idx - 1];
  const next = steps[idx + 1];

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 sm:p-5 mb-6">
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-3">
          {steps.map((s, i) => (
            <StepDot
              key={s.to}
              label={s.label}
              active={i === idx}
              done={i < idx}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:items-center sm:justify-between">
          <div className="text-sm text-gray-600">
            Step <span className="font-semibold text-gray-800">{idx + 1}</span> of{' '}
            <span className="font-semibold text-gray-800">{steps.length}</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
            {prev ? (
              <Link
                to={prev.to}
                className="w-full sm:w-auto text-center px-4 py-2.5 rounded-lg border border-gray-300 text-gray-800 bg-white hover:bg-gray-50 transition min-h-[44px]"
              >
                ← Back: {prev.shortLabel || prev.label}
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}

            {next ? (
              <Link
                to={next.to}
                className="w-full sm:w-auto text-center px-4 py-2.5 rounded-lg bg-primary text-white hover:opacity-90 transition font-semibold min-h-[44px]"
              >
                Next: {next.shortLabel || next.label} →
              </Link>
            ) : (
              <span className="hidden sm:block" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormStepNav;
