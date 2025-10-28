# SNS 앱 개발 프로젝트 요약

## 프로젝트 개요
**목표**: Vercel(프론트엔드) + Supabase(백엔드)를 활용한 그룹채팅 기능이 있는 SNS 앱 개발

## 핵심 기술 스택

### Frontend
- **프레임워크**: Next.js 14+ (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **배포**: Vercel

### Backend
- **데이터베이스**: Supabase (PostgreSQL)
- **인증**: Supabase Auth
- **실시간**: Supabase Realtime
- **저장소**: Supabase Storage

### AI 챗봇
- **AI 모델**: Google Gemini API
- **모델 선택**: gemini-1.5-flash (무료, 빠름) / gemini-1.5-pro (고급 기능)
- **기능**: 대화 참여, 주제 제시, 최신 뉴스 제공

## 주요 기능

### 1. 기본 SNS 기능
- 사용자 프로필
- 게시물 작성/조회
- 좋아요, 댓글
- 팔로우/팔로잉
- 이미지 업로드

### 2. 그룹 채팅 기능
- 실시간 채팅방
- 채팅방 주제 설정
- 멤버 관리
- 읽음 표시

### 3. AI 챗봇 기능 (핵심)
**활동 조건**:
- 일일 최대 10회 활동
- 마지막 봇 메시지 이후 8개 이상 사용자 메시지 → 대화 참여
- 30분 이상 대화 없음 → 새 주제 제시
- 정해진 시간(9시, 12시, 18시) → 뉴스/정보 제공

**챗봇 역할**:
- 자연스럽게 대화에 참여
- 대화가 끊겼을 때 주제 시작
- 채팅방 주제 관련 최신 정보 제공
- 친근하고 짧은 응답 (1-3문장)

## 데이터베이스 구조

```
profiles (사용자 프로필)
├── posts (게시물)
├── likes (좋아요)
├── comments (댓글)
└── follows (팔로우)

chat_rooms (채팅방)
├── chat_room_members (멤버)
├── messages (메시지)
└── bot_activities (봇 활동 추적)
```

## 구현 흐름

### 1. 초기 설정
```bash
# 프로젝트 생성
npx create-next-app@latest sns-app --typescript --tailwind --app

# Supabase 설치
npm install @supabase/supabase-js @supabase/ssr

# Gemini API 설치
npm install @google/generative-ai
```

### 2. 환경 변수 (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
GOOGLE_AI_API_KEY=your-gemini-api-key
```

### 3. 주요 파일 구조
```
src/
├── app/
│   ├── (auth)/          # 로그인/회원가입
│   ├── feed/            # 피드
│   ├── chat/            # 채팅방
│   └── api/
│       └── chatbot/     # 챗봇 API
│           ├── check-activity/
│           └── generate-response/
├── components/
│   ├── ChatRoom.tsx     # 채팅 UI
│   └── CreatePost.tsx   # 게시물 작성
└── lib/
    ├── supabase/        # Supabase 클라이언트
    └── gemini/          # Gemini AI 유틸
```

### 4. 챗봇 동작 플로우
```
1. 사용자 메시지 전송
   ↓
2. /api/chatbot/check-activity 호출
   ↓
3. 봇 활동 조건 체크
   - 일일 10회 제한 확인
   - 메시지 개수/시간 확인
   ↓
4. 조건 충족 시 Gemini API 호출
   - 대화 맥락 분석
   - 적절한 응답 생성
   ↓
5. 봇 메시지 DB 저장
   ↓
6. Supabase Realtime으로 실시간 전송
   ↓
7. 모든 사용자 화면에 즉시 표시
```

## Gemini API 특징

### 장점
- ✅ 무료 티어 넉넉 (하루 1,500회)
- ✅ 빠른 응답 속도 (Flash 모델)
- ✅ 한국어 품질 우수
- ✅ Google Search 통합 가능 (실시간 정보)
- ✅ 저렴한 유료 요금

### 모델 선택
- **gemini-1.5-flash**: 일반 대화, 빠른 응답
- **gemini-1.5-pro**: 복잡한 분석, 웹 검색

## 개발 순서 (단계별)

### Phase 1: 기본 설정
1. ✅ Vercel 계정 생성
2. ✅ Next.js 프로젝트 생성
3. ✅ GitHub 저장소 연결
4. ✅ Vercel 배포
5. ✅ Supabase 프로젝트 생성
6. ✅ 환경 변수 설정

### Phase 2: 기본 SNS 기능
1. 회원가입/로그인 구현
2. 프로필 페이지
3. 게시물 CRUD
4. 좋아요/댓글 기능

### Phase 3: 채팅 기능
1. 채팅방 생성/참여
2. 실시간 메시지 송수신
3. 채팅방 UI/UX
4. 멤버 관리

### Phase 4: AI 챗봇
1. Gemini API 연동
2. 봇 활동 로직 구현
3. 응답 생성 알고리즘
4. 일일 10회 제한 구현
5. 뉴스/정보 제공 기능

### Phase 5: 최적화 & 배포
1. 성능 최적화
2. 에러 처리
3. 응답 캐싱
4. 프로덕션 배포

## 핵심 API 엔드포인트

```typescript
// 챗봇 활동 체크
POST /api/chatbot/check-activity
Body: { roomId: string }
Response: { triggered: boolean, type: string }

// 챗봇 응답 생성 (내부 호출)
- generateConversationResponse()  // 대화 참여
- generateTopicStarter()          // 주제 제시
- generateNewsUpdate()            // 뉴스 제공
```

## 비용 예상 (무료 티어 기준)

- **Vercel**: 무료 (Hobby 플랜)
- **Supabase**: 무료 (500MB DB, 1GB 파일)
- **Gemini API**: 무료 (하루 1,500회)

→ **총 비용: $0/월** (초기 단계)

## 다음 액션 아이템

현재 완료: ✅ 전체 아키텍처 설계 완료

**지금 바로 시작할 것**:
1. Vercel 계정 생성 및 프로젝트 배포
2. Supabase 프로젝트 생성 및 테이블 설계
3. Google AI Studio에서 API 키 발급
4. 로컬 개발 환경 구성
5. 기본 채팅 UI 구현부터 시작

