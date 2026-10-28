/* ============================================================================
   포트폴리오 데이터 (서윤)
   ============================================================================
   이 파일은 포트폴리오의 유일한 콘텐츠 출처입니다.
   아래 데이터만 수정하면 트리, Preview, Code 뷰가 자동으로 생성됩니다.
   ============================================================================ */

const portfolio = {
  name: "서윤.resume",

  // 파일 트리 구조
  tree: [
    { type: "file", id: "start", name: "시작하기.md" },
    { type: "file", id: "intro", name: "자기소개.md" },
    {
      type: "folder",
      name: "경력",
      children: [
        { type: "file", id: "career_a", name: "어질인소프트(주).md" },
        {
          type: "file",
          id: "career_b",
          name: "케이엘정보통신(주) 대전지점.md",
        },
      ],
    },
    { type: "file", id: "skills", name: "기술스택.md" },
    { type: "file", id: "edu", name: "학력·자격.md" },
    { type: "file", id: "contact", name: "연락처.md" },
  ],

  // 파일 내용 (sections 블록 배열로 정의)
  files: {
    start: {
      name: "시작하기.md",
      path: "서윤.resume/시작하기.md",
      sections: [
        {
          type: "heading",
          level: 1,
          content: "👋 시작하기",
        },
        {
          type: "paragraph",
          content: `안녕하세요! 프론트엔드와 백엔드를 아우르며 더 나은 결과를 고민하는 개발자 서윤입니다.
            아래 카드에서 원하시는 항목부터 편하게 둘러보세요.`,
        },
        {
          type: "cards",
          items: [
            {
              title: "자기소개",
              description: `화면부터 서버까지,
                더 나은 결과를 고민하는
                개발자의 이야기`,
              fileId: "intro",
            },
            {
              title: "경력",
              description: `수행한 프로젝트와 업무 경험`,
              fileId: "career_a",
            },
            {
              title: "기술스택",
              description: "사용 가능한 기술과 언어",
              fileId: "skills",
            },
            {
              title: "학력·자격",
              description: "학력, 교육이력, 자격증",
              fileId: "edu",
            },
            {
              title: "연락처",
              description: "이메일",
              fileId: "contact",
            },
            {
              title: "이력서 PDF",
              description: "이력서를 PDF로 다운로드하세요",
              fileId: null,
              isPdf: true,
            },
          ],
        },
      ],
    },

    intro: {
      name: "자기소개.md",
      path: "서윤.resume/자기소개.md",
      sections: [
        {
          type: "heading",
          level: 1,
          content: "자기소개",
        },
        {
          type: "heading",
          level: 2,
          content: "👤 기본 정보",
        },
        {
          type: "profile",
          avatar: "assets/avatar.svg",
          avatarAlt: "박서윤 프로필 아바타",
          items: [
            "이름: 박서윤",
            "성별: 여",
            "생년월일: 1992.02.08 (34세)",
            "직무·연차: 웹 개발자·6년 6개월 (IT 업계 2년 6개월, 개발 4년)",
            "주 기술: React, Vue.js, Java, Spring",
          ],
        },
        {
          type: "heading",
          level: 3,
          content: "우연히 시작해서, 스스로 길을 만든 개발자입니다.",
        },
        {
          type: "paragraph",
          content: `처음 시작은 IT 회사의 사무직이었습니다. 충남지역의 학교홈페이지들을 관리하다가 "어떻게 하면 화면을 더 보기 좋게 만들 수 있을까?" 하는 궁금증이 생겼고, 퇴근 후 혼자 프론트엔드를 공부하기 시작했습니다.
            제가 짠 코드로 화면이 동작하는 게 즐거웠고 본격적으로 개발자로 전향하고자 6개월간 직장인 부트캠프에 참여하게 되었고, 팀프로젝트를 위해 퇴사를 선택했습니다.
            이것저것 만들어보다가 프론트엔드만으로는 부족함을 느끼고 Node.js를 공부하고 있던 찰나, 뜻밖에도 자바 개발자로의 포지션 제안이 들어왔습니다.
            리액트와 자바를 함께 경험할 수 있다는 한 마디에 자바 개발자로서 일하게 됐고, 4년 동안 화면부터 서버까지 경험했습니다.
            시작은 우연이었지만, 지금 방향은 제가 직접 골랐습니다. 이제는 개발에 집중할 수 있는 곳에서 더 나은 결과를 고민하는 개발자로 성장하려 합니다.`,
        },
        {
          type: "heading",
          level: 2,
          content: "👩‍💻 직무 역량 및 개발 경험",
        },
        {
          type: "heading",
          level: 3,
          content:
            "React·Vue.js 프론트엔드와 Java/Spring 업무 시스템 개발을 함께 경험했습니다.",
        },
        {
          type: "heading",
          level: 4,
          content: "1. 프론트엔드: 화면을 처음부터 끝까지 만들 수 있습니다.",
        },
        {
          type: "list",
          items: [
            "React로 회사 홈페이지를 단독 개발(반응형, 지도 API 연동)",
            "XPlatform 화면을 React로 전환하는 연구과제 수행",
            "Vue.js 챗봇 UI와 Chart.js 차트 대시보드(막대·원·꺾은선) 구현",
          ],
        },
        {
          type: "tags",
          items: ["React", "Vue.js", "Chart.js"],
        },
        {
          type: "heading",
          level: 4,
          content:
            "2. 업무 시스템: 기존 시스템을 이해하고 업무 규칙에 따라 기능을 개선합니다",
        },
        {
          type: "list",
          items: [
            "세부 입력의 합이 합계수량을 넘으면 저장을 제한하고 알림메시지를 띄우고, 수정이 용이하도록 해당 입력란으로 이동하게끔 개선",
            "수백 개 조직의 메뉴 구성과 권한을 DB 데이터로 먼저 확인한 뒤, 흩어진 메뉴를 하나의 최상위 메뉴로 모아 적용",
            "검색 조건 추가, 엑셀 다운로드 등 사용자 요청 기능 구현",
          ],
        },
        {
          type: "tags",
          items: ["Java", "Spring", "SQL(Oracle)"],
        },
        {
          type: "note",
          content:
            "요구사항 분석부터 설계, 개발, 테스트, 원격·현장 패치까지 전 과정을 경험했습니다.",
        },
        {
          type: "heading",
          level: 2,
          content: "🤝 기술문서화 및 협업 역량",
        },
        {
          type: "heading",
          level: 3,
          content:
            "개발뿐 아니라 제안서, 가이드, 테스트 보고서까지 기술을 체계적으로 문서화합니다.",
        },
        {
          type: "heading",
          level: 4,
          content: "1. 기술 문서화: 읽는 사람이 쓰기 쉽게 정리합니다.",
        },
        {
          type: "list",
          items: [
            "React 개발 환경과 주요 구현 방식을 가이드로 문서화해 팀 내 프론트엔드 기술 공유",
            "요구사항 정의서, 설계서, 시험평가절차서 등 사업 산출물 작성",
            "통합테스트 문서를 취합해 오류 유형별로 분류하고 분석 보고서 작성",
          ],
        },
        {
          type: "tags",
          items: ["Word", "HWP", "PPT"],
        },
        {
          type: "heading",
          level: 4,
          content: "2. 협업·제안: 요구사항을 시각화하고, 문서 품질을 맞춥니다.",
        },
        {
          type: "list",
          items: [
            "요구사항을 분석해 구조도와 프로세스 다이어그램으로 시각화",
            "제안서 템플릿과 페이지 레이아웃을 표준화하고, 핵심 메시지를 강조해 문서의 일관성과 가독성 향상",
            "개발자 전원이 작성한 산출물을 검토·취합해 품질 관리",
          ],
        },
        {
          type: "note",
          content:
            "최종 제안서의 PDF 변환과 제출 산출물 검수까지 담당했습니다.",
        },
        {
          type: "heading",
          level: 2,
          content: "🤝 성격의 장단점",
        },
        {
          type: "heading",
          level: 3,
          content:
            "요구사항과 조건을 끝까지 확인해, 놓치기 쉬운 부분을 미리 찾아내는 개발자입니다.",
        },
        {
          type: "heading",
          level: 4,
          content: "장점: 꼼꼼하게 확인하고, 정해진 기준에 맞춰 완성합니다.",
        },
        {
          type: "paragraph",
          content: `설계 기간에 투입돼 요구사항을 클라이언트에게 직접 듣지 못하고 인수인계로 전달받은 적이 있습니다.
          이때 전달받은 내용을 그대로 믿기보다 확인이 필요한 사항을 따로 정리해 클라이언트와 논의했고, 그 과정에서 요구사항정의서에 오기재 및 누락된 요구사항을 미리 발견할 수 있었습니다.
          또한 테스트를 할 때는 시나리오 순서대로는 물론 예외적인 상황까지 체크하여 기존 오류를 발견하고 수정하기도 했습니다.
          이렇게 꼼꼼하게 확인하는 성향은 개발 결과뿐 아니라 문서와 테스트 산출물, 화면의 1px 단위 어긋남을 잡아내는 완성도에도 도움이 되었습니다.`,
        },
        {
          type: "heading",
          level: 4,
          content: "단점: 계획이 틀어지면 부담을 느낍니다.",
        },
        {
          type: "paragraph",
          content: `맡은 업무를 세부로 나눠 일정을 계획하고 이에 맞춰 정확하게 처리하는 데 집중하다 보니, 예상하지 못한 추가 업무가 생기면 기존 작업의 우선순위와 기간 조정을 다시 하게 되면서 업무 부담을 느끼기도 합니다.`,
        },
        {
          type: "heading",
          level: 4,
          content: `그래서 갑작스럽게 추가 업무가 생기면 기존 일정에 미치는 영향을 먼저 정리해 공유하고, 우선순위와 기간을 함께 조정합니다.
            혼자 다시 계획하며 부담을 안고 가다가 문제가 생기는 것보다, 업무 내용과 변경 범위를 투명하게 공유하여 업무에 문제가 생기지 않도록 대응하려고 노력합니다.`,
        },
        {
          type: "tags",
          items: [
            "#논리적으로_파고드는",
            "#꼼꼼하게_검증하는",
            "#디테일까지_놓치지_않는",
            "#계획적으로_접근하는",
            "#책임감_있는",
          ],
        },
        {
          type: "heading",
          level: 2,
          content: "🎯 앞으로의 방향",
        },
        {
          type: "heading",
          level: 3,
          content:
            "개발에 집중할 수 있는 환경에서, 프론트엔드와 백엔드를 함께 키우는 개발자로 성장하고 싶습니다.",
        },
        {
          type: "heading",
          level: 4,
          content:
            "화면과 서버 모두에서 4년간 성실하게 실무 기본기를 쌓았습니다.",
        },
        {
          type: "paragraph",
          content: `웹사이트 운영·유지보수를 계기로 개발에 관심을 갖게 되었고, 퇴근 후 스스로 공부하며 웹 개발자로 전환했습니다.
          이후 4년간 Java/Spring 기반 업무 시스템의 기능 개선과 React·Vue.js 기반 프론트엔드 개발을 경험했습니다.
          요구사항을 구현하는 데 그치지 않고 데이터 처리와 검증, 화면의 세부 완성도까지 고려하며 안정적인 기능을 만들기 위해 노력했습니다.`,
        },
        {
          type: "heading",
          level: 4,
          content: "개발에 더 집중하며, 화면과 서버를 함께 다루고 싶습니다.",
        },
        {
          type: "paragraph",
          content: `서버에서 데이터를 처리하고 검증하는 일과, 사용자가 직접 만나는 화면을 다듬는 일 모두 저에게 보람 있는 작업이었습니다.
          앞으로는 개발 자체에 더 집중하면서, 백엔드를 중심으로 프론트엔드까지 이어서 다룰 수 있는 환경에서 서비스의 구조와 동작 원리를 깊이 이해하며 만들고 싶습니다.`,
        },
        {
          type: "heading",
          level: 4,
          content: "완성도와 유지보수성을 함께 챙기는 개발자가 되겠습니다.",
        },
        {
          type: "paragraph",
          content: `Spring 기반 백엔드와 React 기반 프론트엔드 역량을 함께 발전시키겠습니다.
          요구사항을 정확히 구현하는 것을 넘어 더 나은 해결 방법을 고민하고, 사용자가 편하게 쓰는 화면과 오래 유지되는 코드를 함께 만드는 개발자로 성장하겠습니다.`,
        },
      ],
    },

    career_a: {
      name: "어질인소프트(주).md",
      path: "서윤.resume/경력/어질인소프트(주).md",
      sections: [
        { type: "heading", level: 1, content: "어질인소프트(주)" },

        { type: "heading", level: 2, content: "🏢 회사정보" },
        {
          type: "table",
          headers: ["항목", "내용"],
          rows: [
            ["회사명", "어질인소프트(주)"],
            ["재직기간", "2022.05 ~ 2026.04"],
            ["직무/직급", "웹 개발 / 국방사업본부 개발 1팀 과장"],
            ["근무형태", "정규직"],
          ],
        },

        { type: "heading", level: 2, content: "🔁 반복업무" },
        {
          type: "detail-list",
          items: [
            {
              title: "제안서 작성",
              detail: `- 담당 요구사항 분석, 핵심 내용 요약 및 수행방안 구체화를 통한 제안 내용 작성
              - 요구사항별 내용을 구조도 및 프로세스 다이어그램으로 시각화`,
            },
            {
              title: "개발 단계별 산출물 작성",
              detail:
                "- 요구사항 정의서, 사용자인터페이스정의서/설계서, 컴포넌트 설계서 등 개발 단계별 산출물을 Word, HWP, PPT 활용하여 작성",
            },
            {
              title: "원격 및 현장 패치",
              detail:
                "- 패치 가이드 참고하여 부대별로 원격 또는 현장 패치 진행",
            },
          ],
        },

        { type: "heading", level: 2, content: "🛠 사용기술" },
        {
          type: "tag-groups",
          items: [
            {
              category: "프론트엔드",
              tags: [
                "JSP",
                "HTML/CSS/JavaScript",
                "XPlatform",
                "React",
                "Vue.js",
              ],
            },
            {
              category: "백엔드/DB",
              tags: [
                "Java 8",
                "Spring",
                "전자정부프레임워크",
                "MyBatis",
                "Oracle",
              ],
            },
          ],
        },

        { type: "heading", level: 2, content: "📈 연도별 업무 및 성과" },
        {
          type: "year-cards",
          items: [
            {
              year: 2026,
              projectName: "2026년 ATCIS 개발SW 기능개선(제안 단계)",
              period: "2026.01 ~ 2026.04",
              development:
                "- 기능개선 사업 제안서 작성\n\u00A0\u00A0: 개선 방안, 차별화 요소, 발표 자료 작성 및 문서 디자인(템플릿·레이아웃·오탈자 검수) 전담, 최종본 PDF 변환\n- 제안 차별화 요소로 사내 메신저·업무 현황 대시보드 프로토타입 개발\n\u00A0\u00A0: 채팅 대화로 업무를 등록·조회·삭제하는 AI 챗봇 화면을 React로 구현해 WinForms에 WebView2로 연동하고, Ollama 기반 로컬 LLM 환경 구성\n\u00A0\u00A0\u00A0\u00A0(React, C#, WinForms, WebView2, H2, Ollama)",
              achievement: "제안 수주 성공",
              memo: "제안 업무 집중으로 프로토타입 개발은 다른 분께 인계",
            },
            {
              year: 2025,
              projectName: "2025년 ATCIS 개발SW 기능개선",
              period: "2025.01 ~ 2025.12",
              development:
                "- 신규 메뉴 추가 및 권한 데이터 정비\n\u00A0\u00A0: 분산된 메뉴를 독립적인 최상위 메뉴로 추가하고, 기존 하위 메뉴를 연계해 접근 경로 개선\n\u00A0\u00A0: DB 데이터 추출로 부대별 기존 메뉴 구성과 접근 권한을 확인해 신규 메뉴 적용 조건 파악\n\u00A0\u00A0: 부대별 메뉴 구성 및 하위 메뉴 권한 차이를 고려해 신규 메뉴 추가 및 적용\n- 기존 메뉴 검색 조건 추가 및 엑셀 다운로드 기능 구현\n- 통합테스트 문서 취합 및 분석 보고서 작성\n\u00A0\u00A0: 개발자 전원이 작성한 통합테스트 문서를 토대로 오류 유형을 분류·취합해 분석 보고서 작성\n- 제안서 작성, 총괄 및 품질 관리\n\u00A0\u00A0: 제안서 작성 자료의 시각적 구성 개선 및 문서 품질 표준화\n\u00A0\u00A0: 제안서 템플릿 및 페이지 레이아웃 표준화, 거버닝 메시지 작성 및 핵심 정보 강조\n\u00A0\u00A0: 최종 제안서 고해상도 PDF 변환, 제출 산출물 검수 및 품질 관리",
              achievement:
                "제안서 품질 표준화와 신규 메뉴 체계 정비로 업무 효율성과 사용자 접근성을 개선하고, 통합테스트 결과 취합·오류 유형 분석으로 테스트 품질 관리 체계를 지원",
              memo: "",
            },
            {
              year: 2024,
              projectName: "2024년 ATCIS 개발SW 기능개선",
              period: "2024.01 ~ 2024.12",
              development:
                "- 제안서 작성 및 품질 관리\n\u00A0\u00A0: 제안서 템플릿 및 페이지 레이아웃 표준화, 거버닝 메시지 작성 및 핵심 정보 강조\n- 장애조치/운영매뉴얼 챗봇 개발\n\u00A0\u00A0: Vue.js 기반 챗봇 서비스의 프론트엔드 UI 전반 개발\n\u00A0\u00A0: 사용자-챗봇 대화형 인터페이스 구현 및 검색어 자동완성 기능 및 자동완성 ON/OFF 기능 구현\n\u00A0\u00A0: 답변 항목별 좋아요 기능 및 만족도 조사 기능 구현\n\u00A0\u00A0: 장애 및 매뉴얼을 구분하여 시나리오 스크립트 작성 및 검수\n- 빅데이터 분석 및 시각화 툴 개발\n\u00A0\u00A0: 기존에 산재되어 있는 데이터를 한눈에 확인하고 분석이 가능하도록 시각화 대시보드 화면 구현\n\u00A0\u00A0: 기간별로 다양한 차트(막대/원/꺾은선)로 확인 가능하고 출력/인쇄 가능하도록 구현\n- 프론트엔드 개발 가이드 작성 및 기술 지식 공유\n\u00A0\u00A0: React 개발 환경과 주요 구현 방식을 가이드로 문서화하여 팀 내 프론트엔드 기술 공유 및 개발 참고 자료를 마련하고 개발자들의 프론트엔드 개발 역량 향상 지원",
              achievement:
                "챗봇 UI와 빅데이터 시각화 대시보드를 성공적으로 구현해 사용자 업무 지원 체계를 강화하고, 제안서 템플릿 표준화로 작성·검수 체계를 정립했으며, React 개발 가이드 문서화로 프론트엔드 기술 공유와 후속 개발 참고 기반을 마련",
              memo: "",
            },
            {
              year: 2023,
              projectName: "2023년 ATCIS 개발SW 기능개선",
              period: "2023.01 ~ 2023.12",
              development:
                "- 업무 시스템 입력 기능 개선\n\u00A0\u00A0: 업무 단계별 입력 조건을 분석하고, 특정 조건에서만 계획수량을 입력 및 수정할 수 있도록 기능 개선\n\u00A0\u00A0: 입력 조건에 따른 데이터 처리 로직 수정 및 유효성 검증 기능 구현\n- 업무 시스템 관리 항목 추가 및 데이터 검증 기능 개발\n\u00A0\u00A0: 기존 화면에 펼침/접힘이 가능하도록 동적 UI 구현하여 필요 시에만 관리 항목 추가할 수 있도록 구현\n\u00A0\u00A0: 항목별 데이터 입력·저장 기능 및 기존 데이터와 신규 입력 데이터 간 수량 정합성 검증 로직 구현\n\u00A0\u00A0: 수량 불일치 시 저장 차단 및 사용자 안내 메시지 표시하는 유효성 검증 기능 개발",
              achievement:
                "입력·검증 로직 개선으로 데이터 정합성 확보 및 입력 오류 사전 차단",
              memo: "",
            },
            {
              year: 2022,
              projectName: "2022년 ATCIS 개발SW 기능개선",
              period: "2022.05 ~ 2022.12",
              development:
                "- 기존 XPlatform 기반 시스템의 React 전환 가능성 검토를 위한 사내 연구과제 수행\n\u00A0\u00A0: 기존 업무 화면 중 주요 화면 3~4개를 React 기반으로 재구현하고 기존 시스템 API 연동\n\u00A0\u00A0: 메뉴 트리, 게시판 CRUD, 검색·정렬, 순서 변경 등 주요 업무 UI 및 기능 구현\n- React 기반 회사 홈페이지 단독 개발 및 반응형 웹 구현\n\u00A0\u00A0: 디자인 시안을 바탕으로 React 기반 회사 홈페이지 단독 개발\n\u00A0\u00A0: 다양한 디바이스 환경을 고려한 반응형 웹 구현\n\u00A0\u00A0: React Router를 활용한 페이지 라우팅 및 styled-components 기반 UI 구현\n\u00A0\u00A0: Kakao Map API를 연동한 회사 위치 안내 기능 구현",
              achievement:
                "React 전환 가능성을 검증하고, 외부 개발 의존 없이 회사 홈페이지를 단독으로 구축해 신기술 도입과 내재화 기반을 마련",
              memo: "",
            },
          ],
        },
      ],
    },

    career_b: {
      name: "케이엘정보통신(주) 대전지점.md",
      path: "서윤.resume/경력/케이엘정보통신(주) 대전지점.md",
      sections: [
        { type: "heading", level: 1, content: "케이엘정보통신(주) 대전지점" },

        { type: "heading", level: 2, content: "🏢 회사정보" },
        {
          type: "table",
          headers: ["항목", "내용"],
          rows: [
            ["회사명", "케이엘정보통신(주) 대전지점"],
            ["재직기간", "2019.09 ~ 2022.02"],
            [
              "직무/직급",
              "품질관리 및 기술 지원 / 개발사업6부 운영지원팀 대리",
            ],
            ["근무형태", "정규직"],
          ],
        },

        { type: "heading", level: 2, content: "🔁 반복업무" },
        {
          type: "detail-list",
          items: [
            {
              title: "학교 홈페이지 수정 요청 접수 및 처리",
              detail:
                "학교 담당 교사가 통합 관리자 페이지 게시글이나 전화로 남긴 디자인 변경·콘텐츠 수정 요청을 접수\n유선으로 처리 가능한 건은 즉시 처리하고, 내용이 긴 건은 게시글 요청으로 받아 순서대로 처리한 뒤 완료 댓글로 안내",
            },
            {
              title: "디자이너·개발자 협업 건 전달 및 진행 관리",
              detail:
                "디자인·개발 담당자의 개입이 필요한 요청은 내용을 정리해 전달하고, 직접 처리 가능한 범위는 HTML, CSS, JSP를 수정하고 부여받은 권한으로 서버에 접속해 파일을 교체",
            },
            {
              title: "문의 응대 및 이슈 대응",
              detail:
                "평시 하루 10건 내외, 신규 발령·홈페이지 개편 시기에는 게시글 기준 최대 120건의 요청과 이외 전화 문의를 응대하고 운영 이슈에 대응",
            },
            {
              title: "타 부서 지원 업무",
              detail:
                "여유 시간에 타 부서 요청을 받아 신규 지역 홈페이지 정보를 엑셀로 정리",
            },
          ],
        },

        { type: "heading", level: 2, content: "🛠 사용기술" },
        {
          type: "tag-groups",
          items: [
            { category: "화면", tags: ["HTML", "CSS", "JSP"] },
            { category: "DB", tags: ["SQL (조회)"] },
          ],
        },

        { type: "heading", level: 2, content: "📈 업무 및 성과" },
        {
          type: "year-cards",
          items: [
            {
              year: "2019 - 2022",
              projectName: "충청남도교육청 및 관내 학교 홈페이지 운영·유지보수",
              period: "2019.09 ~ 2022.02",
              development:
                "학교별 요청에 따라 HTML, CSS, JSP 수정과 서버 파일 교체를 직접 수행하고, SQL로 데이터를 조회",
              achievement:
                "평시 일 10건, 집중 시기 일 최대 120건의 요청을 처리",
              memo: "디자이너·개발자 처리 지연으로 학교 문의가 이어지는 상황을 겪으며 직접 처리할 수 있는 범위를 넓히려고 개발 공부를 시작했고, 이를 계기로 개발자로 직무를 전환",
            },
          ],
        },
      ],
    },

    skills: {
      name: "기술스택.md",
      path: "서윤.resume/기술스택.md",
      sections: [
        {
          type: "heading",
          level: 1,
          content: "🛠 기술스택",
        },
        {
          type: "heading",
          level: 2,
          content: "프로그래밍 언어",
        },
        {
          type: "tags",
          items: ["JavaScript", "Java8(실무)", "Java17(학습)", "SQL"],
        },
        {
          type: "heading",
          level: 2,
          content: "프론트엔드",
        },
        {
          type: "tags",
          items: ["TypeScript", "React", "Vue.js", "HTML/CSS", "Chart.js"],
        },
        {
          type: "heading",
          level: 2,
          content: "백엔드",
        },
        {
          type: "tags",
          items: [
            "Spring Framework",
            "REST API",
            "JSON",
            "전자정부프레임워크",
            "MyBatis",
            "JSP",
          ],
        },
        {
          type: "heading",
          level: 2,
          content: "데이터베이스",
        },
        {
          type: "tags",
          items: ["Oracle", "MySQL"],
        },
        {
          type: "heading",
          level: 2,
          content: "개발 도구&환경",
        },
        {
          type: "tags",
          items: [
            "Eclipse",
            "VS Code",
            "IntelliJ IDEA",
            "Git/GitHub",
            "Claude Code",
          ],
        },
        {
          type: "heading",
          level: 2,
          content: "레거시&업무기술",
        },
        {
          type: "tags",
          items: [
            "XPlatform",
            "반응형 웹",
            "API 연동",
            "통합 테스트 및 운영 유지보수",
          ],
        },
        ,
      ],
    },

    edu: {
      name: "학력·자격.md",
      path: "서윤.resume/학력·자격.md",
      sections: [
        {
          type: "heading",
          level: 1,
          content: "🎓 학력·자격",
        },
        {
          type: "heading",
          level: 2,
          content: "학력",
        },
        {
          type: "table",
          headers: ["학교", "전공", "기간", "학점"],
          rows: [
            [
              "동의대학교 가야캠퍼스(4년제)",
              "경찰행정학과",
              "2010.03 ~ 2015.02",
              "4.09 / 4.5",
            ],
            ["양산제일고등학교", "이과계열", "2007.03 ~ 2010.02", "-"],
          ],
        },

        {
          type: "heading",
          level: 2,
          content: "교육 이력",
        },
        {
          type: "table",
          headers: ["교육명", "기관", "기간", "상태"],
          rows: [
            [
              "JPA (JPA 기본편, 스프링 부트와 JPA 활용 1·2, 스프링 데이터 JPA, Querydsl)",
              "인프런",
              "2026",
              "수료",
            ],
            [
              "데이터 접근 (스프링 DB 1·2편, 실전 데이터베이스 기본편)",
              "인프런",
              "2025",
              "수료",
            ],
            [
              "Spring 핵심 (스프링 핵심 원리 기본편, MVC 1·2편)",
              "인프런",
              "2024",
              "수료",
            ],
            ["Java (실전 자바 기본편, 중급 1·2편)", "인프런", "2023", "수료"],
            ["JAVA 및 SQL 데이터 분석 입문", "인프런", "2022", "수료"],
            [
              "백엔드 패키지(Node.js, Vue, Next.js)",
              "코딩애플",
              "2022",
              "수료",
            ],
            [
              "프론트엔드 기본 및 심화(HTML/CSS, JavaScript, React)",
              "드림코딩",
              "2022",
              "수료",
            ],
            [
              "SE 부트캠프 Part 6기(풀스택 개발자 과정)",
              "코드스테이츠",
              "2021.05.31 ~ 2021.12.18",
              "중도 종료(취업)",
            ],
          ],
        },
        {
          type: "heading",
          level: 2,
          content: "자격증",
        },
        {
          type: "list",
          items: ["SQLD(2023)", "운전면허 1종 보통(2016)"],
        },
      ],
    },

    contact: {
      name: "연락처.md",
      path: "서윤.resume/연락처.md",
      sections: [
        {
          type: "heading",
          level: 1,
          content: "📞 연락처",
        },
        {
          type: "heading",
          level: 2,
          content: "📧 이메일",
        },
        {
          type: "links",
          items: [
            {
              label: "seoyun.join@gmail.com",
              url: "mailto:seoyun.join@gmail.com",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          content: "🔗 깃허브",
        },
        {
          type: "links",
          items: [
            {
              label: "seoyun92-dev",
              url: "https://github.com/seoyun92-dev",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          content: "🔗 블로그",
        },
        {
          type: "links",
          items: [
            {
              label: "Extra + Ordinary",
              url: "https://seoyun-is-connecting-the-dots.tistory.com/",
            },
          ],
        },
        {
          type: "heading",
          level: 2,
          content: "📄 이력서 다운로드",
        },
        {
          type: "paragraph",
          content: "아래 버튼에서 이력서 PDF를 다운로드할 수 있습니다.",
        },
        {
          type: "button",
          content: "이력서 PDF 다운로드",
          isPdf: true,
        },
      ],
    },
  },
};

/* ============================================================================
   유틸리티 함수
   ============================================================================ */

/**
 * 파일 ID로 파일 객체 반환
 */
function getFile(fileId) {
  return portfolio.files[fileId] || null;
}

/**
 * 트리에서 항목 찾기
 */
function findTreeItem(tree, predicate) {
  for (const item of tree) {
    if (predicate(item)) return item;
    if (item.children) {
      const found = findTreeItem(item.children, predicate);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 파일 ID로 경로 찾기 (트리에서)
 */
function getFilePathInTree(fileId) {
  function buildPath(items, parentPath = "") {
    for (const item of items) {
      const currentPath = parentPath ? `${parentPath}/${item.name}` : item.name;

      if (item.type === "file" && item.id === fileId) {
        return currentPath;
      }

      if (item.children) {
        const found = buildPath(item.children, currentPath);
        if (found) return found;
      }
    }
    return null;
  }

  return buildPath(portfolio.tree);
}

/**
 * 모든 파일을 평탄화하여 반환 (검색용)
 */
function getAllFiles() {
  const files = [];

  function walk(items) {
    for (const item of items) {
      if (item.type === "file") {
        const file = getFile(item.id);
        if (file) {
          files.push({
            id: item.id,
            name: item.name,
            file: file,
          });
        }
      }
      if (item.children) {
        walk(item.children);
      }
    }
  }

  walk(portfolio.tree);
  return files;
}

/**
 * 파일의 모든 텍스트 내용 추출 (검색용)
 */
function getFileFullText(fileId) {
  const file = getFile(fileId);
  if (!file) return "";

  const parts = [];

  function extractText(sections) {
    for (const section of sections) {
      if (section.content) {
        parts.push(section.content);
      }
      if (section.items && Array.isArray(section.items)) {
        if (typeof section.items[0] === "string") {
          parts.push(section.items.join(" "));
        } else if (typeof section.items[0] === "object") {
          section.items.forEach((item) => {
            if (item.label) parts.push(item.label);
            if (item.title) parts.push(item.title);
            if (item.description) parts.push(item.description);
            // tag-groups
            if (item.category) parts.push(item.category);
            if (item.tags) parts.push(item.tags.join(" "));
            // year-cards
            if (item.projectName) parts.push(item.projectName);
            if (item.period) parts.push(item.period);
            if (item.development) parts.push(item.development);
            if (item.achievement) parts.push(item.achievement);
            if (item.memo) parts.push(item.memo);
          });
        }
      }
      if (section.headers) parts.push(section.headers.join(" "));
      if (section.rows) {
        section.rows.forEach((row) => parts.push(row.join(" ")));
      }
    }
  }

  extractText(file.sections);
  return parts.join(" ");
}
