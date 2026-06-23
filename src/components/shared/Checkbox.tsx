import { Check } from 'lucide-react';
import styles from './Checkbox.module.css';

interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

export function Checkbox({ checked, onClick }: CheckboxProps) {
  return (
    <button
      className={`${styles.checkbox} ${checked ? styles.checked : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      aria-label={checked ? '标记为未完成' : '标记为完成'}
      type="button"
    >
      {checked && <Check size={14} strokeWidth={3} color="#FFFFFF" />}
    </button>
  );
}
