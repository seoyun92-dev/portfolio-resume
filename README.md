# 서윤.resume

IntelliJ IDE를 컨셉으로 한 이력서 포트폴리오 사이트입니다.

## 특징

- 🎨 **IntelliJ 스타일 UI**: 왼쪽 탐색기, 탭바, 에디터, 상태바
- 🌙 **다크/라이트 테마**: 테마 토글 버튼으로 전환 가능, localStorage에 저장
- 📝 **Preview / Code 뷰**: 미리보기와 Java 코드 형태로 볼 수 있음
- 🔍 **검색 기능**: Ctrl+K로 파일명과 내용 검색
- 📱 **반응형 디자인**: 모바일에서 햄버거 메뉴로 탐색기 토글(오프캔버스), PC에서는 탐색기 자체를 접고 펼침
- 📋 **이메일 복사**: 연락처의 이메일 옆 아이콘 클릭으로 클립보드 복사, 커서 근처 토스트로 안내
- 📄 **PDF 이력서 다운로드**: 브라우저 인쇄 기능으로 자기소개·경력·기술스택·학력 및 자격을 모아 PDF로 저장(모바일에서는 PC 이용 안내)
- 🧭 **온보딩 투어**: 첫 방문 시 주요 영역을 스포트라이트로 소개, 상태바에서 다시 볼 수 있음
- 💬 **동료들의 한마디**: 같이 일한 분들의 리뷰를 보여주는 플로팅 위젯
- 💾 **정적 사이트**: HTML/CSS/JS만 사용, 빌드 불필요
- 📦 **GitHub Pages 배포 준비**: 상대경로만 사용

## 파일 구조

```
D:\dev\job\portfolio\resume
├── index.html              # 메인 HTML
├── css/
│   ├── style.css          # 스타일 (다크/라이트 테마, 모바일 반응형, 인쇄용 스타일)
│   ├── widget.css         # "동료들의 한마디" 위젯 스타일
│   └── tour.css           # 온보딩 투어(스포트라이트) 스타일
├── js/
│   ├── data.js            # 포트폴리오 데이터 (여기만 수정!)
│   ├── app.js             # 애플리케이션 로직(렌더링, 검색, PDF, 사이드바 등)
│   ├── widget.js          # "동료들의 한마디" 위젯 (자기완결, app.js 비수정)
│   └── tour.js            # 온보딩 투어 (자기완결, app.js 비수정)
├── assets/
│   └── avatar.svg          # 자기소개 프로필 아바타
├── README.md              # 이 파일
└── GUIDE.md               # 원본 기획 문서
```

## 콘텐츠 수정 방법

**모든 포트폴리오 콘텐츠는 `js/data.js` 파일 하나에서만 수정합니다.**

### 1. 기본 구조

`data.js`의 `portfolio` 객체는 다음과 같이 구성됩니다:

```javascript
const portfolio = {
  name: "서윤.resume",
  tree: [
    /* 파일 트리 */
  ],
  files: {
    /* 파일 내용 */
  },
};
```

### 2. 파일 트리 수정 (`tree` 배열)

```javascript
tree: [
  { type: "file", id: "start", name: "시작하기.md" },
  { type: "file", id: "intro", name: "자기소개.md" },
  {
    type: "folder",
    name: "경력",
    children: [
      {
        type: "folder",
        name: "회사명",
        children: [{ type: "file", id: "career_1", name: "프로젝트명.md" }],
      },
    ],
  },
];
```

**규칙:**

- `id`는 고유해야 합니다 (snake_case 추천)
- `name`은 트리에서 보이는 파일/폴더명입니다 (한글 O)
- 폴더는 `children` 배열을 가집니다

### 3. 파일 내용 수정 (`files` 객체)

```javascript
files: {
  intro: {
    name: "자기소개.md",
    path: "서윤.resume/자기소개.md",
    sections: [
      { type: "heading", level: 1, content: "자기소개" },
      { type: "paragraph", content: "안녕하세요..." },
      { type: "list", items: ["항목1", "항목2"] }
    ]
  }
}
```

**섹션 타입:**

- **heading**: 제목

  ```javascript
  { type: "heading", level: 1, content: "제목" }
  ```

- **paragraph**: 문단

  ```javascript
  { type: "paragraph", content: "문단 내용" }
  ```

- **list**: 목록

  ```javascript
  { type: "list", items: ["항목1", "항목2"] }
  ```

- **note**: 강조 메모(짧은 보충 설명)

  ```javascript
  { type: "note", content: "보충 설명" }
  ```

- **profile**: 아바타 이미지 + 기본 정보 목록(자기소개 상단에서 사용)

  ```javascript
  {
    type: "profile",
    avatar: "assets/avatar.svg",
    avatarAlt: "프로필 아바타",
    items: ["이름: 홍길동", "주 기술: React, Java"]
  }
  ```

- **detail-list**: 제목 + 상세 설명 목록(반복업무 등에서 사용)

  ```javascript
  {
    type: "detail-list",
    items: [
      { title: "항목 제목", detail: "상세 설명(여러 줄 가능)" }
    ]
  }
  ```

