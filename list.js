// =====================
// cursor (부드러운 커서)
// =====================
window.onload = () => {
  let x = 0, y = 0;
  let targetX = 0, targetY = 0;
  const speed = 0.09;

  const cursorItem = document.querySelector(".cursorItem");
  const circle = cursorItem?.querySelector(".cursor"); // 안전하게 접근

  const buttonAll = document.querySelectorAll("a");
  if (circle) {
    buttonAll.forEach((item) => {
      item.addEventListener("mouseenter", () => circle.style.transform = "scale(.3)");
      item.addEventListener("mouseleave", () => circle.style.transform = "scale(1)");
    });
  }

  window.addEventListener("mousemove", (e) => {
    x = e.pageX;
    y = e.pageY;
  });

  const loop = () => {
    targetX += (x - targetX) * speed;
    targetY += (y - targetY) * speed;

    if (cursorItem) cursorItem.style.transform = `translate(${targetX}px, ${targetY}px)`;
    window.requestAnimationFrame(loop);
  };
  loop();
};

// =====================
// 데이터 초기화 / 헬퍼
// =====================
const STORAGE_KEY = "boards";

let boardsStr = localStorage.getItem(STORAGE_KEY);
if (boardsStr === null) {
  const listStr = JSON.stringify([]);
  localStorage.setItem(STORAGE_KEY, listStr);
  boardsStr = listStr;
}

let boardsObj = JSON.parse(boardsStr);

// XSS 방지
const escapeHtml = (str = "") =>
  String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");

// =====================
// DOM 요소
// =====================
const tbody = document.getElementById("tbody");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const resetBtn = document.getElementById("resetBtn");
const resultMeta = document.getElementById("resultMeta");

// 안전성: tbody가 없으면 더 이상 진행하지 않음
if (!tbody) {
  console.warn("tbody element not found. list.js aborted.");
} else {
  // 게시물 배열 보정: views/ index 보장 (한번만)
  let changed = false;
  boardsObj = boardsObj.map((b, i) => {
    // index 보장: 만약 저장된 index가 없다면 현재 i로 설정
    if (typeof b.index === "undefined") {
      b.index = i;
      changed = true;
    }
    // views 보장
    if (typeof b.views === "undefined" || isNaN(Number(b.views))) {
      b.views = 0;
      changed = true;
    } else {
      b.views = Number(b.views);
    }
    // refresh 필드가 없으면 false로 초기화 (원하면 제거)
    if (typeof b.refresh === "undefined") {
      b.refresh = false;
      changed = true;
    }
    return b;
  });
  if (changed) localStorage.setItem(STORAGE_KEY, JSON.stringify(boardsObj));

  // 템플릿 생성 (DOM fragment 사용)
  const buildTableRows = (list) => {
    // 결과 없음 처리
    if (!list || list.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" style="text-align:center; padding:16px;">
            검색 결과가 없습니다.
          </td>
        </tr>
      `;
      if (resultMeta) resultMeta.textContent = `0개`;
      return;
    }

    const frag = document.createDocumentFragment();

    list.forEach((objValue, idx) => {
      const tr = document.createElement("tr");

      const displayIndex = objValue.index ?? idx;
      const safeTitle = escapeHtml(objValue.subject || "(제목없음)");
      const safeWriter = escapeHtml(objValue.writer || "익명");
      const safeDate = escapeHtml(objValue.date || "-");
      const safeViews = Number(objValue.views || 0);

      tr.innerHTML = `
        <td>${displayIndex + 1}</td>
        <td><a href="./view.html?index=${displayIndex}">${safeTitle}</a></td>
        <td>${safeWriter}</td>
        <td>${safeDate}</td>
        <td>${safeViews}</td>
      `;

      frag.appendChild(tr);
    });

    tbody.innerHTML = ""; // 기존 내용 비우고
    tbody.appendChild(frag);

    if (resultMeta) resultMeta.textContent = `${list.length}개`;
  };

  // 초기 렌더
  buildTableRows(boardsObj);

  // =====================
  // 검색 기능
  // =====================
  const getBoards = () => JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

  const search = () => {
    const keyword = (searchInput?.value || "").trim().toLowerCase();
    const all = getBoards();

    if (!keyword) {
      buildTableRows(all);
      return;
    }

    const filtered = all.filter((b) => {
      const s = (b.subject || "").toLowerCase();
      const c = (b.content || "").toLowerCase();
      const w = (b.writer || "").toLowerCase();
      return s.includes(keyword) || c.includes(keyword) || w.includes(keyword);
    });

    buildTableRows(filtered);
  };

  // 이벤트 연결 (있으면)
  if (searchBtn) searchBtn.addEventListener("click", search);
  if (resetBtn) resetBtn.addEventListener("click", () => {
    if (searchInput) searchInput.value = "";
    buildTableRows(getBoards());
  });
  if (searchInput) searchInput.addEventListener("input", search);

  // Optional: 페이지 로드 후 검색어가 있으면 필터 적용
  if (searchInput && searchInput.value.trim()) search();
}