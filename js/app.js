/* ============================================================================
   포트폴리오 애플리케이션 로직
   ============================================================================ */

class PortfolioApp {
  constructor() {
    // DOM 요소
    this.fileTree = document.getElementById("fileTree");
    this.tabBar = document.getElementById("tabBar");
    this.editorView = document.getElementById("editorView");
    this.themeToggle = document.getElementById("themeToggle");
    this.searchModal = document.getElementById("searchModal");
    this.searchInput = document.getElementById("searchInput");
    this.searchResults = document.getElementById("searchResults");
    this.sidebar = document.getElementById("sidebar");
    this.sidebarToggle = document.getElementById("sidebarToggle");
    this.mobileMenuToggle = document.getElementById("mobileMenuToggle");
    this.sidebarOverlay = document.getElementById("sidebarOverlay");
    this.statusPath = document.getElementById("statusPath");
    this.statusViewMode = document.getElementById("statusViewMode");
    this.toastContainer = document.getElementById("toastContainer");

    // 상태
    this.openTabs = [];
    this.activeTab = null;
    this.viewMode = "preview"; // "preview" 또는 "code"
    // 처음 열었을 때는 모든 폴더를 펼쳐서 보여준다
    this.expandedFolders = new Set(this.collectFolderNames(portfolio.tree));

    // 초기화
    this.init();
  }

  init() {
    this.loadTheme();
    this.renderTree();
    this.attachEventListeners();

    // 기본으로 시작하기 파일 열기
    this.openFile("start");
  }

  // ========================================================================
  // 테마 관리
  // ========================================================================

  loadTheme() {
    try {
      const saved = localStorage.getItem("theme") || "dark";
      document.documentElement.setAttribute("data-theme", saved);
      this.updateThemeToggleIcon(saved);
    } catch (e) {
      console.warn("localStorage 접근 실패, 기본 테마 사용");
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }

  toggleTheme() {
    const current =
      document.documentElement.getAttribute("data-theme") || "dark";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);

    try {
      localStorage.setItem("theme", next);
    } catch (e) {
      console.warn("localStorage 저장 실패");
    }

    this.updateThemeToggleIcon(next);
  }

  updateThemeToggleIcon(theme) {
    this.themeToggle.querySelector(".icon").textContent =
      theme === "dark" ? "☀️" : "🌙";
  }

  // ========================================================================
  // 파일 트리 렌더링
  // ========================================================================

  renderTree() {
    this.fileTree.innerHTML = "";
    portfolio.tree.forEach((item) => {
      this.renderTreeItem(item, this.fileTree, "");
    });
    this.updateFileTreeActive();
  }

  // 트리 안의 모든 폴더명을 재귀적으로 모은다(초기 전체 펼침용)
  collectFolderNames(items) {
    const names = [];
    items.forEach((item) => {
      if (item.type === "folder") {
        names.push(item.name);
        if (item.children) {
          names.push(...this.collectFolderNames(item.children));
        }
      }
    });
    return names;
  }

  renderTreeItem(item, parentElement, path) {
    const li = document.createElement("li");
    li.className = "tree-item";
    li.dataset.id = item.id || item.name;

    const div = document.createElement("div");
    div.className = "tree-item-content";

    if (item.type === "folder") {
      // 폴더
      const toggle = document.createElement("button");
      toggle.className = "tree-toggle";
      toggle.innerHTML = this.expandedFolders.has(item.name) ? "▼" : "▶";
      toggle.addEventListener("click", (e) => {
        e.stopPropagation();
        this.toggleFolder(item.name);
        this.renderTree();
      });

      const icon = document.createElement("span");
      icon.className = "tree-icon";
      icon.textContent = "📁";

      const label = document.createElement("span");
      label.className = "tree-label";
      label.textContent = item.name;

      div.appendChild(toggle);
      div.appendChild(icon);
      div.appendChild(label);
      li.appendChild(div);

      // 폴더명 영역을 클릭해도 토글 버튼과 동일하게 펼침/접기 (토글 버튼 클릭은 stopPropagation으로 중복 방지)
      div.addEventListener("click", () => {
        this.toggleFolder(item.name);
        this.renderTree();
      });

      // 자식 요소
      if (this.expandedFolders.has(item.name) && item.children) {
        const ul = document.createElement("ul");
        ul.className = "tree-children";
        item.children.forEach((child) => {
          this.renderTreeItem(child, ul, item.name);
        });
        li.appendChild(ul);
      }
    } else {
      // 파일
      const toggle = document.createElement("button");
      toggle.className = "tree-toggle";
      toggle.style.opacity = "0"; // 토글 자리 차지하지만 보이지 않음
      toggle.disabled = true;

      const icon = document.createElement("span");
      icon.className = "tree-icon";
      icon.textContent = this.getFileIcon(item.name, item.id);

      const label = document.createElement("span");
      label.className = "tree-label";
      label.textContent = item.name;

      div.appendChild(toggle);
      div.appendChild(icon);
      div.appendChild(label);

      div.addEventListener("click", () => this.openFile(item.id));

      li.appendChild(div);
    }

    parentElement.appendChild(li);
  }

