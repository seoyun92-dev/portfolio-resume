/* ============================================================================
   "동료들의 한마디" 플로팅 채팅 위젯
   - 기존 포트폴리오 앱(js/app.js)은 전혀 수정하지 않고, 이 파일만 추가로 동작한다.
   - 자기소개.md를 열 때만 전역 app 인스턴스(window.app.openFile)를 재사용한다.
   ============================================================================ */

(function () {
  const REVIEWS = [
    {
      from: "전 직장 상사",
      text: "책임감 있고 항상 밝아서 좋았어요. 프리랜서분들까지 챙기는 모습은 보통 PL에게 바라는 모습인데, 연차가 높지 않은데도 먼저 생각하고 챙겨줘서 정말 고마웠어요.",
    },
    {
      from: "부트캠프 페어 파트너",
      text: "문제를 침착하게 해결하고, 코드를 줄여서 읽기 좋게 만드는 모습이 인상적이었어요.",
    },
    {
      from: "전 직장 프리랜서 개발자",
      text: "자바 개발자로만 일해서 CSS 쪽은 잘 몰랐는데, 덕분에 화면 구현을 잘 할 수 있었어요. 바쁠 텐데 많이 신경 써 줘서 고마워요.",
    },
    {
      from: "프로젝트 클라이언트",
      text: "저희가 생각도 못한 방법이었는데, 더 좋은 대안을 찾아 주셔서 감사합니다.",
    },
    {
      from: "부트캠프 페어 파트너",
      text: "설명을 조금만 더 풀어 주시면 완벽할 만큼, 제가 만난 페어 중 가장 실력 있는 분이었어요.",
    },
    {
      from: "전 직장 동료",
      text: "상사분 말씀을 이해하지 못해 난감했을 때, 중간에서 서로 이해할 수 있게 도와주셔서 감사했어요. 아니, 그냥 있는 동안 늘 감사했어요.",
    },
  ];

  const HINT_TEXT = "같이 일해 본 사람들은\n뭐라고 할까요?";
  const HINT_SEEN_STORAGE_KEY = "companionWidgetHintSeen";
  const HINT_SHOW_DELAY_MS = 1000;
  const HINT_AUTO_HIDE_MS = 10000;
  const TYPING_DURATION_MS = 800;

  // 말풍선 + 점 세 개 아이콘 (외부 이미지 없이 인라인 SVG로 제작)
  const BUBBLE_ICON_SVG = `
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 5.5C4 4.67 4.67 4 5.5 4h13c0.83 0 1.5 0.67 1.5 1.5v10c0 0.83-0.67 1.5-1.5 1.5H9l-4.3 3.3c-0.4 0.3-1 0-1-0.5V5.5z" fill="currentColor"/>
      <circle class="companion-widget-icon-dot" cx="8.5" cy="10" r="1.2"/>
      <circle class="companion-widget-icon-dot" cx="12" cy="10" r="1.2"/>
      <circle class="companion-widget-icon-dot" cx="15.5" cy="10" r="1.2"/>
    </svg>
  `;

  // sessionStorage는 프라이빗 모드 등에서 접근이 막힐 수 있으므로 항상 try/catch로 감싼다
  function hasSeenHint() {
    try {
      return sessionStorage.getItem(HINT_SEEN_STORAGE_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function markHintSeen() {
    try {
      sessionStorage.setItem(HINT_SEEN_STORAGE_KEY, "true");
    } catch (e) {
      // 저장에 실패해도 위젯 동작에는 영향 없음 (이번 세션에서만 다시 보일 수 있음)
    }
  }

  class CompanionReviewWidget {
    constructor() {
      this.isOpen = false;
      this.hasPlayedMessages = false; // 새로고침 전까지는 등장 애니메이션을 한 번만 재생
      this.pendingTimers = [];
      this.hintHideTimeout = null;

      this.container = this.createMarkup();
      document.body.appendChild(this.container);

      this.button = this.container.querySelector(".companion-widget-button");
      this.hintBubble = this.container.querySelector(".companion-widget-hint");
      this.panel = this.container.querySelector(".companion-widget-panel");
      this.messageList = this.container.querySelector(
        ".companion-widget-messages",
      );
      this.closeButton = this.container.querySelector(
        ".companion-widget-close",
      );

      this.bindEvents();
      this.scheduleHintBubble();
    }

    createMarkup() {
      const container = document.createElement("div");
      container.className = "companion-widget";
      container.innerHTML = `
        <div class="companion-widget-hint hidden"></div>
        <div class="companion-widget-panel hidden" role="dialog" aria-label="동료들의 한마디" aria-hidden="true">
          <div class="companion-widget-header">
            <span class="companion-widget-title">동료들의 한마디</span>
            <button type="button" class="companion-widget-close" aria-label="동료들의 한마디 닫기">✕</button>
          </div>
          <div class="companion-widget-messages"></div>
        </div>
        <button type="button" class="companion-widget-button" aria-label="동료들의 한마디 열기" aria-expanded="false">
          ${BUBBLE_ICON_SVG}
        </button>
      `;
      container.querySelector(".companion-widget-hint").textContent = HINT_TEXT;
      return container;
    }

    // ------------------------------------------------------------------
    // 안내 말풍선: 최초 1회만, sessionStorage 기준으로 노출
    // ------------------------------------------------------------------
    scheduleHintBubble() {
      if (hasSeenHint()) return;

      const showTimer = window.setTimeout(() => {
        if (this.isOpen) return; // 이미 채팅창을 열어둔 상태라면 안내는 생략

        this.showHintBubble();
        markHintSeen();

        const hideTimer = window.setTimeout(
          () => this.hideHintBubble(),
          HINT_AUTO_HIDE_MS,
        );
        this.pendingTimers.push(hideTimer);
      }, HINT_SHOW_DELAY_MS);

      this.pendingTimers.push(showTimer);
    }

    showHintBubble() {
      // 사라지는 중이던 말풍선을 다시 보여줄 때, 뒤늦게 hidden으로 전환되지 않도록 예약을 정리
      if (this.hintHideTimeout) {
        window.clearTimeout(this.hintHideTimeout);
        this.hintHideTimeout = null;
      }

      this.hintBubble.classList.remove("hidden");
      // display:none 해제 직후 바로 opacity를 바꾸면 트랜지션이 생략되므로 한 프레임 뒤에 적용
      requestAnimationFrame(() => this.hintBubble.classList.add("visible"));
    }

    hideHintBubble() {
      this.hintBubble.classList.remove("visible");
      if (this.hintHideTimeout) {
        window.clearTimeout(this.hintHideTimeout);
      }
      this.hintHideTimeout = window.setTimeout(() => {
        this.hintBubble.classList.add("hidden");
        this.hintHideTimeout = null;
      }, 250);
    }

    // ------------------------------------------------------------------
    // 아이콘에 마우스를 올렸을 때도 같은 안내 말풍선을 보여준다 (세션당 1회 자동 노출과 별개)
    // ------------------------------------------------------------------
    handleButtonHover() {
      if (this.isOpen) return; // 채팅창이 열려 있으면 안내가 필요 없음

      // 예약돼 있던 자동 노출/숨김 타이머는 호버로 직접 보여줬으니 더 이상 필요 없음
      this.pendingTimers.forEach((timer) => window.clearTimeout(timer));
      this.pendingTimers = [];

      this.showHintBubble();
    }

    handleButtonHoverEnd() {
      if (this.isOpen) return;
      this.hideHintBubble();
    }

    // ------------------------------------------------------------------
    // 열기 / 닫기
    // ------------------------------------------------------------------
    bindEvents() {
      this.button.addEventListener("click", () => this.toggle());
      this.closeButton.addEventListener("click", () => this.close());

      this.button.addEventListener("mouseenter", () => this.handleButtonHover());
      this.button.addEventListener("mouseleave", () => this.handleButtonHoverEnd());

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && this.isOpen) {
          this.close();
        }
      });
    }

    toggle() {
      if (this.isOpen) {
        this.close();
      } else {
        this.open();
      }
    }

    open() {
      this.isOpen = true;

      // 아직 안 떴거나 떠 있는 안내 말풍선은 채팅창을 열면 더 이상 필요 없다
      this.pendingTimers.forEach((timer) => window.clearTimeout(timer));
      this.pendingTimers = [];
      this.hideHintBubble();

      this.panel.classList.remove("hidden");
      this.panel.setAttribute("aria-hidden", "false");
      this.button.setAttribute("aria-expanded", "true");

      if (!this.hasPlayedMessages) {
        this.playMessages();
      } else {
        this.renderMessagesInstantly();
      }
    }

    close() {
      this.isOpen = false;
      this.panel.classList.add("hidden");
      this.panel.setAttribute("aria-hidden", "true");
      this.button.setAttribute("aria-expanded", "false");
      this.button.focus();
    }

    // ------------------------------------------------------------------
    // 메시지 렌더링
    // ------------------------------------------------------------------
    async playMessages() {
      this.hasPlayedMessages = true;
      this.messageList.innerHTML = "";

      for (const review of REVIEWS) {
        const typingEl = this.createTypingIndicator();
        this.messageList.appendChild(typingEl);
        this.scrollToBottom();

        await this.wait(TYPING_DURATION_MS);

        typingEl.remove();
        this.messageList.appendChild(this.createBubble(review));
        this.scrollToBottom();
      }

      this.messageList.appendChild(this.createFooterNote());
      this.scrollToBottom();
    }

    renderMessagesInstantly() {
      this.messageList.innerHTML = "";
      REVIEWS.forEach((review) => {
        this.messageList.appendChild(this.createBubble(review));
      });
      this.messageList.appendChild(this.createFooterNote());
      this.scrollToBottom();
    }

    createBubble(review) {
      const bubble = document.createElement("div");
      bubble.className = "companion-widget-bubble";

      const text = document.createElement("div");
      text.className = "companion-widget-bubble-text";
      text.textContent = review.text;

      const from = document.createElement("div");
      from.className = "companion-widget-bubble-from";
      from.textContent = `- ${review.from}`;

      bubble.appendChild(text);
      bubble.appendChild(from);
      return bubble;
    }

    createTypingIndicator() {
      const typing = document.createElement("div");
      typing.className = "companion-widget-typing";
      typing.innerHTML = "<span></span><span></span><span></span>";
      return typing;
    }

    createFooterNote() {
      const note = document.createElement("button");
      note.type = "button";
      note.className = "companion-widget-footer-note";
      note.textContent = "더 궁금하다면 자기소개를 읽어 보세요";
      note.addEventListener("click", () => {
        // 기존 앱의 파일 열기 함수(PortfolioApp#openFile)를 그대로 재사용.
        // app.js의 전역 인스턴스는 `let app`으로 선언돼 window.app이 아니므로 식별자로 직접 참조한다.
        if (
          typeof app !== "undefined" &&
          app &&
          typeof app.openFile === "function"
        ) {
          app.openFile("intro");
        }
        this.close();
      });
      return note;
    }

    scrollToBottom() {
      this.messageList.scrollTop = this.messageList.scrollHeight;
    }

    wait(ms) {
      return new Promise((resolve) => window.setTimeout(resolve, ms));
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    new CompanionReviewWidget();
  });
})();
