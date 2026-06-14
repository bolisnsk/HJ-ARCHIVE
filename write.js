window.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    document.querySelector('header')?.classList.add('visible');
  }, 1000);
});

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

const writeForm = document.querySelector("#writeForm");

class Board {
  constructor(indexNum, subjecStr, writerStr, contentStr) {
    this.index = indexNum;
    this.Subject = subjecStr;
    this.Writer = writerStr;
    this.Content = contentStr;
    this.date = recordDate();
    this.views = 0;       // ✅ -1 말고 0부터 시작
    this.refresh = false; // ✅ 오타(fefresh) 정리
  }

  set Subject(value) {
    const v = value.trim();                // ✅ 공백만 입력 방지
    if (v.length === 0) throw new Error("제목을 입력해주세요.");
    if (v.length > 30) throw new Error("제목은 30자 이내로 입력해주세요.");
    this.subject = v;
  }

  set Writer(value) {
    const v = value.trim();
    if (v.length === 0) throw new Error("작성자를 입력해주세요.");
    if (v.length > 10) throw new Error("작성자는 10자 이내로 입력해주세요.");
    this.writer = v;
  }

  set Content(value) {
    const v = value.trim();
    if (v.length === 0) throw new Error("내용을 입력해주세요.");
    if (v.length > 500) throw new Error("내용은 500자 이내로 입력해주세요.");
    this.content = v;
  }
}

const recordDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  mm = (mm > 9 ? "" : "0") + mm;
  dd = (dd > 9 ? "" : "0") + dd; // ✅ dd > 0 버그 수정

  return [yyyy, mm, dd].join("-");
};

const submitHandler = (e) => {
  e.preventDefault();
  const subject = e.target.subject.value;
  const writer = e.target.writer.value;
  const content = e.target.content.value;

  try {
    const boardsObj = JSON.parse(localStorage.getItem("boards")) || [];
    const index = Date.now(); // ✅ 삭제/수정 있어도 고유값 유지
    const instance = new Board(index, subject, writer, content);
    boardsObj.push(instance);

    localStorage.setItem("boards", JSON.stringify(boardsObj));
    location.href = "./view.html?index=" + index; // ✅ 고유 index로 이동
  } catch (e) {
    alert(e.message);
    console.error(e);
  }
};

if (writeForm)
  writeForm.addEventListener("submit", submitHandler);