import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import styles from './PageHeader.module.css';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  onBack?: () => void;
}

export function PageHeader({ title, subtitle, showBack = false, onBack }: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={styles.header}>
      {showBack && (
        <button className={styles.backBtn} onClick={handleBack} aria-label="返回">
          <ChevronLeft size={24} color="var(--color-text-primary)" />
        </button>
      )}
      <div className={styles.titleGroup}>
        <h1 className={styles.title}>{title}</h1>
        {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      </div>
    </div>
  );
}
