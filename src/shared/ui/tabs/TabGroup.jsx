import { useRef, useState } from 'react';
import Tab from './Tab';

export default function TabGroup({ tabGroup }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [focusIndex, setFocusIndex] = useState(0);
  const tabRefs = useRef([]);

  const handleKeyDown = (e, index) => {
    const length = tabGroup.length;

    if (e.key === 'ArrowRight') {
      const nextIndex = (index + 1) % length;
      setFocusIndex(nextIndex);
      tabRefs.current[nextIndex].focus();
      e.preventDefault();
    }

    if (e.key === 'ArrowLeft') {
      const prevIndex = (index - 1 + length) % length;
      setFocusIndex(prevIndex);
      tabRefs.current[prevIndex].focus();
      e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      setActiveIndex(index);
      e.preventDefault();
    }
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
        {tabGroup[activeIndex].content}
      </div>
    </div>
  );
}
