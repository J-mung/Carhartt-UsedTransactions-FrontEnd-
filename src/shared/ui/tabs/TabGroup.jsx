import { useRef, useState } from 'react';
import Tab from './Tab';

export default function TabGroup({ tabGroup }) {
  const firstEnabledIndex = tabGroup.findIndex((tab) => !tab.disabled);
  const [activeIndex, setActiveIndex] = useState(firstEnabledIndex);
  const [focusIndex, setFocusIndex] = useState(firstEnabledIndex); // focus 상태에서 키보드 선택 처리용 state

  const tabRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    const length = tabGroup.length;

    const findNextEnabledIndex = (start, direction) => {
      let newIndex = start;
      for (let i = 0; i < length; i++) {
        newIndex = (newIndex + direction + length) % length; // 순환 이동
        if (!tabGroup[newIndex].disabled) {
          return newIndex;
        }
      }
      return start; // 모두 disabled면 자기 자신 유지
    };

    if (e.key === 'ArrowRight') {
      const nextIndex = findNextEnabledIndex(index, +1);
      setFocusIndex(nextIndex);
      tabRefs.current[nextIndex]?.focus();
      e.preventDefault();
    }

    if (e.key === 'ArrowLeft') {
      const prevIndex = findNextEnabledIndex(index, -1);
      setFocusIndex(prevIndex);
      tabRefs.current[prevIndex]?.focus();
      e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      // Enter로 확정할 때도 disabled 예외 처리
      if (!tabGroup[index].disabled) {
        setActiveIndex(index);
      }
      e.preventDefault();
    }
  };

  const isActive = () => {
    return activeIndex > -1;
  };

  return (
    <div className="tab-group">
      <div className="tab-group__list">
        {tabGroup.map((tab, index) => (
          <Tab
            key={tab.key}
            tab={tab}
            index={index}
            isActive={index === activeIndex}
            isFocused={index === focusIndex}
            onClick={() => setActiveIndex(index)}
            onKeyDown={handleKeyDown}
            tabRef={(element) => (tabRefs.current[index] = element)}
          />
        ))}
      </div>
      <div className="tab-group__content" role="tabpanel">
        {isActive() ? (
          tabGroup[activeIndex].content
        ) : (
          <div>출력할 화면이 없습니다.</div>
        )}
      </div>
    </div>
  );
}
