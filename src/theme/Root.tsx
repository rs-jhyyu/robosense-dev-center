import type {ReactNode} from 'react';

import AIAssistant from '@site/src/components/AIAssistant';

/**
 * Root wraps the entire app and is never unmounted on navigation, so the
 * assistant persists across page changes instead of reloading each time.
 */
export default function Root({children}: {children: ReactNode}) {
  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
}
