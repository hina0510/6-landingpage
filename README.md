# 올리브영 × 네이버페이 카드 랜딩페이지

PRD/TRD 기반 HTML · CSS · JavaScript 랜딩 페이지입니다.

## 실행 방법

로컬에서 정적 서버로 열어주세요.

```bash
# Python
python -m http.server 8080

# 또는 npx
npx serve .
```

브라우저에서 `http://localhost:8080` 접속

## 프로젝트 구조

```
├── index.html
├── css/
├── js/
└── assets/
```

## Supabase

테이블 `card_applications`가 프로젝트에 생성되어 있습니다.

- 마이그레션: `supabase/migrations/20240521000000_create_card_applications.sql`
- 연동 설정: `js/config.js` (예시는 `js/config.example.js`)

| 컬럼 | 타입 |
|------|------|
| id | uuid |
| name | text |
| phone | text |
| email | text |
| birth | text |
| agree_privacy | boolean |
| created_at | timestamptz |

RLS: `anon` INSERT 허용(동의 필수), SELECT 차단

## 주요 기능

- Hero 풀스크린 + 카드 플로팅 애니메이션 (GSAP)
- Lenis 스무스 스크롤
- 카드 마우스 틸트 (768px 이상)
- 혜택 캐러셀 쇼케이스 (6슬라이드)
- 발급 신청 폼 + 성공 모달
- 반응형 (Desktop → Mobile)
- 스크롤 시 네비 active 상태 (CTA 스타일)
- 스크롤 올릴 때 reveal 역재생
- `assets/images/card.png` 실제 카드 이미지
- 올리브영 / 네이버페이 SVG 로고
