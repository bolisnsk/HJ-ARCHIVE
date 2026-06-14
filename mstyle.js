// .b_txt들을 배열로 가져온다
const textElements = gsap.utils.toArray('#inc01 .b_txt');
const soundButton = document.getElementById("soundButton");
const bgm = document.getElementById("bgm");

soundButton.addEventListener("click", async () => {
  if (bgm.paused) {
    await bgm.play();
    soundButton.style.color = "var(--yellow--color)";
    } else {
      bgm.pause();
      soundButton.style.color = "var(--grey--color)";
    }
});

// 각 text 요소에 대해 애니메이션 적용
textElements.forEach(text => {
  gsap.to(text, {
    backgroundSize: '100%',
    ease: 'none',
    scrollTrigger: {
      trigger: text,
      start: 'center 80%',
      end: 'center 40%',
      scrub: true,
    },
  });
});

gsap.to('#inc01 .h_txt', {
  backgroundSize: '100%',
  ease: 'none',
  scrollTrigger: {
    trigger: '#inc01 .b_txt',
    start: 'center 80%',
    end: 'center 50%',
    scrub: true,
  },
});

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
      item.addEventListener("mouseenter", () => {
        circle.style.transform = "scale(.3)";
      });
      item.addEventListener("mouseleave", () => {
        circle.style.transform = "scale(1)";
      });
    });
  }

  window.addEventListener("mousemove", (e) => {
    x = e.pageX;
    y = e.pageY;
  });

  const loop = () => {
    targetX += (x - targetX) * speed;
    targetY += (y - targetY) * speed;

    if (cursorItem) {
      cursorItem.style.transform = `translate(${targetX}px, ${targetY}px)`;
    }

    window.requestAnimationFrame(loop);
  };
  loop();
};

window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  const imageBox = document.getElementById('scrollImage');

  if (!imageBox) return;

  if (scrollY > 1000) imageBox.classList.add('visible');
  else imageBox.classList.remove('visible');
});

gsap.fromTo(
  '.text',
  { opacity: 0, y: 50 },
  {
    opacity: 1,
    y: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.text',
      start: 'top 80%',
      end: 'top 20%',
      toggleActions: 'play reverse play reverse',
      markers: false
    }
  }
);

const scrollImage = document.getElementById('scrollImage');

if (scrollImage) {
  ScrollTrigger.create({
    trigger: scrollImage,
    start: 'top 80%',

    onEnter: () => {
      scrollImage.classList.add('visible');
    },

    onLeaveBack: () => {
      scrollImage.classList.remove('visible');
    }
  });
}

window.addEventListener('load', () => {
  ScrollTrigger.refresh();
});

const wrapper = document.getElementById('trigger');
const container = document.getElementById('imageContainer');

if (wrapper && container) {
  const images = container.querySelectorAll('img');
  const totalFrames = images.length;

  // (선택) 첫 프레임 기본 활성화
  if (images[0]) images[0].classList.add('active');

  window.addEventListener('scroll', () => {
    const wrapperTop = wrapper.offsetTop;
    const wrapperHeight = wrapper.offsetHeight;
    const scrollY = window.scrollY;
    const viewportHeight = window.innerHeight;

    const start = wrapperTop;
    const end = wrapperTop + wrapperHeight - viewportHeight;

    // 섹션 안에 있을 때만 프레임 업데이트
    if (scrollY >= start && scrollY <= end) {
      const scrollWithin = scrollY - start;
      const progress = scrollWithin / (end - start); // 0 ~ 1

      const frameIndex = Math.min(
        totalFrames - 1,
        Math.floor(progress * totalFrames)
      );

      images.forEach((img, index) => {
        img.classList.toggle('active', index === frameIndex);
      });
    }
  });
}

/* ===========================
   게시판 저장
   =========================== */
const writeForm = document.querySelector("#writeForm");

class Board {
  constructor(indexNum, subjecStr, writerStr, contentStr) {
    this.index = indexNum;
    this.Subject = subjecStr;
    this.Writer = writerStr;
    this.Content = contentStr;
    this.date = recordDate();
    this.views = -1;
    this.fefresh = false;
  }

  set Subject(value) {
    const v = value.trim();
    if (v.length === 0) throw new Error("제목을 입력해주세요.");
    this.subject = v;
  }

  set Writer(value) {
    const v = value.trim();
    if (v.length === 0) throw new Error("작성자를 입력해주세요.");
    this.writer = v;
  }

  set Content(value) {
    const v = value.trim();
    if (v.length === 0) throw new Error("내용을 입력해주세요.");
    this.content = v;
  }
}

const recordDate = () => {
  const date = new Date();
  const yyyy = date.getFullYear();
  let mm = date.getMonth() + 1;
  let dd = date.getDate();

  mm = (mm > 9 ? "" : "0") + mm;
  dd = (dd > 9 ? "" : "0") + dd;

  return [yyyy, mm, dd].join("-");
};

const submitHandler = (e) => {
  e.preventDefault();
  const subject = e.target.subject.value;
  const writer = e.target.writer.value;
  const content = e.target.content.value;

  try {
    const boardsObj = JSON.parse(localStorage.getItem("boards")) || [];

    const index = boardsObj.length;
    const instance = new Board(index, subject, writer, content);
    boardsObj.push(instance);

    localStorage.setItem("boards", JSON.stringify(boardsObj));
    location.href = "./view.html?index=" + index;
  } catch (e) {
    alert(e.message);
    console.error(e);
  }
};

if (writeForm) writeForm.addEventListener("submit", submitHandler);