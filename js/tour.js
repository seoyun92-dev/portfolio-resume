/* ============================================================================
   첫 방문자용 인터랙티브 투어 (스포트라이트)
   - 기존 포트폴리오 앱(js/app.js)과 위젯(js/widget.js)은 전혀 수정하지 않고,
     이 파일만 추가로 동작한다(js/widget.js와 동일한 자기완결 패턴).
   - 모바일에서는 전역 app 인스턴스(window.app이 아닌 전역 `app` 식별자)의
     openMobileSidebar/closeMobileSidebar를 재사용해 사이드바를 직접 열고 닫는다.
   ============================================================================ */

(function () {
  const TOUR_SEEN_KEY = "tourSeen";
  const AUTO_START_DELAY_MS = 900;
  const MOBILE_BREAKPOINT = 768;

  // localStorage는 프라이빗 모드 등에서 접근이 막힐 수 있으므로 항상 try/catch로 감싼다
  function hasSeenTour() {
    try {
      return localStorage.getItem(TOUR_SEEN_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function markTourSeen() {
    try {
      localStorage.setItem(TOUR_SEEN_KEY, "true");
    } catch (e) {
      // 저장에 실패해도 투어 동작 자체에는 영향 없음 (다음 방문에서 다시 뜰 뿐)
    }
  }

  // 모바일 사이드바 열기/닫기는 PortfolioApp(js/app.js)의 전역 인스턴스 `app`을 그대로 재사용한다.
  // widget.js가 app.openFile을 재사용하는 것과 같은 방식 — app이 없거나 메서드가 없어도 조용히 무시.
  function withMobileSidebar(methodName, { instant = false } = {}) {
    return function () {
      if (window.innerWidth > MOBILE_BREAKPOINT) return;
      if (
        typeof app !== "undefined" &&
        app &&
        typeof app[methodName] === "function"
      ) {
        const sidebar = instant ? document.querySelector("#sidebar") : null;
        if (!sidebar) {
          app[methodName]();
          return;
        }

        // 사이드바를 열자마자(onEnter) showStep이 곧바로 가시성을 판정하는데,
        // 0.3s transform 트랜지션이 아직 시작 전이라 "화면 밖"으로 오판되어
        // 1번 스텝이 스킵되는 레이스가 있었다. 트랜지션을 잠깐 끄고 즉시
        // 최종 위치로 스냅시킨 뒤, 다음 프레임에 복원해 레이스를 없앤다.
        const prevTransition = sidebar.style.transition;
        sidebar.style.transition = "none";
        app[methodName]();
        void sidebar.offsetHeight;
        requestAnimationFrame(() => {
          sidebar.style.transition = prevTransition;
        });
      }
    };
  }

  const STEPS = [
    {
      selector: "#sidebar",
      title: "탐색기",
      text: "왼쪽은 탐색기예요. 파일은 여기서 열어요.",
      onEnter: withMobileSidebar("openMobileSidebar", { instant: true }),
      onExit: withMobileSidebar("closeMobileSidebar"),
    },
    {
      selector: "#tabBar",
      title: "탭",
      text: "연 파일은 탭으로 쌓여요. 익숙하죠?",
    },
    {
      selector: "#statusViewMode",
      title: "Code / Preview",
      text: "여길 누르면 Preview ↔ 가상 Java 코드 뷰를 전환해요.",
    },
    {
      selector: "#themeToggle",
      title: "테마",
      text: "다크 ↔ 라이트 전환이에요. Ctrl+Shift+T로도 돼요.",
    },
    {
      selector: ".status-bar",
      title: "상태바",
      text: "경로·인코딩·커서 위치, 하단에서 바로 확인하세요.",
    },
    {
      selector: ".companion-widget-button",
      title: "동료들의 한마디",
      text: "눌러보면 같이 일한 분들 얘기를 들려드려요.",
    },
  ];

  // display:none/visibility:hidden/opacity:0은 물론, 모바일에서 transform으로
  // 화면 밖에 걸쳐 있는 경우(예: 닫힌 사이드바)처럼 뷰포트와 전혀 겹치지 않는 경우까지 걸러낸다.
  function isElementVisible(el) {
    if (!el || !el.isConnected) return false;

    const style = window.getComputedStyle(el);
    if (
      style.display === "none" ||
      style.visibility === "hidden" ||
      parseFloat(style.opacity) === 0
    ) {
      return false;
    }

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return false;
    if (rect.bottom <= 0 || rect.right <= 0) return false;
    if (rect.top >= window.innerHeight || rect.left >= window.innerWidth) {
      return false;
    }

    return true;
  }

  class SpotlightTour {
    constructor(steps) {
      this.steps = steps;
      this.currentIndex = -1;
      this.active = false;
      this.root = null;
    }

    start() {
      if (this.active) return;
      this.active = true;
      this.buildMarkup();
      this.bindEvents();
      this.showStep(0);
    }

    // index부터 시작해 실제로 보여줄 수 있는 첫 단계를 찾는다.
    // 중간에 보이지 않는 단계는 onEnter/onExit을 한 번씩만 호출하고 건너뛴다.
    showStep(index) {
      while (index < this.steps.length) {
        const step = this.steps[index];
        if (typeof step.onEnter === "function") step.onEnter();

        const target = document.querySelector(step.selector);
        if (target && isElementVisible(target)) {
          this.currentIndex = index;
          this.renderStep(step, target);
          return;
        }

        if (typeof step.onExit === "function") step.onExit();
        index += 1;
      }

      // 더 보여줄 단계가 없음
      this.end({ markSeen: true });
    }

    next() {
      if (!this.active) return;
      const current = this.steps[this.currentIndex];
      if (current && typeof current.onExit === "function") current.onExit();
      this.showStep(this.currentIndex + 1);
    }

    skip() {
      if (!this.active) return;
      const current = this.steps[this.currentIndex];
      if (current && typeof current.onExit === "function") current.onExit();
      this.end({ markSeen: true });
    }

    end({ markSeen }) {
      if (!this.active) return;
      this.active = false;
      this.currentIndex = -1;
      this.unbindEvents();
      this.teardownMarkup();
      if (markSeen) markTourSeen();
    }

    // ------------------------------------------------------------------
    // 렌더링
    // ------------------------------------------------------------------
    buildMarkup() {
      this.root = document.createElement("div");
      this.root.className = "tour-root";
      this.root.innerHTML = `
        <div class="tour-spotlight"></div>
        <div class="tour-tooltip" role="dialog" aria-live="polite" aria-label="인터랙티브 투어">
          <div class="tour-tooltip-header">
            <span class="tour-tooltip-step"></span>
            <span class="tour-tooltip-title"></span>
          </div>
          <p class="tour-tooltip-text"></p>
          <div class="tour-tooltip-actions">
            <button type="button" class="tour-btn tour-btn-skip">건너뛰기</button>
            <button type="button" class="tour-btn tour-btn-next">다음</button>
          </div>
        </div>
      `;
      document.body.appendChild(this.root);

      this.spotlight = this.root.querySelector(".tour-spotlight");
      this.tooltip = this.root.querySelector(".tour-tooltip");
      this.stepLabel = this.root.querySelector(".tour-tooltip-step");
      this.titleEl = this.root.querySelector(".tour-tooltip-title");
      this.textEl = this.root.querySelector(".tour-tooltip-text");
      this.skipBtn = this.root.querySelector(".tour-btn-skip");
      this.nextBtn = this.root.querySelector(".tour-btn-next");
    }

    teardownMarkup() {
      if (this.root) {
        this.root.remove();
        this.root = null;
      }
    }

    bindEvents() {
      this._onNextClick = () => this.next();
      this._onSkipClick = () => this.skip();
      this._onKeydown = (e) => {
        if (e.key === "Escape") this.skip();
      };
      this._onResize = () => this.handleResize();

      this.nextBtn.addEventListener("click", this._onNextClick);
      this.skipBtn.addEventListener("click", this._onSkipClick);
      document.addEventListener("keydown", this._onKeydown);
      window.addEventListener("resize", this._onResize);
    }

    unbindEvents() {
      if (this.nextBtn) this.nextBtn.removeEventListener("click", this._onNextClick);
      if (this.skipBtn) this.skipBtn.removeEventListener("click", this._onSkipClick);
      document.removeEventListener("keydown", this._onKeydown);
      window.removeEventListener("resize", this._onResize);
    }

    renderStep(step, target) {
      this.updateTooltipContent(step);

      target.scrollIntoView({ block: "center", inline: "nearest" });
      const rect = target.getBoundingClientRect();
      this.positionSpotlight(rect);
      this.positionTooltip(rect);
    }

    updateTooltipContent(step) {
      this.stepLabel.textContent = `${this.currentIndex + 1} / ${this.steps.length}`;
      this.titleEl.textContent = step.title;
      this.textEl.textContent = step.text;
      this.nextBtn.textContent =
        this.currentIndex === this.steps.length - 1 ? "완료" : "다음";
    }

    positionSpotlight(rect) {
      const pad = 6;
      this.spotlight.style.top = `${rect.top - pad}px`;
      this.spotlight.style.left = `${rect.left - pad}px`;
      this.spotlight.style.width = `${rect.width + pad * 2}px`;
      this.spotlight.style.height = `${rect.height + pad * 2}px`;
    }

    positionTooltip(rect) {
      const isMobile = window.innerWidth <= MOBILE_BREAKPOINT;
      this.tooltip.classList.toggle("tour-tooltip-center", isMobile);

      if (isMobile) {
        // 모바일에서는 대상 요소 위치와 무관하게 항상 화면 중앙에 띄운다(하단 요소를
        // 가리키는 경우 바로 옆/아래에 붙이면 스포트라이트 대상을 덮어버리기 때문).
        // 중앙 배치는 CSS(.tour-tooltip-center)가 전담하므로 인라인 위치값을 지운다.
        this.tooltip.style.top = "";
        this.tooltip.style.left = "";
        return;
      }

      const gap = 14;
      const margin = 10;
      const tooltipRect = this.tooltip.getBoundingClientRect();

      let top = rect.bottom + gap;
      if (top + tooltipRect.height > window.innerHeight - margin) {
        top = rect.top - tooltipRect.height - gap;
      }
      if (top < margin) top = margin;

      let left = rect.left;
      if (left + tooltipRect.width > window.innerWidth - margin) {
        left = window.innerWidth - tooltipRect.width - margin;
      }
      if (left < margin) left = margin;

      this.tooltip.style.top = `${top}px`;
      this.tooltip.style.left = `${left}px`;
    }

    handleResize() {
      if (!this.active || this.currentIndex < 0) return;
      const step = this.steps[this.currentIndex];
      const target = document.querySelector(step.selector);
      if (!target) return;

      const rect = target.getBoundingClientRect();
      this.positionSpotlight(rect);
      this.positionTooltip(rect);
    }
  }

  function createReplayTrigger(tour) {
    const statusRight = document.querySelector(".status-right");
    if (!statusRight) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "status-item tour-replay-btn";
    btn.textContent = "🧭 투어 다시 보기";
    btn.addEventListener("click", () => tour.start());

    statusRight.prepend(btn);
  }

  document.addEventListener("DOMContentLoaded", () => {
    const tour = new SpotlightTour(STEPS);
    createReplayTrigger(tour);

    if (!hasSeenTour()) {
      window.setTimeout(() => tour.start(), AUTO_START_DELAY_MS);
    }
  });
})();
