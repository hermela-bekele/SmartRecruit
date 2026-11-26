import { isDemoMode, DEMO_CREDENTIALS } from '../utils/demoMode';
import demoStore from '../demo/demoStore';

export default function DemoBanner() {
  if (!isDemoMode()) return null;

  const handleReset = () => {
    if (window.confirm('Reset all demo data to the original seed?')) {
      demoStore.resetDemoData();
      window.location.reload();
    }
  };

  return (
    <div className="sticky top-0 z-[100] w-full bg-amber-500 text-amber-950 text-sm px-4 py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <p>
        <span className="font-semibold">Demo mode</span>
        {' — '}no backend or database. Login:{' '}
        <span className="font-mono">{DEMO_CREDENTIALS.admin.email}</span>
        {' / '}
        <span className="font-mono">{DEMO_CREDENTIALS.admin.password}</span>
      </p>
      <button
        type="button"
        onClick={handleReset}
        className="shrink-0 rounded bg-amber-950/10 px-3 py-1 font-medium hover:bg-amber-950/20"
      >
        Reset demo data
      </button>
    </div>
  );
}
