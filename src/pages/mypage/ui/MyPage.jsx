import { useUpdateNickname } from '@/entities/user/hooks/useUpdateNickname';
import { useUploadProfileImage } from '@/entities/user/hooks/useUploadProfileImage';
import { useUserStatus } from '@/entities/user/hooks/useUserStatus';
import { Button } from '@/shared/ui/buttons';
import InputBox from '@/shared/ui/InputBox';
import TabGroup from '@/shared/ui/tabs/TabGroup';
import ThemeToggle from '@/shared/ui/ThemeToggle';
import Modal from '@/widgets/modal/Modal';
import { useModal } from '@/widgets/modal/ModalProvider';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useImageUploader } from '../model/useImageUploader';
import ImageUploadModal from './ImageUploadModal';
import './myPage.scss';
import MyPageProductList from './MyPageProductList';

export default function MyPage() {
  const { openModal, updateModal } = useModal();
  const {
    data: userInfo,
    isLoading: userStatusLoding,
    isError: userStatusError,
  } = useUserStatus();
  // 닉네임 수정
  const [isEditing, setIsEditing] = useState(false);
  const [newNickname, setNewNickname] = useState('');
  const { mutate: nicknameMutate, isPending: nicknamePending } =
    useUpdateNickname();
  // 프로필 이미지 업로드 훅 (파일 선택용)
  const {
    items: avatarSrcList,
    setMultiple,
    handleSelect: handleAvatarSelect,
    reset: resetAvatarSelection,
  } = useImageUploader();
  // 업로드 로직 훅 (API 연동)
  const { uploadProfileImage, isUploading } = useUploadProfileImage();
  // 모달 컨트롤을 위한 modal id state
  const [avatarModalId, setAvatarModalId] = useState(null);

  const buildProfileModalButtons = useCallback(() => {
    // uploader에 이미지 하나만 업로드 하도록 설정
    setMultiple(false);

    return [
      {
        label: isUploading ? '업로드 중...' : '업로드',
        variant: 'standard-primary',
        disabled: isUploading || avatarSrcList.length === 0,
        onClick: async () => {
          const snapshot = [...avatarSrcList];
          const isSuccess = await uploadProfileImage(snapshot);
          if (isSuccess) {
            resetAvatarSelection();
          }
        },
      },
    ];
  }, [avatarSrcList, isUploading, resetAvatarSelection, uploadProfileImage]);

  const sellingList = useMemo(
    () => [
      {
        id: 'sale-1',
        title: '카브카 초어코트',
        price: '129,000원',
        status: '판매 중',
        statusType: 'ongoing',
        description: '1회 착용 · 택포',
      },
      {
        id: 'sale-2',
        title: 'OG Chore Jacket',
        price: '98,000원',
        status: '판매 완료',
        statusType: 'completed',
        description: '빈티지 워싱 · 실측 103',
      },
      {
        id: 'sale-3',
        title: 'Active Jacket',
        price: '155,000원',
        status: '택배 예약 중',
        statusType: 'ongoing',
        description: '미시즌 · L 사이즈',
      },
      {
        id: 'sale-4',
        title: 'Detroit Jacket',
        price: '178,000원',
        status: '구매자 확인 중',
        statusType: 'ongoing',
        description: '교신 환영 · 상태 A',
      },
      {
        id: 'sale-5',
        title: 'Trapper Hat',
        price: '52,000원',
        status: '판매 완료',
        statusType: 'completed',
        description: '착용감 거의 없음',
      },
      {
        id: 'sale-6',
        title: 'Canvas Tote Bag',
        price: '39,000원',
        status: '판매 중',
        statusType: 'ongoing',
        description: '한정 컬러 · 생활 오염 약간',
      },
    ],
    []
  );

  const purchaseList = useMemo(
    () => [
      {
        id: 'buy-1',
        title: '아크틱 코트',
        price: '225,000원',
        status: '배송 중',
        statusType: 'ongoing',
        description: '로지스팟 집하 완료',
      },
      {
        id: 'buy-2',
        title: '미시간 코트',
        price: '189,000원',
        status: '구매 완료',
        statusType: 'completed',
        description: '거래 종료 · 리뷰 작성 완료',
      },
      {
        id: 'buy-3',
        title: 'OG Santa Fe Jacket',
        price: '210,000원',
        status: '배송 준비중',
        statusType: 'ongoing',
        description: '판매자 발송 대기',
      },
      {
        id: 'buy-4',
        title: 'Ruck Single Knee Pant',
        price: '119,000원',
        status: '구매 완료',
        statusType: 'completed',
        description: '실착감 만족 · 후기 작성 예정',
      },
    ],
    []
  );

  const wishList = useMemo(
    () => [
      {
        id: 'wish-1',
        title: '트레드 밀 비니',
        price: '32,000원',
        status: '가격 인하',
        statusType: 'notice',
        description: '찜한 후 2일 경과 · 5,000원 인하',
      },
      {
        id: 'wish-2',
        title: 'Kendrick Cap',
        price: '46,000원',
        status: '판매중',
        statusType: 'ongoing',
        description: '남은 수량 1개',
      },
      {
        id: 'wish-3',
        title: 'Hooded Sail Jacket',
        price: '165,000원',
        status: '재입고 알림',
        statusType: 'notice',
        description: '입고 예정 · 3일 전 안내',
      },
      {
        id: 'wish-4',
        title: 'Simple Pant',
        price: '85,000원',
        status: '판매중',
        statusType: 'ongoing',
        description: '사이즈 30 · 새상품 급',
      },
      {
        id: 'wish-5',
        title: 'Jake Hip Bag',
        price: '58,000원',
        status: '가격 인하',
        statusType: 'notice',
        description: '10% 할인 진행 중',
      },
    ],
    []
  );

  const profile = useMemo(() => {
    if (userStatusLoding || userStatusError) {
      return {
        memberId: '',
        memberName: '',
        memberNickname: '',
        loginType: '',
        provider: '',
        avatar: '',
        email: '',
        joinDate: '',
        stats: [],
      };
    }
    return {
      ...userInfo,
      email: userInfo.email ?? userInfo.provider ?? '이메일 정보 이슈',
      joinDate: '2024.01.12 가입',
      stats: [
        { key: 'selling', label: '판매', value: sellingList.length ?? 0 },
        { key: 'sold', label: '구매', value: purchaseList.length ?? 0 },
        { key: 'purchased', label: '찜', value: wishList.length ?? 0 },
      ],
    };
  }, [userInfo, userStatusLoding, userStatusError]);

  // 모달 내 미리보기 업데이트
  useEffect(() => {
    if (!avatarModalId) return;

    // 최신 미리보기/원본 정보를 모달에 반영하여 리렌더링을 유도
    updateModal(avatarModalId, () => ({
      children: (
        <ImageUploadModal
          origin={profile.avatar}
          items={avatarSrcList}
          handleSelect={handleAvatarSelect}
        />
      ),
      buttons: buildProfileModalButtons(),
    }));
  }, [
    avatarModalId,
    avatarSrcList,
    buildProfileModalButtons,
    handleAvatarSelect,
    profile.avatar,
    updateModal,
  ]);

  // 프로필 변경 모달 열기
  const openProfileModal = () => {
    const modalId = openModal(Modal, {
      title: '프로필 이미지 변경',
      children: (
        <ImageUploadModal
          origin={profile.avatar}
          items={avatarSrcList}
          handleSelect={handleAvatarSelect}
        />
      ),
      buttons: buildProfileModalButtons(),
      width: '520px',
      centered: true,
      onClose: () => {
        resetAvatarSelection();
        setAvatarModalId(null);
      },
    });
    setAvatarModalId(modalId);
  };

  // 닉네임 변경 모드 토글 전용
  const toggleEditMode = () => {
    setIsEditing((prev) => !prev);
    setNewNickname('');
  };

  // 닉네임 실제 변경 요청
  const submitNicknameChange = () => {
    if (!newNickname.trim()) return;
    nicknameMutate(newNickname);
    setIsEditing(false);
  };

  const PanelLayout = ({ children }) => (
    <div className={'my-page__panel'}>{children}</div>
  );

  const tabGroup = [
    {
      key: 'selling',
      label: '판매',
      content: (
        <MyPageProductList
          items={sellingList}
          emptyText={'판매중인 상품이 없습니다.'}
        />
      ),
    },
    {
      key: 'purchase',
      label: '구매',
      content: (
        <MyPageProductList
          items={purchaseList}
          emptyText={'구매 내역이 없습니다.'}
        />
      ),
    },
    {
      key: 'wishlist',
      label: '찜',
      content: (
        <MyPageProductList
          items={wishList}
          emptyText={'찜한 상품이 없습니다.'}
        />
      ),
    },
  ];

  return (
    <div className={'my-page'}>
      {/* 헤더 */}
      <div className={'my-page__header'}>
        <div>
          <h2 className={'my-page__title h3'}>마이페이지</h2>
          <p className={'my-page__subtitle text-regular'}>
            회원 정보와 거래 현황을 한 눈에 확인해보세요.
          </p>
        </div>
        <ThemeToggle />
      </div>

      {/* 프로필 카드 */}
      <div className={'my-page__profile-card'}>
        {/* 아바타 */}
        <div className={'my-page__avatar'}>
          <div className={'my-page__avatar-image'} aria-hidden={'true'}>
            <img className={'my-page__avatar-source'} src={profile.avatar} />
          </div>
          <Button
            label={'프로필 수정'}
            size={'--s'}
            variant={'standard-secondary'}
            onClick={openProfileModal}
          />
        </div>

        {/* 닉네임 수정 영역 */}
        <div className={'my-page__profile-details'}>
          {isEditing ? (
            <div className={'my-page__nickname-row'}>
              <InputBox
                type={'text'}
                name={'change_nickname'}
                placeholder={'새 닉네임 입력'}
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                clear
              />
              <Button
                label={'수정 완료'}
                variant={'standard-primary'}
                onClick={submitNicknameChange}
                disabled={nicknamePending}
                className={'flex m-auto'}
              />
              <Button
                label={'취소'}
                variant={'standard-secondary'}
                onClick={toggleEditMode}
              />
            </div>
          ) : (
            <div className={'my-page__nickname-row'}>
              <span className={'my-page__nickname h4'}>
                {profile.memberNickname}
              </span>
              <Button
                label={'닉네임 수정'}
                variant={'standard-secondary'}
                onClick={toggleEditMode}
              />
            </div>
          )}

          {/* 기타 정보 */}
          <dl className={'my-page__meta'}>
            <div>
              <dt className={'text-caption'}>로그인 타입</dt>
              <dd className={'text-regular'}>{profile.loginType}</dd>
            </div>
            <div>
              <dt className={'text-caption'}>이메일</dt>
              <dd className={'text-regular'}>{profile.email}</dd>
            </div>
            {/* (필요 시) 추가 정보 */}
            {/* <div>
              <dt className={'text-caption'}>가입일</dt>
              <dd className={'text-regular'}>{profile.joinDate}</dd>
            </div>
            <div>
              <dt className={'text-caption'}>보유 포인트</dt>
              <dd className={'text-regular'}>{profile.point}</dd>
            </div> */}
          </dl>

          <div className={'my-page__stats'}>
            {profile.stats.map((stat) => (
              <div key={stat.key} className={'my-page__stat'}>
                <span className={'my-page__stat-label text-caption'}>
                  {stat.label}
                </span>
                <span className={'my-page__stat-value h4'}>{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className={'my-page__tabs'}>
        <TabGroup tabGroup={tabGroup} Layout={PanelLayout} />
      </div>
    </div>
  );
}