- **tag-groups**: 카테고리별로 묶인 태그 그룹(사용기술 등에서 사용)

  ```javascript
  {
    type: "tag-groups",
    items: [
      { category: "프론트엔드", tags: ["React", "Vue.js"] }
    ]
  }
  ```

- **year-cards**: 연도별로 접고 펼칠 수 있는 카드(연도 내림차순 정렬, 최신 3개는 기본 펼침)

  ```javascript
  {
    type: "year-cards",
    items: [
      {
        year: 2026,
        projectName: "프로젝트명",
        period: "2026.01 ~ 2026.04",
        development: "- 수행 내용",
        achievement: "성과",
        memo: "메모(선택)"
      }
    ]
  }
  ```

- **table**: 표

  ```javascript
  {
    type: "table",
    headers: ["컬럼1", "컬럼2"],
    rows: [["데이터1", "데이터2"]]
  }
  ```

- **tags**: 태그

  ```javascript
  { type: "tags", items: ["Java", "Spring", "MySQL"] }
  ```

- **cards**: 카드 그리드

  ```javascript
  {
    type: "cards",
    items: [
      {
        title: "카드 제목",
        description: "설명",
        fileId: "intro"  // 클릭 시 열 파일 ID (선택사항)
      },
      {
        title: "이력서 PDF",
        description: "이력서를 PDF로 다운로드하세요",
        fileId: null,
        isPdf: true  // 클릭 시 PDF 다운로드 실행 (fileId 대신 사용)
      }
    ]
  }
  ```

- **links**: 링크(`mailto:` 링크는 자동으로 옆에 이메일 복사 버튼이 붙음)

  ```javascript
  {
    type: "links",
    items: [
      { label: "GitHub", url: "https://github.com/..." },
      { label: "me@example.com", url: "mailto:me@example.com" }
    ]
  }
  ```

- **button**: 버튼
  ```javascript
  {
    type: "button",
    content: "버튼 텍스트",
    isPdf: true  // PDF 다운로드 버튼 (선택사항)
  }
  ```
  `isPdf: true`인 카드/버튼은 정적 파일을 내려받지 않고, 클릭 시 아래 "이력서 PDF
  다운로드하기"에 설명한 인쇄 기반 PDF 생성을 실행합니다.

### 4. 예시: 프로젝트 추가하기

**1단계**: `tree`에 폴더/파일 추가

```javascript
{
  type: "folder",
  name: "회사C",
  children: [
    { type: "file", id: "career_c_1", name: "프로젝트C1.md" }
  ]
}
```

**2단계**: `files`에 내용 추가

```javascript
career_c_1: {
  name: "프로젝트C1.md",
  path: "서윤.resume/경력/회사C/프로젝트C1.md",
  sections: [
    { type: "heading", level: 1, content: "프로젝트명" },
    { type: "paragraph", content: "프로젝트 설명..." },
    // ... 더 추가
  ]
}
```

## 이력서 PDF 다운로드하기

별도의 PDF 파일을 준비할 필요가 없습니다. "시작하기" 페이지의 "이력서 PDF" 카드,
"연락처" 페이지의 "이력서 PDF 다운로드" 버튼처럼 `isPdf: true`가 설정된 항목을
클릭하면 `js/app.js`의 `downloadPdf()`가 다음을 수행합니다.

1. `js/data.js`의 `intro`(자기소개), `career_a`/`career_b`(경력), `skills`
   (기술스택), `edu`(학력 및 자격) 파일 내용을 모아 화면에 보이지 않는 인쇄용
   뷰(`#printResume`)를 만듭니다.
2. 안내 토스트를 띄운 뒤 `window.print()`를 호출합니다.
3. 뜨는 인쇄 대화상자에서 **대상(프린터)을 "PDF로 저장"**으로 선택하면 이력서가
   PDF 파일로 저장됩니다.

**모바일(가로 768px 이하)에서는** 인쇄 대화상자 대신 클릭한 버튼/카드 바로 위에
"PDF 저장은 PC에서 시도해 주세요" 토스트가 표시됩니다. PDF 레이아웃이나 포함할
내용을 바꾸려면 `js/app.js`의 `getOrBuildPrintResume()`와 `@media print`
(`css/style.css`) 규칙을 수정하세요.

## 로컬 실행하기

### 방법1: 브라우저에서 직접 열기

```bash
# index.html을 브라우저로 열기
# 또는 파일 탐색기에서 index.html을 더블클릭
```

### 방법2: 간단한 HTTP 서버 (선택사항)

```bash
# Node.js가 있으면
npx serve

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

그 후 `http://localhost:8000`으로 접속합니다.

## 테마

- **기본 테마**: 다크 (IntelliJ 다크 테마 기반)
- **라이트 테마**: 밝은 배경
- **저장**: localStorage에 자동 저장되어 다음 방문 시 유지됩니다

