/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, {Suspense, lazy, useMemo} from 'react';
import {useUiStore} from '@/store/uiStore';

const LandingPage = lazy(() =>
  import('@/pages/public/Landing').then((m) => ({default: m.LandingPage})),
);
const DashboardPage = lazy(() =>
  import('@/pages/app/Dashboard').then((m) => ({default: m.DashboardPage})),
);
const ViewerPage = lazy(() => import('@/pages/app/Viewer').then((m) => ({default: m.ViewerPage})));

function PageFallback() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center text-slate-500 text-sm">로딩 중…</div>
  );
}

export default function App() {
  const page = useUiStore((s) => s.page);

  const content = useMemo(() => {
    switch (page) {
      case 'landing':
        return <LandingPage />;
      case 'dashboard':
        return <DashboardPage />;
      case 'viewer':
        return <ViewerPage />;
      default:
        return <LandingPage />;
    }
  }, [page]);

  return (
    <div className="font-sans text-slate-900">
      <Suspense fallback={<PageFallback />}>{content}</Suspense>
    </div>
  );
}
