import { useState } from 'react';
import { ChevronDown, Trash2, Pencil } from 'lucide-react';
import type { QAItem } from '../../types';
import { QA_CATEGORIES } from '../../utils/constants';
import styles from './QACard.module.css';

interface QACardProps {
  item: QAItem;
  onDelete?: (id: string) => void;
  onEdit?: (id: string) => void;
}

export function QACard({ item, onDelete, onEdit }: QACardProps) {
  const [expanded, setExpanded] = useState(false);

  const categoryLabel = QA_CATEGORIES.find((c) => c.value === item.category)?.label ?? '';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete?.(item.id);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit?.(item.id);
  };

  return (
    <div
      className={`${styles.card} ${expanded ? styles.expanded : ''}`}
      onClick={() => setExpanded((v) => !v)}
      role="button"
      aria-expanded={expanded}
    >
      <div className={styles.header}>
        <span className={styles.tag}>{categoryLabel}</span>
        <span className={styles.question}>{item.question}</span>
        <span className={styles.arrow}>
          <ChevronDown
            size={18}
            strokeWidth={2}
            color={expanded ? 'var(--color-primary)' : 'var(--color-text-secondary)'}
            style={{
              transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }}
          />
        </span>
      </div>
      <div className={`${styles.answerContent} ${expanded ? styles.expandedContent : ''}`}>
        <div className={styles.answerInner}>
          <p className={styles.answerBrief}>{item.answerBrief}</p>
          <div className={styles.divider} />
          <ul className={styles.detailList}>
            {item.answerDetail.map((detail, idx) => (
              <li key={idx} className={styles.detailItem}>
                <span className={styles.bullet}>•</span>
                <span className={styles.detailText}>{detail}</span>
              </li>
            ))}
          </ul>
          <div className={styles.actionRow}>
            {onEdit && (
              <button className={styles.editBtn} onClick={handleEdit}>
                <Pencil size={14} color="var(--color-primary)" strokeWidth={2} />
                <span>编辑</span>
              </button>
            )}
            {onDelete && (
              <button className={styles.deleteBtn} onClick={handleDelete}>
                <Trash2 size={14} color="var(--color-danger)" strokeWidth={2} />
                <span>删除</span>
              </button>
            )}
          </div>
        </div>
      </div>
      {!expanded && (
        <p className={styles.preview}>{item.answerBrief}</p>
      )}
    </div>
  );
}
