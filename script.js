// index.html을 열어서 agoraStatesDiscussions 배열 요소를 확인하세요.
console.log("agoraStatesDiscussions ", agoraStatesDiscussions);

let data;
const dataFromLocalStorage = localStorage.getItem("agoraStatesDiscussions");
if (dataFromLocalStorage) {
  data = JSON.parse(dataFromLocalStorage);
} else {
  // data = agoraStatesDiscussions;
  fetch("http://localhost:4000/discussions")
    .then((res) => res.json())
    .then((res) => {
      data = res;
      console.log("fetch ", data);
      // const ul = document.querySelector("ul.discussions__container");
      render(ul, 0, limit);
    });
}

// convertToDiscussion은 아고라 스테이츠 데이터를 DOM으로 바꿔줍니다.
const convertToDiscussion = (obj) => {
  const li = document.createElement("li"); // li 요소 생성
  li.className = "discussion__container"; // 클래스 이름 지정

  const discussionFlex = document.createElement("div");
  discussionFlex.className = "discussion__flex";

  const avatarWrapper = document.createElement("div");
  avatarWrapper.className = "discussion__avatar--wrapper";
  const discussionContent = document.createElement("div");
  discussionContent.className = "discussion__content";
  const discussionAnswered = document.createElement("div");
  discussionAnswered.className = "discussion__answered";

  // TODO: 객체 하나에 담긴 정보를 DOM에 적절히 넣어주세요.

  const avatarImg = document.createElement("img");
  avatarImg.className = "discussion__avatar--image";
  avatarImg.src = obj.avatarUrl ? obj.avatarUrl : "./images/default-avata.png";
  avatarImg.alt = "avatar of" + obj.author;
  avatarWrapper.append(avatarImg);

  const discussionTitle = document.createElement("h2");
  discussionTitle.className = "discussion__title";
  const discussionTitleAnchor = document.createElement("a");
  discussionTitleAnchor.href = obj.url;
  discussionTitleAnchor.textContent = obj.title;
  discussionTitle.append(discussionTitleAnchor);
  discussionContent.append(discussionTitle);

  const discussionInformation = document.createElement("div");
  discussionInformation.className = "discussion__information";
  const discussionInformationCreatedAt = document.createElement("span");
  const discussionInformationAuthor = document.createElement("span");
  discussionInformationCreatedAt.textContent = new Date(
    obj.createdAt
  ).toLocaleString();
  discussionInformationAuthor.textContent = obj.author;
  discussionInformation.append(discussionInformationCreatedAt);
  discussionInformation.append(discussionInformationAuthor);
  discussionContent.append(discussionInformation);

  const discussionAnsweredParagraph = document.createElement("p");
  discussionAnsweredParagraph.className = "material-symbols-outlined";
  discussionAnsweredParagraph.textContent = obj.answer
    ? "check_circle"
    : "cancel";
  if (discussionAnsweredParagraph.textContent === "check_circle") {
    discussionAnsweredParagraph.style.color = "#b6e6bd";
  }
  discussionAnswered.append(discussionAnsweredParagraph);

  discussionFlex.append(avatarWrapper, discussionContent, discussionAnswered);
  li.append(discussionFlex);

  const discussionAnswerdLink = document.createElement("a");
  discussionAnswerdLink.className = "discussion__answerd--link";
  discussionAnswerdLink.href = obj.answer ? obj.answer.url : null;
  discussionAnswerdLink.textContent = "답변 보러가기";
  discussionAnswerdLink.title = "Click!";
  const discussionAnswerdLinkIcon = document.createElement("span");
  discussionAnswerdLinkIcon.className = "material-symbols-outlined";
  discussionAnswerdLinkIcon.textContent = "chevron_right";
  discussionAnswerdLink.append(discussionAnswerdLinkIcon);

  if (obj.answer) {
    li.append(discussionAnswerdLink);
  }

  return li;
};

let limit = 10,
  page = 1;

// agoraStatesDiscussions 배열의 모든 데이터를 화면에 렌더링하는 함수입니다.
const render = (element, from, to) => {
  console.log("페이지 이동 ", from, to);
  if (!from && !to) {
    from = 0;
    to = data.length - 1;
  }
  // 다 지우고 배열에 있는 내용 다 보여주기
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }
  for (let i = from; i < to; i++) {
    element.append(convertToDiscussion(data[i]));
  }
  return;
};

// ul 요소에 agoraStatesDiscussions 배열의 모든 데이터를 화면에 렌더링합니다.
const ul = document.querySelector("ul.discussions__container");
// render(ul, 0, limit);

const getPageStartEnd = (limit, page) => {
  const len = data.length - 1;
  let pageStart = Number(page - 1) * Number(limit);
  let pageEnd = Number(pageStart) + Number(limit);
  if (page <= 0) {
    pageStart = 0;
  }
  if (pageEnd >= len) {
    pageEnd = len;
  }
  return { pageStart, pageEnd };
};

// 페이지네이션
const buttons = document.querySelector(".pagination");
// 이전 페이지로 이동
buttons.children[0].addEventListener("click", () => {
  if (page > 1) {
    page = page - 1;
  }
  const { pageStart, pageEnd } = getPageStartEnd(limit, page);
  render(ul, pageStart, pageEnd);
});
// 다음 페이지로 이동
buttons.children[1].addEventListener("click", () => {
  if (limit * page < data.length) {
    page = page + 1;
  }
  const { pageStart, pageEnd } = getPageStartEnd(limit, page);
  render(ul, pageStart, pageEnd);
});

// 새 디스커션 업로드
const onUpload = () => {
  console.log("새 디스커션 업로드");

  const inputTitle = document.querySelector(".form__input--title > input");
  const inputName = document.querySelector(".form__input--name > input");
  const inputTextbox = document.querySelector(".form__textbox > textarea");

  if (!(inputTitle.value && inputName.value && inputTextbox.value)) {
    alert("빈 칸을 모두 입력해주세요");
    return;
  }

  const date = new Date();

  const inputObj = {
    id: "D_kwDOHOApLM4APjJi",
    createdAt: date.toISOString(),
    title: inputTitle.value,
    url: null,
    author: inputName.value,
    answer: null,
    bodyHTML: inputTextbox.value,
    avatarUrl: null,
  };

  data.unshift(inputObj);

  ul.prepend(convertToDiscussion(inputObj));

  inputTitle.value = "";
  inputName.value = "";
  inputTextbox.value = "";

  localStorage.setItem("agoraStatesDiscussions", JSON.stringify(data));
};