  toggleFolder(folderName) {
    if (this.expandedFolders.has(folderName)) {
      this.expandedFolders.delete(folderName);
    } else {
      this.expandedFolders.add(folderName);
    }
  }

  getFileIcon(filename, fileId) {
    // 임의의 회사명.md는 파일명 키워드로 구분할 수 없으므로, 트리 경로로 "경력" 하위인지 먼저 판별한다
    if (fileId) {
      const path = getFilePathInTree(fileId);
      if (path && path.includes("경력/")) return "🏢";
    }
    if (filename.includes("시작")) return "🏠";
    if (filename.includes("자기")) return "👤";
    if (filename.includes("프로젝트")) return "📦";
    if (filename.includes("기술")) return "🛠";
    if (filename.includes("학력")) return "🎓";
    if (filename.includes("연락")) return "📞";
    return "📄";
  }

  // ========================================================================
  // 파일 열기 / 탭 관리
  // ========================================================================

  openFile(fileId) {
    // 이미 열려있는지 확인
    const existing = this.openTabs.find((t) => t.id === fileId);
    if (existing) {
      this.setActiveTab(fileId);
    } else {
      const file = getFile(fileId);
      if (!file) return;

      this.openTabs.push({
        id: fileId,
        name: file.name,
      });

      this.setActiveTab(fileId);
    }

    this.renderTabs();
    this.renderContent();
    this.updateFileTreeActive();
  }

  closeTab(fileId) {
    this.openTabs = this.openTabs.filter((t) => t.id !== fileId);

    if (this.activeTab === fileId) {
      this.activeTab = this.openTabs[this.openTabs.length - 1]?.id || null;
    }

    this.renderTabs();
    if (this.activeTab) {
      this.renderContent();
    } else {
      this.editorView.innerHTML =
        '<div class="welcome-message"><p>파일을 선택하여 시작하세요</p></div>';
    }
    this.updateFileTreeActive();
  }

  setActiveTab(fileId) {
    this.activeTab = fileId;
  }

  // ========================================================================
  // 탭바 렌더링
  // ========================================================================

