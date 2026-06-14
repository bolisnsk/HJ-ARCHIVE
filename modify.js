window.onload = () => {
  let x = 0, y = 0;
  let targetX = 0, targetY = 0;
  const speed = 0.09;

  const cursorItem = document.querySelector(".cursorItem");
  const circle = cursorItem?.querySelector(".cursor");

  const buttonAll = document.querySelectorAll("a");
  if (circle) {
    buttonAll.forEach((item) => {
      item.addEventListener("mouseenter", () => circle.style.transform = "scale(.3)");
      item.addEventListener("mouseleave", () => circle.style.transform = "scale(1)");
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

const modifyForm = document.querySelector("#modifyForm");
const backBtn = document.querySelector("#back");

const boardsObj = JSON.parse(localStorage.getItem("boards")) || [];

// URL에서 index(= 고유 id) 가져오기
const idx = location.search; // "?index=..."
const params = new URLSearchParams(location.search);
const targetIndex = Number(params.get("index"));

// 글 찾기 (배열 인덱스 X)
const board = boardsObj.find(b => Number(b.index) === targetIndex);

if (!board) {
  alert("수정할 게시글을 찾을 수 없습니다.");
  location.href = "./list.html";
}

// 폼에 기존 값 채우기
if (modifyForm) {
  if (modifyForm.subject) modifyForm.subject.value = board.subject ?? "";
  if (modifyForm.writer)  modifyForm.writer.value  = board.writer ?? "";
  if (modifyForm.content) modifyForm.content.value = board.content ?? "";
}

// 유효성 검사
const validate = (subject, writer, content) => {
  const s = subject.trim();
  const w = writer.trim();
  const c = content.trim();

  if (s.length === 0) throw new Error("제목을 입력해 주세요");
  if (w.length === 0) throw new Error("작성자를 입력해 주세요");
  if (c.length === 0) throw new Error("내용을 입력해 주세요");

  if (s.length > 30) throw new Error("제목은 30자 이내로 입력해 주세요");
  if (w.length > 10) throw new Error("작성자는 10자 이내로 입력해 주세요");
  if (c.length > 500) throw new Error("내용은 500자 이내로 입력해 주세요");

  return { s, w, c };
};

const recordDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  mm = (mm > 9 ? "" : "0") + mm;
  dd = (dd > 9 ? "" : "0") + dd;

  return [yyyy, mm, dd].join("-");
};

const modifyHandler = (e) => {
  e.preventDefault();

  const subject = e.target.subject?.value ?? "";
  const writer  = e.target.writer?.value ?? "";
  const content = e.target.content?.value ?? "";

  try {
    const { s, w, c } = validate(subject, writer, content);

    // 데이터 반영
    board.subject = s;
    board.writer = w;
    board.content = c;
    board.date = recordDate();

    localStorage.setItem("boards", JSON.stringify(boardsObj));

    // 수정 후 상세로
    location.href = "./view.html" + idx;
  } catch (e) {
    alert(e.message);
    console.error(e);
  }
};

modifyForm?.addEventListener("submit", modifyHandler);

backBtn?.addEventListener("click", () => {
  history.back();
});

