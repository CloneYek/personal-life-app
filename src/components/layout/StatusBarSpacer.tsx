import { memo } from 'react';
import styles from './StatusBarSpacer.module.css';

export const StatusBarSpacer = memo(function StatusBarSpacer() {
  return <div className={styles.spacer} aria-hidden="true" />;
});