우측 상단의 🌙/☀️ 버튼으로 토글합니다. 키보드 단축키: **Ctrl+Shift+T**

## 검색 기능

**Ctrl+K** 또는 **Cmd+K**로 검색 팔레트를 열 수 있습니다.

- 파일명 검색
- 파일 내용 검색
- 방향키로 결과 네비게이션
- Enter로 파일 열기
- Esc로 닫기

## 단축키

| 단축키                     | 기능      |
| -------------------------- | --------- |
| Ctrl+K / Cmd+K             | 검색 열기 |
| Ctrl+Shift+T / Cmd+Shift+T | 테마 전환 |
| Esc                        | 검색 닫기 |

## 주요 기능 설명

### Preview 뷰

- 아름답게 포맷된 문서 보기
- 카드와 링크는 클릭 가능
- 모바일 친화적

### Code 뷰

상태바에서 "Code"를 클릭하면 Java 클래스 형태로 표시됩니다.

```java
/**
 * 자기소개.md
 */
public class 자기소개 {
  // 제목들과 내용이 Java 형식으로 표시
  private String content = "...";
}
```

### 온보딩 투어

- 첫 방문 시 자동으로 탐색기 → 탭 → Code/Preview 전환 → 테마 전환 → 상태바 →
  동료 위젯 순서로 스포트라이트 투어가 시작됩니다(`js/tour.js`)
- `localStorage`에 한 번 본 상태를 저장해 다음 방문부터는 자동으로 뜨지 않음
- 상태바의 "🧭 투어 다시 보기"로 언제든 다시 볼 수 있음
- 모바일(768px 이하)에서는 말풍선이 대상 요소를 가리지 않도록 항상 화면 중앙에 표시

### 동료들의 한마디

- 자기소개 화면을 열면 같이 일한 분들의 리뷰를 보여주는 플로팅 위젯이 뜸
  (`js/widget.js`, `js/data.js`를 수정하지 않고 리뷰 내용은 위젯 파일 내부에서 관리)

### 모바일 반응형

- **768px 이하**: 탐색기가 햄버거 메뉴로 열리는 오프캔버스 오버레이로 전환
- **768px 초과(PC)**: 햄버거 버튼을 누르면 탐색기 자체가 접히고 펼쳐짐
  (오버레이가 아니라 레이아웃 폭이 0으로 줄어드는 방식)
- **480px 이하**: 본문·제목 글자 크기가 한 단계 더 축소되어 줄바꿈 감소
- **탭**: 가로 스크롤 가능
- **콘텐츠**: 자동 리플로우

## 기술 스택

- **HTML5**: 시맨틱 마크업
- **CSS3**: CSS 변수 기반 테마 시스템
- **JavaScript (ES6+)**: 클래스 기반 아키텍처
- **번들러 불필요**: 순수 바닐라 JS

## 브라우저 지원

- Chrome/Edge 최신버전
- Firefox 최신버전
- Safari 최신버전
- 모바일 브라우저

## 커스터마이징

### 색상 변경

`css/style.css`의 CSS 변수를 수정합니다:

```css
:root {
  --color-accent: #007acc; /* 강조 색 */
  --color-bg-main: #1e1e1e; /* 배경색 (다크) */
  --color-text-primary: #e0e0e0; /* 텍스트 색 */
}

:root[data-theme="light"] {
  --color-accent: #0078d4;
  --color-bg-main: #ffffff;
  --color-text-primary: #333333;
}
```

### 레이아웃 수정

`index.html`과 `css/style.css`를 함께 수정합니다.

## 주의사항

- **데이터 버전**: 항상 `js/data.js`만 수정하세요
- **경로**: GitHub Pages 배포를 위해 모든 경로는 상대경로입니다
- **XSS 방지**: 사용자 입력은 `textContent`로 안전하게 처리합니다
- **성능**: 대량 콘텐츠 시 검색 성능이 약간 저하될 수 있습니다

## 문제 해결

### PDF 버튼이 작동 안 할 때

- 모바일(가로 768px 이하)에서는 인쇄 자체가 지원되지 않아 "PC에서 시도해 주세요"
  토스트만 뜹니다. PC 브라우저에서 다시 시도하세요
- 뜨는 인쇄 대화상자에서 대상(프린터)을 반드시 **"PDF로 저장"**으로 선택하세요
- 인쇄 미리보기가 비어 있으면 콘솔(F12)에서 에러를 확인하세요

### 검색이 느릴 때

- 콘텐츠가 많으면 정상입니다
- 더 자주 검색하면 자동으로 캐시됩니다

### 모바일에서 깨질 때

- 브라우저 캐시를 비우세요
- F12 개발자 도구에서 콘솔 에러를 확인하세요

## 라이선스

이 포트폴리오는 개인 사용 목적으로 자유롭게 사용할 수 있습니다.

## 연락처

- **이메일**: seoyun.join@gmail.com
- **GitHub**: [GitHub 프로필 링크 추가]

---

**Happy coding! 🚀**

마지막 업데이트: 2026-10-19
