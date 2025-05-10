'use client';

import dynamic from 'next/dynamic';

const SplitLayout = dynamic(() => import('@/components/layout/SplitLayout'), {
  ssr: false,
});

export default function Home() {
  return (
    <main>
      <SplitLayout />
    </main>
  );
}