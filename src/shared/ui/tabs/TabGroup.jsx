import React, { useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Tab from './Tab';

export default function TabGroup({ tabGroup, Layout }) {
  // 마이페이지 탭 바로 가기 (path parameter)
  const { search } = useLocation();
  const urlSearchParams = new URLSearchParams(search);
  const tabKey = Number.parseInt(urlSearchParams.get('tab'));

  const firstEnabledIndex = !!tabKey
    ? tabKey
    : tabGroup.findIndex((tab) => !tab.disabled);
  const [activeIndex, setActiveIndex] = useState(firstEnabledIndex);
  const [focusIndex, setFocusIndex] = useState(firstEnabledIndex); // focus 상태에서 키보드 선택 처리용 state

  const tabRefs = useRef([]);
  // 폴백 TabGroup
  const normalizeTabGroup = tabGroup.map((_tab) => {
    return {
      key: _tab.key,
      label: _tab.label?.toString?.() ?? 'NO_LABEL',
      content: React.isValidElement(_tab.content) ? _tab.content : noContent(),
      disabled: !!_tab.disabled,
    };
  });

  // 폴백 Content
  const noContent = () => {
    return <div>Tab의 Content를 정의하세요.</div>;
  };

  // Tab의 focus 상태 키입력 handler
  const handleKeyDown = (e, index) => {
    const length = normalizeTabGroup.length;

    const findNextEnabledIndex = (start, direction) => {
      let newIndex = start;
      for (let i = 0; i < length; i++) {
        newIndex = (newIndex + direction + length) % length; // 순환 이동
        if (!normalizeTabGroup[newIndex].disabled) {
          return newIndex;
        }
      }
      return start; // 모두 disabled면 자기 자신 유지
    };

    // focus 상태 우측 방향키 입력
    if (e.key === 'ArrowRight') {
      const nextIndex = findNextEnabledIndex(index, +1);
      setFocusIndex(nextIndex);
      tabRefs.current[nextIndex]?.focus();
      e.preventDefault();
    }

    // focus 상태 좌측 방향키 입력
    if (e.key === 'ArrowLeft') {
      const prevIndex = findNextEnabledIndex(index, -1);
      setFocusIndex(prevIndex);
      tabRefs.current[prevIndex]?.focus();
      e.preventDefault();
    }

    if (e.key === 'Enter' || e.key === ' ') {
      // Enter로 확정할 때도 disabled 예외 처리
      if (!normalizeTabGroup[index].disabled) {
        setActiveIndex(index);
      }
      e.preventDefault();
    }
  };

  // 클릭 가능한 탭이 1개라도 존재하는지 확인
  const isActive = () => {
    return activeIndex > -1;
  };

  // layout 적용
  const renderContent = () => {
    if (!isActive) {
      return <div>출력할 화면이 없습니다.</div>;
    }

    const ActiveContent = normalizeTabGroup[activeIndex].content;
    // layout이 확인되면 감싸서 반환
    return Layout ? <Layout>{ActiveContent}</Layout> : ActiveContent;
  };

  return (
    <div className="tab-group">
      <div className="tab-group__list">
        {normalizeTabGroup.map((tab, index) => (
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
        {renderContent()}
      </div>
    </div>
  );
}
