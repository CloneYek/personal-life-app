import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: string;
  message: string;
}

export function EmptyState({ icon, message }: EmptyStateProps) {
  return (
    <div className={styles.container}>
      {icon && <div className={styles.icon}>{icon}</div>}
      <p className={styles.message}>{message}</p>
    </div>
  );
}