  renderTabs() {
    this.tabBar.innerHTML = "";

    this.openTabs.forEach((tab) => {
      const tabEl = document.createElement("div");
      tabEl.className = `tab ${tab.id === this.activeTab ? "active" : ""}`;
      tabEl.addEventListener(
        "click",
        () => this.setActiveTab(tab.id) || this.renderContent(),
      );

      const icon = document.createElement("span");
      icon.className = "tab-icon";
      icon.textContent = this.getFileIcon(tab.name, tab.id);

      const label = document.createElement("span");
      label.className = "tab-label";
      label.textContent = tab.name;

      const closeBtn = document.createElement("button");
      closeBtn.className = "tab-close";
      closeBtn.textContent = "✕";
      closeBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        this.closeTab(tab.id);
      });

      tabEl.appendChild(icon);
      tabEl.appendChild(label);
      tabEl.appendChild(closeBtn);
      this.tabBar.appendChild(tabEl);
    });
  }

  updateFileTreeActive() {
    const items = this.fileTree.querySelectorAll(".tree-item-content");
    items.forEach((item) => {
      item.classList.remove("active");
    });

    const activeLi = this.fileTree.querySelector(`li[data-id="${this.activeTab}"]`);
    const activeContent = activeLi
      ? activeLi.querySelector(".tree-item-content")
      : null;
    if (activeContent) {
      activeContent.classList.add("active");
    }
  }

  // ========================================================================
  // 콘텐츠 렌더링 (Preview / Code)
  // ========================================================================

  renderContent() {
    if (!this.activeTab) {
      this.editorView.innerHTML =
        '<div class="welcome-message"><p>파일을 선택하여 시작하세요</p></div>';
      return;
    }

    const file = getFile(this.activeTab);
    if (!file) return;

    // 상태바 업데이트
    this.statusPath.textContent = file.path || "";
    this.statusViewMode.textContent =
      this.viewMode === "preview" ? "Preview" : "Code";

    if (this.viewMode === "preview") {
      this.renderPreview(file);
    } else {
      this.renderCode(file);
    }
  }

  renderPreview(file) {
    const div = document.createElement("div");
    div.className = "content-view";

    if (!file.sections || !Array.isArray(file.sections)) {
      div.textContent = "콘텐츠 없음";
      this.editorView.innerHTML = "";
      this.editorView.appendChild(div);
      return;
    }

    file.sections.forEach((section) => {
      const el = this.renderSection(section);
      if (el) div.appendChild(el);
    });

    this.editorView.innerHTML = "";
    this.editorView.appendChild(div);

    // 카드 클릭 이벤트
    this.editorView.querySelectorAll(".card").forEach((card) => {
      const fileId = card.dataset.fileId;
      if (fileId && fileId !== "null") {
        card.addEventListener("click", () => this.openFile(fileId));
        card.style.cursor = "pointer";
      }

      // PDF 다운로드 버튼
      if (card.dataset.isPdf) {
        card.addEventListener("click", (e) => this.downloadPdf(e.currentTarget));
      }
    });

    // 버튼 클릭 이벤트
    this.editorView.querySelectorAll(".view-button").forEach((btn) => {
      if (btn.dataset.isPdf) {
        btn.addEventListener("click", (e) => this.downloadPdf(e.currentTarget));
      }
    });

    // 프로필 아바타 크기를 옆 리스트 높이에 맞춤
    this.editorView.querySelectorAll(".profile-section").forEach((section) => {
      const avatar = section.querySelector(".profile-avatar");
      if (!avatar) return;

      if (avatar.complete) {
        this.syncProfileAvatarSize(section);
      } else {
        avatar.addEventListener(
          "load",
          () => this.syncProfileAvatarSize(section),
          { once: true },
        );
      }
    });
  }

  // 리스트의 실제 렌더링 높이를 측정해 아바타의 width/height에 그대로 적용한다(1:1 비율 유지).
  // CSS의 align-items:stretch + aspect-ratio만으로는 리스트 폭이 줄고(→ 줄바꿈 증가 → 높이 증가)
  // 아바타가 다시 커지는 순환 피드백이 발생해, 측정값을 직접 대입하는 방식으로 처리한다.
  syncProfileAvatarSize(section) {
    const avatar = section.querySelector(".profile-avatar");
    const list = section.querySelector("ul");
    if (!avatar || !list) return;

    // 모바일(세로 배치)에서는 CSS의 고정 크기를 그대로 쓰도록 인라인 스타일을 비운다
    if (window.innerWidth <= 480) {
      avatar.style.width = "";
      avatar.style.height = "";
      return;
    }

    const listHeight = list.offsetHeight;
    if (listHeight > 0) {
      avatar.style.width = `${listHeight}px`;
      avatar.style.height = `${listHeight}px`;
    }
  }

  renderDevelopmentDetail(text) {
    const list = document.createElement("div");
    list.className = "year-dev-list";

    let currentItem = null;

    const ensureItem = () => {
      const item = document.createElement("div");
      item.className = "year-dev-item";
      list.appendChild(item);
      return item;
    };

    text.split("\n").forEach((rawLine) => {
      const trimmed = rawLine.replace(/^[\s ]+/, "");
      if (!trimmed) return;

      if (trimmed.startsWith("- ")) {
        currentItem = ensureItem();
        const title = document.createElement("div");
        title.className = "year-dev-title";
        title.textContent = trimmed.slice(2);
        currentItem.appendChild(title);
      } else if (trimmed.startsWith(":")) {
        if (!currentItem) currentItem = ensureItem();
        const detail = document.createElement("div");
        detail.className = "year-dev-detail";
        detail.textContent = trimmed.slice(1).trim();
        currentItem.appendChild(detail);
      } else {
        if (!currentItem) currentItem = ensureItem();
        const plain = document.createElement("div");
        plain.className = "year-dev-detail";
        plain.textContent = trimmed;
        currentItem.appendChild(plain);
      }
    });

    return list;
  }

  renderSection(section) {
    const container = document.createElement("div");

    switch (section.type) {
      case "heading":
        const h = document.createElement(`h${section.level || 1}`);
        h.textContent = section.content;
        return h;

      case "paragraph":
        const p = document.createElement("p");
        p.textContent = section.content;
        return p;

      case "note": {
        const note = document.createElement("p");
        note.className = "content-note";
        note.textContent = section.content;
        return note;
      }

      case "list":
        const ul = document.createElement("ul");
        (section.items || []).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          ul.appendChild(li);
        });
        return ul;

      case "detail-list": {
        const wrapper = document.createElement("div");
        wrapper.className = "detail-list";

        (section.items || []).forEach((item) => {
          const entry = document.createElement("div");
          entry.className = "detail-list-item";

          const title = document.createElement("div");
          title.className = "detail-list-title";
          title.textContent = item.title;

          const detail = document.createElement("div");
          detail.className = "detail-list-detail";
          detail.textContent = item.detail;

          entry.appendChild(title);
          entry.appendChild(detail);
          wrapper.appendChild(entry);
        });

        return wrapper;
      }

      case "profile": {
        const wrapper = document.createElement("div");
        wrapper.className = "profile-section";

        if (section.avatar) {
          const avatar = document.createElement("img");
          avatar.className = "profile-avatar";
          avatar.src = section.avatar;
          avatar.alt = section.avatarAlt || "프로필 아바타";
          wrapper.appendChild(avatar);
        }

        const infoList = document.createElement("ul");
        (section.items || []).forEach((item) => {
          const li = document.createElement("li");
          li.textContent = item;
          infoList.appendChild(li);
        });
        wrapper.appendChild(infoList);

        return wrapper;
      }

      case "table":
        const tableWrapper = document.createElement("div");
        tableWrapper.className = "table-wrapper";
        const table = document.createElement("table");

        if (section.headers) {
          const thead = document.createElement("thead");
          const tr = document.createElement("tr");
          section.headers.forEach((h) => {
            const th = document.createElement("th");
            th.textContent = h;
            tr.appendChild(th);
          });
          thead.appendChild(tr);
          table.appendChild(thead);
        }

        if (section.rows) {
          const tbody = document.createElement("tbody");
          section.rows.forEach((row) => {
            const tr = document.createElement("tr");
            row.forEach((cell) => {
              const td = document.createElement("td");
              td.textContent = cell;
              tr.appendChild(td);
            });
            tbody.appendChild(tr);
          });
          table.appendChild(tbody);
        }

        tableWrapper.appendChild(table);
        return tableWrapper;

      case "cards":
        const cardsDiv = document.createElement("div");
        cardsDiv.className = "card-container";

        (section.items || []).forEach((item) => {
          const card = document.createElement("div");
          card.className = "card";
          card.dataset.fileId = item.fileId || "null";
          if (item.isPdf) card.dataset.isPdf = "true";

          const title = document.createElement("div");
          title.className = "card-title";
          title.textContent = item.title;

          const desc = document.createElement("div");
          desc.className = "card-desc";
          desc.textContent = item.description;

          card.appendChild(title);
          card.appendChild(desc);
          cardsDiv.appendChild(card);
        });

        return cardsDiv;

      case "tags":
        const tagsDiv = document.createElement("div");
        tagsDiv.className = "tag-container";

        (section.items || []).forEach((tag) => {
          const tagEl = document.createElement("span");
          tagEl.className = "tag";
          tagEl.textContent = tag;
          tagsDiv.appendChild(tagEl);
        });

        return tagsDiv;

      case "tag-groups": {
        const wrapper = document.createElement("div");
        wrapper.className = "tag-group-list";

        (section.items || []).forEach((group) => {
          const groupDiv = document.createElement("div");
          groupDiv.className = "tag-group";

          const label = document.createElement("div");
          label.className = "tag-group-label";
          label.textContent = group.category;

          const groupTagsDiv = document.createElement("div");
          groupTagsDiv.className = "tag-container";
          (group.tags || []).forEach((tag) => {
            const tagEl = document.createElement("span");
            tagEl.className = "tag";
            tagEl.textContent = tag;
            groupTagsDiv.appendChild(tagEl);
          });

          groupDiv.appendChild(label);
          groupDiv.appendChild(groupTagsDiv);
          wrapper.appendChild(groupDiv);
        });

        return wrapper;
      }

      case "year-cards": {
        const list = document.createElement("div");
        list.className = "year-card-list";

        // 연도 내림차순(최신순) 정렬 — 데이터 입력 순서에 의존하지 않는다
        const sorted = [...(section.items || [])].sort(
          (a, b) => (b.year || 0) - (a.year || 0),
        );

        sorted.forEach((item, idx) => {
          const expanded = idx < 3; // 최신 3개만 기본 펼침

          const card = document.createElement("div");
          card.className = "year-card-item" + (expanded ? " expanded" : "");

          const header = document.createElement("button");
          header.type = "button";
          header.className = "year-card-header";
          header.setAttribute("aria-expanded", String(expanded));
          header.setAttribute("aria-controls", `year-card-body-${idx}`);

          const arrow = document.createElement("span");
          arrow.className = "year-card-arrow";
          arrow.textContent = "▸";

          const yearEl = document.createElement("span");
          yearEl.className = "year-card-year";
          yearEl.textContent = item.year;

          const titleEl = document.createElement("span");
          titleEl.className = "year-card-title";
          titleEl.textContent = item.projectName;

          const periodEl = document.createElement("span");
          periodEl.className = "year-card-period";
          periodEl.textContent = item.period;

          header.appendChild(arrow);
          header.appendChild(yearEl);
          header.appendChild(titleEl);
          header.appendChild(periodEl);

          const body = document.createElement("div");
          body.className = "year-card-body";
          body.id = `year-card-body-${idx}`;

          const dl = document.createElement("dl");
          [
            ["업무", item.development],
            ["성과", item.achievement],
            ["메모", item.memo],
          ].forEach(([fieldLabel, value]) => {
            const dt = document.createElement("dt");
            dt.textContent = fieldLabel;
            const dd = document.createElement("dd");
            if (fieldLabel === "업무") {
              dd.appendChild(this.renderDevelopmentDetail(value || ""));
            } else {
              dd.textContent = value || "";
            }
            dl.appendChild(dt);
            dl.appendChild(dd);
          });
          body.appendChild(dl);

          header.addEventListener("click", () => {
            const isExpanded = header.getAttribute("aria-expanded") === "true";
            header.setAttribute("aria-expanded", String(!isExpanded));
            card.classList.toggle("expanded", !isExpanded);
          });

          card.appendChild(header);
          card.appendChild(body);
          list.appendChild(card);
        });

        return list;
      }

      case "links":
        const linksDiv = document.createElement("div");

        (section.items || []).forEach((link) => {
          const linkEl = document.createElement("p");
          linkEl.className = "contact-link-row";
          const a = document.createElement("a");
          a.href = link.url;
          a.textContent = link.label;
          a.target = "_blank";
          a.rel = "noopener noreferrer";
          a.style.color = "var(--color-accent)";
          a.style.textDecoration = "none";

          a.addEventListener("mouseenter", () => {
            a.style.textDecoration = "underline";
          });
          a.addEventListener("mouseleave", () => {
            a.style.textDecoration = "none";
          });

          linkEl.appendChild(a);

          // mailto 링크는 메일 앱 연결 외에 주소만 복사할 수 있는 버튼도 함께 제공
          if (link.url && link.url.startsWith("mailto:")) {
            const email = link.url.slice("mailto:".length);
            const copyBtn = document.createElement("button");
            copyBtn.type = "button";
            copyBtn.className = "icon-btn copy-email-btn";
            copyBtn.title = "이메일 주소 복사";
            copyBtn.setAttribute("aria-label", "이메일 주소 복사");
            copyBtn.innerHTML = `
              <svg class="icon copy-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="2" y="8" width="14" height="14" rx="2" ry="2"></rect>
                <path d="M20 16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2H10c-1.1 0-2 .9-2 2"></path>
              </svg>
            `;

            copyBtn.addEventListener("click", async (e) => {
              try {
                await navigator.clipboard.writeText(email);
                this.showToastNear(
                  "이메일 주소가 복사되었습니다",
                  "success",
                  e.clientX,
                  e.clientY,
                );
              } catch (err) {
                this.showToastNear(
                  "복사에 실패했습니다. 직접 복사해 주세요.",
                  "warning",
                  e.clientX,
                  e.clientY,
                );
              }
            });

            linkEl.appendChild(copyBtn);
          }

          linksDiv.appendChild(linkEl);
        });

        return linksDiv;

      case "button":
        const btnContainer = document.createElement("p");
        const btn = document.createElement("button");
        btn.className = "view-button";
        btn.textContent = section.content;
        btn.style.padding = "8px 16px";
        btn.style.backgroundColor = "var(--color-accent)";
        btn.style.color = "white";
        btn.style.border = "none";
        btn.style.borderRadius = "4px";
        btn.style.cursor = "pointer";
        btn.style.fontWeight = "600";
        btn.style.fontSize = "13px";

        if (section.isPdf) {
          btn.dataset.isPdf = "true";
        }

        btn.addEventListener("mouseenter", () => {
          btn.style.backgroundColor = "var(--color-accent-hover)";
        });
        btn.addEventListener("mouseleave", () => {
          btn.style.backgroundColor = "var(--color-accent)";
        });

        btnContainer.appendChild(btn);
        return btnContainer;

      default:
        return null;
    }
  }

  renderCode(file) {
    const div = document.createElement("div");
    div.className = "code-view";

    if (!file.sections || !Array.isArray(file.sections)) {
      div.innerHTML = "// 콘텐츠 없음";
      this.editorView.innerHTML = "";
      this.editorView.appendChild(div);
      return;
    }

    const lines = this.generateCodeLines(file);
    let lineNum = 1;

    lines.forEach((content) => {
      const lineEl = document.createElement("div");
      lineEl.className = "code-line";

      const numEl = document.createElement("div");
      numEl.className = "code-line-number";
      numEl.textContent = String(lineNum).padStart(4, " ");

      const codeEl = document.createElement("div");
      codeEl.className = "code-line-content";
      codeEl.innerHTML = this.highlightCode(content);

      lineEl.appendChild(numEl);
      lineEl.appendChild(codeEl);
      div.appendChild(lineEl);

      lineNum++;
    });

    this.editorView.innerHTML = "";
    this.editorView.appendChild(div);
  }

  generateCodeLines(file) {
    const lines = [];
    const filename = file.name.replace(".md", "");
    const classname = this.toJavaClassName(filename);

    lines.push(`/**`);
    lines.push(` * ${filename}`);
    lines.push(` */`);
    lines.push(`public class ${classname} {`);
    lines.push(``);

    if (file.sections && Array.isArray(file.sections)) {
      file.sections.forEach((section, idx) => {
        if (section.type === "heading") {
          lines.push(
            `  // ═══════════════════════════════════════════════════`,
          );
          lines.push(`  // ${section.content}`);
          lines.push(
            `  // ═══════════════════════════════════════════════════`,
          );
          lines.push(``);
        } else if (
          section.type === "paragraph" ||
          section.type === "heading" ||
          section.type === "note"
        ) {
          const content = section.content || "";
          const escaped = content.replace(/"/g, '\\"');
          lines.push(`  private String content${idx} = "${escaped}";`);
        } else if (section.type === "tags" && section.items) {
          const tagList = section.items
            .map((t) => `"${t.replace(/"/g, '\\"')}"`)
            .join(", ");
          lines.push(
            `  private List<String> tags${idx} = Arrays.asList(${tagList});`,
          );
        } else if (section.type === "list" && section.items) {
          lines.push(`  private List<String> items${idx} = Arrays.asList(`);
          section.items.forEach((item, i) => {
            const escaped = item.replace(/"/g, '\\"');
            const comma = i === section.items.length - 1 ? "" : ",";
            lines.push(`    "${escaped}"${comma}`);
          });
          lines.push(`  );`);
        } else if (section.type === "profile" && section.items) {
          if (section.avatar) {
            lines.push(`  private String avatar${idx} = "${section.avatar}";`);
          }
          lines.push(`  private List<String> items${idx} = Arrays.asList(`);
          section.items.forEach((item, i) => {
            const escaped = item.replace(/"/g, '\\"');
            const comma = i === section.items.length - 1 ? "" : ",";
            lines.push(`    "${escaped}"${comma}`);
          });
          lines.push(`  );`);
        } else if (section.type === "detail-list" && section.items) {
          lines.push(
            `  private Map<String, String> tasks${idx} = new LinkedHashMap<>() {{`,
          );
          section.items.forEach((item) => {
            const title = (item.title || "").replace(/"/g, '\\"');
            const detail = (item.detail || "").replace(/"/g, '\\"');
            lines.push(`    put("${title}", "${detail}");`);
          });
          lines.push(`  }};`);
        } else if (section.type === "table" && section.rows) {
          lines.push(
            `  private Map<String, String> table${idx} = new LinkedHashMap<>() {{`,
          );
          section.rows.forEach((row) => {
            const key = (row[0] || "").replace(/"/g, '\\"');
            const value = (row[1] || "").replace(/"/g, '\\"');
            lines.push(`    put("${key}", "${value}");`);
          });
          lines.push(`  }};`);
        } else if (section.type === "tag-groups" && section.items) {
          lines.push(
            `  private Map<String, List<String>> techStack${idx} = new LinkedHashMap<>() {{`,
          );
          section.items.forEach((group) => {
            const category = (group.category || "").replace(/"/g, '\\"');
            const tagList = (group.tags || [])
              .map((t) => `"${t.replace(/"/g, '\\"')}"`)
              .join(", ");
            lines.push(`    put("${category}", Arrays.asList(${tagList}));`);
          });
          lines.push(`  }};`);
        } else if (section.type === "year-cards" && section.items) {
          const sorted = [...section.items].sort(
            (a, b) => (b.year || 0) - (a.year || 0),
          );
          sorted.forEach((item, i) => {
            const dev = (item.development || "").replace(/"/g, '\\"');
            const ach = (item.achievement || "").replace(/"/g, '\\"');
            const memo = (item.memo || "").replace(/"/g, '\\"');
            lines.push(
              `  // [${item.year}] ${item.projectName} (${item.period})`,
            );
            lines.push(`  private String development${idx}_${i} = "${dev}";`);
            lines.push(`  private String achievement${idx}_${i} = "${ach}";`);
            lines.push(`  private String memo${idx}_${i} = "${memo}";`);
          });
        }
      });
    }

    lines.push(``);
    lines.push(`}`);

    return lines;
  }

  toJavaClassName(str) {
    return str
      .replace(/\.md$/, "")
      .split(/[-_·]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join("");
  }

  highlightCode(content) {
    if (!content) return "";

    // HTML 특수문자를 먼저 이스케이프 (XSS 방지 및 <, >, & 깨짐 방지)
    const escaped = content
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    const keywords =
      "public|private|protected|class|interface|enum|synchronized|static|final|native|abstract|throws|volatile|transient|extends|implements|void|boolean|byte|char|short|int|long|float|double|String|List|Arrays|import|package";

    // 문자열 > 주석 > 숫자 > 키워드 순으로 토큰을 한 번에 찾아 치환한다.
    // (순차적으로 replace를 반복하면 앞서 삽입한 <span class="..."> 안의 따옴표가
    //  다음 replace에서 다시 매칭되어 마크업이 깨지므로, 단일 패스로 처리한다)
    const tokenPattern = new RegExp(
      `("[^"]*")|(//.*$)|(\\b\\d+\\b)|(\\b(?:${keywords})\\b)`,
      "gm",
    );

    return escaped.replace(
      tokenPattern,
      (match, str, comment, num, keyword) => {
        if (str !== undefined) return `<span class="code-string">${str}</span>`;
        if (comment !== undefined)
          return `<span class="code-comment">${comment}</span>`;
        if (num !== undefined) return `<span class="code-number">${num}</span>`;
        if (keyword !== undefined)
          return `<span class="code-keyword">${keyword}</span>`;
        return match;
      },
    );
  }

  // ========================================================================
  // 검색
  // ========================================================================

  openSearchModal() {
    this.searchModal.classList.remove("hidden");
    this.searchInput.focus();
    this.searchInput.value = "";
    this.searchResults.innerHTML = "";
  }

  closeSearchModal() {
    this.searchModal.classList.add("hidden");
    this.searchInput.value = "";
    this.searchResults.innerHTML = "";
  }

  performSearch(query) {
    const lowerQuery = query.toLowerCase();
    const results = [];

    getAllFiles().forEach(({ id, name, file }) => {
      let score = 0;
      const fullText = getFileFullText(id);

      if (name.toLowerCase().includes(lowerQuery)) {
        score += 100; // 파일명 매칭
      }

      if (fullText.toLowerCase().includes(lowerQuery)) {
        score += 10; // 본문 매칭
      }

      if (score > 0) {
        // 본문에서 쿼리 주변 텍스트 추출
        const idx = fullText.toLowerCase().indexOf(lowerQuery);
        let preview = "";
        if (idx !== -1) {
          const start = Math.max(0, idx - 30);
          const end = Math.min(fullText.length, idx + query.length + 30);
          preview = fullText.substring(start, end);
          if (start > 0) preview = "..." + preview;
          if (end < fullText.length) preview = preview + "...";
        }

        results.push({
          id,
          name,
          preview,
          score,
        });
      }
    });

    results.sort((a, b) => b.score - a.score);
    return results.slice(0, 10);
  }

  renderSearchResults(results) {
    this.searchResults.innerHTML = "";

    if (results.length === 0) {
      const empty = document.createElement("div");
      empty.className = "search-result-empty";
      empty.textContent = "검색 결과 없음";
      this.searchResults.appendChild(empty);
      return;
    }

    results.forEach((result, idx) => {
      const item = document.createElement("div");
      item.className = "search-result-item";
      item.dataset.index = idx;

      const file = document.createElement("div");
      file.className = "search-result-file";
      file.textContent = result.name;

      const preview = document.createElement("div");
      preview.className = "search-result-preview";
      preview.textContent = result.preview || "파일";

      item.appendChild(file);
      if (result.preview) item.appendChild(preview);

      item.addEventListener("click", () => {
        this.openFile(result.id);
        this.closeSearchModal();
      });

      this.searchResults.appendChild(item);
    });

    this.highlightSearchResult(0);
  }

  highlightSearchResult(idx) {
    const items = this.searchResults.querySelectorAll(".search-result-item");
    items.forEach((item, i) => {
      item.classList.toggle("highlighted", i === idx);
    });
  }

  // ========================================================================
  // PDF 다운로드 (자기소개/경력/기술스택/학력·자격을 이어붙여 브라우저 인쇄로 저장)
  // ========================================================================

  downloadPdf(triggerEl) {
    if (window.innerWidth <= 768) {
      if (triggerEl) {
        const rect = triggerEl.getBoundingClientRect();
        this.showToastNear(
          "PDF 저장은 PC에서 시도해 주세요",
          "warning",
          rect.left + rect.width / 2,
          rect.top,
        );
      } else {
        this.showToast("PDF 저장은 PC에서 시도해 주세요", "warning");
      }
      return;
    }

    const printResume = this.getOrBuildPrintResume();
    const avatar = printResume.querySelector(".profile-avatar");

    const proceed = () => {
      this.syncProfileAvatarSize(
        printResume.querySelector(".profile-section"),
      );
      this.triggerResumePrint();
    };

    if (avatar && !avatar.complete) {
      avatar.addEventListener("load", proceed, { once: true });
    } else {
      proceed();
    }
  }

  // 인쇄 전용 콘텐츠는 한 번만 만들어 재사용한다(데이터가 정적이라 매번 다시 만들 필요 없음)
  getOrBuildPrintResume() {
    const existing = document.getElementById("printResume");
    if (existing) return existing;

    const container = document.createElement("div");
    container.id = "printResume";
    container.className = "content-view";

    const header = document.createElement("div");
    header.className = "print-header";

    const nameEl = document.createElement("div");
    nameEl.className = "print-header-name";
    nameEl.textContent = "박서윤 이력서";
    header.appendChild(nameEl);

    const email = this.getContactEmail();
    if (email) {
      const emailEl = document.createElement("div");
      emailEl.className = "print-header-email";
      emailEl.textContent = email;
      header.appendChild(emailEl);
    }

    container.appendChild(header);

    ["intro", "career_a", "career_b", "skills", "edu"].forEach((fileId) => {
      const file = getFile(fileId);
      if (!file || !Array.isArray(file.sections)) return;

      file.sections.forEach((section) => {
        const el = this.renderSection(section);
        if (el) container.appendChild(el);
      });
    });

    document.body.appendChild(container);
    return container;
  }

  // 연락처.md의 links 섹션에서 이메일을 읽어온다(데이터 이중 관리 방지)
  getContactEmail() {
    const contact = getFile("contact");
    if (!contact || !Array.isArray(contact.sections)) return "";

    const linksSection = contact.sections.find(
      (section) => section.type === "links",
    );
    const url = linksSection?.items?.[0]?.url;
    if (!url) return "";

    return url.startsWith("mailto:") ? url.slice("mailto:".length) : url;
  }

  triggerResumePrint() {
    this.showPrintNotice(
      "인쇄 대화상자에서 '대상'을 PDF로 저장으로 선택해 주세요",
    );

    const originalTitle = document.title;
    document.title = "박서윤_이력서";
    window.addEventListener(
      "afterprint",
      () => {
        document.title = originalTitle;
      },
      { once: true },
    );

    // 안내 배너를 읽을 시간을 준 뒤 인쇄 대화상자를 연다(바로 열면 화면을 덮어 안내가 안 보임)
    window.setTimeout(() => {
      window.print();
    }, 700);
  }

  // 화면 상단 중앙에 짧게 떴다 사라지는 인쇄 안내 배너
  showPrintNotice(message) {
    const notice = document.createElement("div");
    notice.className = "print-notice";
    notice.textContent = message;

    document.body.appendChild(notice);

    window.setTimeout(() => {
      notice.remove();
    }, 2500);
  }

  // ========================================================================
  // 토스트 알림
  // ========================================================================

  showToast(message, type = "info") {
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.textContent = message;

    this.toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 3000);
  }

  // 클릭 지점(커서) 근처에 바로 눈에 띄는 짧은 토스트를 띄운다 (예: 복사 버튼 피드백)
  showToastNear(message, type = "info", x, y) {
    const toast = document.createElement("div");
    toast.className = `toast toast-cursor ${type}`;
    toast.textContent = message;
    toast.style.left = `${x}px`;
    toast.style.top = `${y}px`;

    document.body.appendChild(toast);

    setTimeout(() => {
      toast.remove();
    }, 1500);
  }

  // ========================================================================
  // 이벤트 리스너
  // ========================================================================

  openMobileSidebar() {
    this.sidebar.classList.add("open");
    this.sidebarOverlay.classList.add("open");
  }

  closeMobileSidebar() {
    this.sidebar.classList.remove("open");
    this.sidebarOverlay.classList.remove("open");
  }

  // PC(넓은 화면)에서는 오프캔버스 오버레이 대신 탐색기 자체를 접고 펼친다
  toggleDesktopSidebar() {
    const collapsed = this.sidebar.classList.toggle("collapsed");
    const label = collapsed ? "탐색기 열기" : "탐색기 닫기";
    this.mobileMenuToggle.title = label;
    this.mobileMenuToggle.setAttribute("aria-label", label);
  }

  attachEventListeners() {
    // 테마 토글
    this.themeToggle.addEventListener("click", () => this.toggleTheme());

    // 검색 모달
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        this.openSearchModal();
      }
    });

    this.searchInput.addEventListener("input", (e) => {
      const query = e.target.value.trim();
      if (query.length > 0) {
        const results = this.performSearch(query);
        this.renderSearchResults(results);
      } else {
        this.searchResults.innerHTML = "";
      }
    });

    this.searchInput.addEventListener("keydown", (e) => {
      const items = this.searchResults.querySelectorAll(".search-result-item");
      const highlighted = this.searchResults.querySelector(
        ".search-result-item.highlighted",
      );
      const currentIdx = highlighted ? parseInt(highlighted.dataset.index) : -1;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        const nextIdx = currentIdx + 1 < items.length ? currentIdx + 1 : 0;
        this.highlightSearchResult(nextIdx);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const prevIdx = currentIdx - 1 >= 0 ? currentIdx - 1 : items.length - 1;
        this.highlightSearchResult(prevIdx);
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (highlighted) {
          const idx = parseInt(highlighted.dataset.index);
          const results = this.performSearch(this.searchInput.value);
          if (results[idx]) {
            this.openFile(results[idx].id);
            this.closeSearchModal();
          }
        }
      } else if (e.key === "Escape") {
        this.closeSearchModal();
      }
    });

    this.searchModal.addEventListener("click", (e) => {
      if (e.target === this.searchModal) {
        this.closeSearchModal();
      }
    });

    // 타이틀바의 햄버거 버튼: 모바일에서는 오프캔버스 열기, PC에서는 탐색기 접기/펼치기
    this.mobileMenuToggle.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        this.openMobileSidebar();
      } else {
        this.toggleDesktopSidebar();
      }
    });

    // 사이드바 내부의 ✕ 버튼으로 닫기
    this.sidebarToggle.addEventListener("click", () => {
      this.closeMobileSidebar();
    });

    // 오버레이(배경) 클릭 시 닫기
    this.sidebarOverlay.addEventListener("click", () => {
      this.closeMobileSidebar();
    });

    // 모바일에서 파일 클릭 시 사이드바 닫기
    this.fileTree.addEventListener("click", () => {
      if (window.innerWidth <= 768) {
        this.closeMobileSidebar();
      }
    });

    // Code/Preview 토글 (상태바 클릭)
    this.statusViewMode.addEventListener("click", () => {
      this.viewMode = this.viewMode === "preview" ? "code" : "preview";
      this.renderContent();
    });

    // 키보드 단축키
    document.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "T") {
        e.preventDefault();
        this.toggleTheme();
      }
    });

    // 창 크기가 바뀌면 프로필 아바타 크기를 리스트 높이에 맞춰 다시 계산
    window.addEventListener("resize", () => {
      this.editorView
        .querySelectorAll(".profile-section")
        .forEach((section) => {
          this.syncProfileAvatarSize(section);
        });
    });
  }
}

// ============================================================================
// 앱 초기화
// ============================================================================

let app;
document.addEventListener("DOMContentLoaded", () => {
  app = new PortfolioApp();
});
