# Carhartt-UsedTransactions-FrontEnd-

중고 상품 탐색부터 주문, 결제까지의 커머스 과정을 구현한   
React 기반 프런트엔드 사이드 프로젝트입니다.

## 개요

Carhartt Used Transactions는   
중고 상품을 조회하고, 찜하고, 배송지를 등록한 뒤   
외부 결제 수단을 통해 주문을 완료하는 **End-to-End 커머스 플로우**를 목표로한 프로젝트입니다.

프로젝트를 위해 백엔드 3명, 프런트엔드 2명이 모여 팀이 구성 됐습니다.   
지금 보시는 Repository는 프런트엔드 코드를 관리하기 위한 Repository로   
저는(J-mung) **프런트엔드 개발자 및 팀장**으로 참여 했고,   
팀원(daynaWH)이 **프런트엔드 개발자 및 디자이너**으로 참여 했습니다.

## Tech Stack

### Frontend
- **React + Vite** 
- **JavaScript**
- **React Query** - 서버 상태 관리
- **Axios**
- **SCSS Modules**

### Infra / Deploy
- **Cloudflare Pages**

### Collaboration
- Github (PR 기반 협업)
- Figma (디자인 공유)

## 역할
   
### 🦑 J-mung (프런트엔드 개발자/팀장)

**1️⃣ 프로젝트 리딩 & 협업**
- 백엔드 팀과 기획, 일정 협의
- 백엔드 API 문서 규격화 협의 및 검토
- 프런트엔드-백엔드 간 인터페이스 조율
- 기능 단위 개발 범위 정의 및 우선순위 정리

**2️⃣ 아키텍처 & 인프라 설계**
- 웹 서버 구성
- 프런트엔드 아키텍처 설계
- 패키지 관리 및 의존성 구성
- 웹 서버 배포 환경 구성 및 배포 수행

**3️⃣ 인증, 결제, 외부 연동 대응**
- 카카오 OAuth 2.0 기반 로그인 협의 및 프런트엔드 구현
- 카카오 결제 플로우 협의 및 프런트엔드 구현
- 외부 서비스 Redirect 흐름 대응 및 상태 관리

**4️⃣ API & 데이터 통신 구조**
- Axios 기반 API 객체 설계 및 구현
- 공통 API 호출 구조 정리
- Mock / Real API 전환 구조 구현
- 백엔드 API 변경 대응 및 안정성 확보

**5️⃣ UI / UX & 사용자 인터렉션**
- 사용자 인터렉션 중심 UI 구현
- 시스템 라이트 / 다크 모드 테마 적용
- 공통 컴포넌트 및 위젯 설계, 구현
- SCSS Modules 기반 스타일 구조 적용

**6️⃣ 도메인 기능 구현**
- 배송지 등록 / 삭제 기능 구현
- 사용자 정보 관리 화면 및 상태 처리
- S3 기반 이미지 업로드 플로우 프런트엔드 구현

### 🕊️ daynaWH (프런트엔드 개발자/팀원)

## 주요 기능(Features)

### 1️⃣ 상품 조회 & 상세 페이지 (🕊️ daynaWH)
- React Query를 활용한 상품 목록 및 상세 데이터 조회
- Caching을 통해 페이지 이동 시 불필요한 재요청 최소화
- 로딩 / 에러 상태 분리 처리

<img width="2560" height="1368" alt="image" src="https://github.com/user-attachments/assets/1ea9d132-eecf-4fc4-b70f-a35825c5966e" />
<img width="2560" height="1368" alt="image" src="https://github.com/user-attachments/assets/49fa0d2a-700f-4b9f-aa6f-d4a0becc1c37" />

### 2️⃣ 찜(Wishlist) 기능 (🕊️ daynaWH)
- 찜 목록 조회, 추가, 삭제 기능 구현
- 서버 상태를 React Query로 관리하여 UI 즉시 반영
- Mock 환경과 실서버 환경에서 동일한 UX 유지

<img width="2560" height="1368" alt="image" src="https://github.com/user-attachments/assets/bb9a5634-fab9-4608-bcfd-adccae607d88" />


### 3️⃣ 카카오 OAuth 로그인 (🦑 J-mung)
- 카카오 OAuth 2.0 기반 소셜 로그인 플로우 구현
- 인가 코드 발급 -> 서버 토큰 교환 구조에 맞춘 프런트엔드 대응
- 로그인 성공 후 사용자 정보 조회 및 상태 동기화(Session)
- 새로고침 및 Redirect 이후에도 로그인 상태 유지 처리

### 4️⃣ 주문 & 결제 플로우 (🦑 J-mung)
- 주문 생성 -> 결제 준비 -> 결제 승인 단계 분리 처리
- 외부 결제(KakaoPay) Redirect 이후 상태 복구 대응
- 결제 완료 후 주문 상태 재조회 로직 구현

<img width="2560" height="1368" alt="image" src="https://github.com/user-attachments/assets/371dc950-f5bc-40c1-8718-ddfd004269b6" />
<img width="2560" height="1368" alt="image" src="https://github.com/user-attachments/assets/724e2607-d492-4b06-8d6a-20346c4937b5" />


### 5️⃣ 배송지 관리 (🦑 J-mung)
- 배송지 등록 / 삭제 UI 구현
- 배송지 목록을 서버 상태로 관리

<img width="2560" height="1368" alt="image" src="https://github.com/user-attachments/assets/29fc7244-4adb-4055-bc80-bc44679b82be" />
<img width="2560" height="1368" alt="image" src="https://github.com/user-attachments/assets/ec9cc46a-a18d-4727-b34b-eea2b723f66b" />


