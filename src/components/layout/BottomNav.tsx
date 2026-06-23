import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PenLine, Calendar, BookOpen } from 'lucide-react';
import { TAB_CONFIG } from '../../utils/constants';
import styles from './BottomNav.module.css';

const ICON_MAP: Record<string, typeof Home> = {
  home: Home,
  edit: PenLine,
  calendar: Calendar,
  book: BookOpen,
};

export function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();

  const activeIndex = TAB_CONFIG.findIndex((tab) =>
    tab.prefix === '/' ? location.pathname === '/' : location.pathname.startsWith(tab.prefix)
  );

  return (
    <nav className={styles.bottomNav}>
      {TAB_CONFIG.map((tab, index) => {
        const Icon = ICON_MAP[tab.icon];
        const isActive = index === activeIndex;
        return (
          <button
            key={tab.path}
            className={`${styles.navItem} ${isActive ? styles.active : ''}`}
            onClick={() => navigate(tab.path)}
            aria-label={tab.label}
            aria-current={isActive ? 'page' : undefined}
          >
            <div className={styles.activeIndicator} />
            <div className={styles.iconWrapper}>
              <Icon size={22} strokeWidth={2} color="var(--color-primary)" />
            </div>
            <span className={styles.label}>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
