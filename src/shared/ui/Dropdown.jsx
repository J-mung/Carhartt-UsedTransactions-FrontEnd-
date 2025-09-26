import { useEffect, useRef, useState } from 'react';

export default function Dropdown({
  options = [],
  placeholder = '선택하세요.',
  onChange = () => {},
  size = '--s',
  icon = 'ic-right--xs',
  disabled = false,
  maxVisibleOptions = 5,
}) {
  if (Array.isArray(options)) {
    // key가 없는 옵션 체크
    const unhandleKey = options.filter(
      (_option) => !_option.hasOwnProperty('key')
    );

    if (unhandleKey.length !== 0) {
      return null;
    }

    // 중복 key 체크
    const seen = new Set();
    const duplicate = options.filter((_option) => {
      if (seen.has(_option.key)) return true;
      seen.add(_option.key);
      return false;
    });

    if (duplicate.length !== 0) {
      return null;
    }
  }

  const safeOptions = Array.isArray(options) ? options : [];
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const optionsRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [currentValue, setCurrentValue] = useState(safeOptions[0]?.value ?? '');

  // 사이즈별 옵션 행 높이(px)
  const OPTION_HEIGHT = {
    '--s': 24,
    '': 32,
    '--l': 38,
  };
  const optionHeight = OPTION_HEIGHT[size] ?? 32;

  // disabled가 true로 바뀌면 강제 닫기
  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  const toggle = () => {
    if (disabled) return;
    setOpen((prev) => !prev);
  };
  const close = () => setOpen(false);

  const handleSelect = (value) => {
    if (disabled) return;
    setCurrentValue(value);
    onChange?.(value);
    close();
  };

  // Dropdown 박스 바깥을 클릭 시, 옵션이 닫힘
  useEffect(() => {
    function handleClickOutside(event) {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        close();
      }
    }

    document.addEventListener('pointerdown', handleClickOutside);
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [rootRef]);

  // option 중 가장 긴 텍스트 기준으로 width 고정
  useEffect(() => {
    if (!safeOptions.length || !triggerRef.current || !optionsRef.current)
      return;

    // 임시 span으로 실제 렌더링 폭 계산
    const tempSpan = document.createElement('span');
    tempSpan.style.visibility = 'hidden';
    tempSpan.style.position = 'absolute';
    tempSpan.style.whiteSpace = 'nowrap';
    // 동일한 폰트 스타일 적용
    tempSpan.className = 'h5-regular';
    document.body.appendChild(tempSpan);

    let maxWidth = 0;
    safeOptions.forEach((item) => {
      tempSpan.textContent = item.value;
      maxWidth = Math.max(maxWidth, tempSpan.offsetWidth);
    });

    document.body.removeChild(tempSpan);

    // padding + 아이콘 여유분 추가
    const finalWidth = maxWidth + 32;
    triggerRef.current.style.width = `${finalWidth}px`;
    optionsRef.current.style.width = `${finalWidth}px`;
  }, [safeOptions]);

  // ESC로 닫기, Enter/Space로 열기 — disabled 방어 추가
  const handleKeyDown = (event) => {
    if (disabled) return;
    if (event.key === 'Escape') close();
    if ((event.key === 'Enter' || event.key === ' ') && !open) {
      event.preventDefault();
      setOpen(true);
    }
  };

  const triggerClassName = `dropdown__trigger${size} ${disabled ? 'disabled' : ''}`;
  const labelClassName = `dropdown__label text-regular`;

  const isScrollable = safeOptions.length > maxVisibleOptions;

  return (
    <div
      className={'dropdown'}
      data-open={open}
      ref={rootRef}
      onKeyDown={handleKeyDown}
    >
      <div
        className={triggerClassName}
        onClick={disabled ? undefined : toggle}
        tabIndex={disabled ? -1 : 0}
      >
        <span className={labelClassName}>{currentValue || placeholder}</span>
        <span className={icon}></span>
      </div>
      <ul
        className={'dropdown__options'}
        role={'listbox'}
        data-open={open}
        data-scrollable={isScrollable ? 'true' : undefined}
        style={{
          '--row-h': `${optionHeight}px`,
          '--max-visible': maxVisibleOptions,
        }}
      >
        {safeOptions.map((item, idx) => (
          <li
            className={`dropdown__option text-regular ${item.value === currentValue ? 'selected' : ''}`}
            role={'option'}
            key={item.key ?? `${item.value}-${idx}`}
            onClick={() => handleSelect(item.value)}
          >
            {item.value}
          </li>
        ))}
      </ul>
    </div>
  );
}
