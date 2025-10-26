import { useUserStatus } from './useUserStatus';

export function useIsLoggedIn() {
  const cachedLogin = sessionStorage.getItem('is_logged_in') === 'true';
  const { data, status } = useUserStatus();

  const isLoading = status === 'pending';
  let isLoggedIn = false;

  // 서버 검증 결과 기반으로 판단
  if (status === 'success' && data && data.memberId) {
    isLoggedIn = true;
  }

  // session storage에 저장
  if (isLoggedIn) {
    if (!cachedLogin) {
      sessionStorage.setItem('is_logged_in', 'true');
    }
  } else {
    if (cachedLogin && status === 'success') {
      // 서버에서 비로그인 확인 시 제거
      sessionStorage.removeItem('is_logged_in');
    }
  }

  // fallback
  if (status === 'pending') {
    // 아직 서버 응답이 없으면 session storage에 저장된 값
    isLoggedIn = cachedLogin;
  }

  return { isLoggedIn, isLoading };
}
