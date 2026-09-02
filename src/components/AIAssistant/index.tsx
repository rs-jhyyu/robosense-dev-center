import {useEffect, useState} from 'react';
import {translate} from '@docusaurus/Translate';

import styles from './styles.module.css';

const ASSISTANT_URL = 'https://robosense.aiforce.cloud/app/app_178u3t1kwbf';

/**
 * Floating assistant docked to the bottom-right of every page.
 *
 * The assistant runs in an iframe so the conversation happens in place and the
 * reader never loses the document they were on. The iframe is only mounted
 * after the panel is first opened, so pages that are never asked a question
 * pay nothing for it.
 */
export default function AIAssistant() {
  const [open, setOpen] = useState(false);
  // Once opened, keep the iframe mounted so the conversation survives closing
  // and reopening the panel.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (open) {
      setLoaded(true);
    }
  }, [open]);

  // Escape closes the panel, matching the usual dialog convention.
  useEffect(() => {
    if (!open) {
      return undefined;
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open]);

  const label = open
    ? translate({id: 'assistant.close', message: 'Close the AI assistant'})
    : translate({id: 'assistant.open', message: 'Ask the AI assistant'});

  return (
    <>
      <div
        className={styles.panel}
        data-open={open ? 'true' : 'false'}
        role="dialog"
        aria-label={translate({
          id: 'assistant.title',
          message: 'AI Assistant',
        })}
        aria-hidden={!open}>
        <div className={styles.panelHeader}>
          <span className={styles.panelTitle}>
            {translate({id: 'assistant.title', message: 'AI Assistant'})}
          </span>
          <div className={styles.panelActions}>
            <a
              className={styles.panelAction}
              href={ASSISTANT_URL}
              target="_blank"
              rel="noopener noreferrer"
              title={translate({
                id: 'assistant.openInNewTab',
                message: 'Open in a new tab',
              })}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
            <button
              type="button"
              className={styles.panelAction}
              onClick={() => setOpen(false)}
              title={translate({id: 'assistant.close', message: 'Close the AI assistant'})}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                strokeLinejoin="round" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>
        </div>
        {loaded && (
          <iframe
            className={styles.frame}
            src={ASSISTANT_URL}
            title={translate({id: 'assistant.title', message: 'AI Assistant'})}
            allow="microphone; clipboard-write"
          />
        )}
      </div>

      <button
        type="button"
        className={styles.launcher}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={label}
        title={label}>
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          /* Robot mark: head, eyes, antenna. */
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"
            strokeLinejoin="round" aria-hidden="true">
            <rect x="4" y="8" width="16" height="12" rx="3" />
            <path d="M12 8V4.5" />
            <circle cx="12" cy="3" r="1.4" />
            <circle cx="9" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
            <circle cx="15" cy="13.5" r="1.2" fill="currentColor" stroke="none" />
            <path d="M1.5 12.5v3M22.5 12.5v3" />
          </svg>
        )}
      </button>
    </>
  );
}
