const url = "https://fathomless-brushlands-42339.herokuapp.com/todo3/";
const addContent = document.querySelector(".add-content");
const addBtn = document.querySelector(".add-btn");
const list = document.querySelector(".list");
const notFinished = document.querySelector(".quantity");

let data = [];

function init() {
  updateData().then(() => {
    render();
  });
}

function updateData() {
  return axios.get(url).then((res) => {
    data = res.data;
  });
}

function render() {
  let allContent = "";
  data.forEach((item, index) => {
    allContent += `<li class="df aic position-relative"  data-index=${index} data-id="${item.id}"><label class="df aic"><input type="checkbox" class="hide" /><span class="check-mark position-relative border-radius-sm cursor-pointer"></span><span class="content pl-3">${item.content}</span></label><img src="/image/x.svg" class="delete-icon ml-a cursor-pointer" /></li>`;
  });
  list.innerHTML = allContent;
  notFinished.textContent = `${data.length} 個待完成項目`;
}

function addTodo(e) {
  if (addContent.value.length < 1) return;
  const obj = {};
  obj.content = addContent.value;
  obj.status = "";
  addContent.value = "";
  axios.post(url, obj).then((res) => {
    init();
  });
}

addBtn.addEventListener("click", addTodo);
addContent.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    addBtn.click();
  }
});

list.addEventListener("click", (e) => {
  if (!e.target.classList.contains("delete-icon")) return;
  const targetId = e.target.parentNode.getAttribute("data-id");
  axios.delete(url + targetId).then((res) => {
    init();
  });
});

init();
