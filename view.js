window.onload = () => {
  let x = 0, y = 0;
  let targetX = 0, targetY = 0;
  const speed = 0.09;

  const cursorItem = document.querySelector(".cursorItem");
  const circle = cursorItem?.querySelector(".cursor");

  const buttonAll = document.querySelectorAll("a");
  if (circle) {
    buttonAll.forEach((item) => {
      item.addEventListener("mouseenter", () => { circle.style.transform = "scale(.3)"; });
      item.addEventListener("mouseleave", () => { circle.style.transform = "scale(1)"; });
    });
  }

  window.addEventListener("mousemove", (e) => { x = e.pageX; y = e.pageY; });

  const loop = () => {
    targetX += (x - targetX) * speed;
    targetY += (y - targetY) * speed;
    if (cursorItem) cursorItem.style.transform = `translate(${targetX}px, ${targetY}px)`;
    requestAnimationFrame(loop);
  };
  loop();
};

// 1) boards 로드 (없으면 빈 배열)
const boardsObj = JSON.parse(localStorage.getItem("boards")) || [];

// 2) URL에서 index(= 글 고유 id) 가져오기
// 기존 idx 문자열("./view.html?index=...") 형태를 유지하기 위해 idx도 같이 유지
const idx = location.search; // "?index=170..."
const params = new URLSearchParams(location.search);
const targetIndex = Number(params.get("index"));

// 3) 글 찾기 (✅ 핵심: 배열 인덱스가 아니라 index 값으로 찾음)
const board = boardsObj.find(b => Number(b.index) === targetIndex);

if (!board) {
  alert("게시글을 찾을 수 없습니다.");
  location.href = "./list.html";
}

// 4) 조회수 증가 (간단/안정 버전)
// - 같은 탭에서 새로고침하면 증가하지 않게 sessionStorage로 1회만 카운트
const viewedKey = `viewed_${targetIndex}`;
if (!sessionStorage.getItem(viewedKey)) {
  board.views = (typeof board.views === "number" ? board.views : 0) + 1;
  sessionStorage.setItem(viewedKey, "1");
  localStorage.setItem("boards", JSON.stringify(boardsObj));
}

// 5) 화면 렌더링 (기존 방식 유지)
const viewForm = document.querySelectorAll("#viewForm > div");
for (let i = 0; i < viewForm.length; i++) {
  const id = viewForm[i].id;       // 예: subject / writer / content / date / views ...
  viewForm[i].innerHTML += "" + (board[id] ?? "");
}

// 6) 수정 버튼 → modify.html?index=고유id
const modifyBtn = document.querySelector("#modify");
modifyBtn?.addEventListener("click", () => {
  location.href = "./modify.html" + idx;
});

// 7) 삭제 버튼 (✅ splice는 findIndex로)
const deleteBtn = document.querySelector("#delete");
deleteBtn?.addEventListener("click", () => {
  const delIdx = boardsObj.findIndex(b => Number(b.index) === targetIndex);
  if (delIdx === -1) {
    alert("이미 삭제된 게시글입니다.");
    location.href = "./list.html";
    return;
  }

  boardsObj.splice(delIdx, 1);
  localStorage.setItem("boards", JSON.stringify(boardsObj));
  location.href = "./list.html";
});