const url = "https://fathomless-brushlands-42339.herokuapp.com/todo3/";
const todoList = document.querySelector(".list");
const addContent = document.querySelector(".add-content");
const addBtn = document.querySelector(".add-btn");
const clearBtn = document.querySelector(".clear-btn");
let data = [];

function init() {
  axios.get(url).then((response) => {
    data = response.data;
    render();
  });
}

function render() {
  let content = "";
  data.forEach((item) => {
    content += `<li class="df aic position-relative" data-id=${item.id}><input type="checkbox" class="mr-3" /><span>${item.content}</span><img src="/image/x.svg" class="ml-a cursor-pointer" /></li>`;
  });
  todoList.innerHTML = content;
}

function addTodoContent() {
  if (addContent.value.length < 1) return;
  const todoObj = {};
  todoObj.content = addContent.value;
  todoObj.completed = false;
  addContent.value = "";
  axios
    .post("https://fathomless-brushlands-42339.herokuapp.com/todo3", todoObj)
    .then(() => {
      axios.get(url).then((response) => {
        data = response.data;
        render();
      });
    });
}

function deleteOneContent(e) {
  if (e.target.nodeName !== "IMG") return;
  const targetId = e.target.parentNode.getAttribute("data-id");
  const target = data.filter((item) => item.id === parseInt(targetId));
  console.log(target);
  // axios.delete(url + target.id).then((response) => {
  //   render();
  // });
}

function deleteAllContent() {
  const allIds = data.map((item) => item.id);
  data = [];
  render();
  allIds.forEach((id) => {
    axios.delete(url + id);
  });
}

addBtn.addEventListener("click", addTodoContent);
addContent.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    addBtn.click();
  }
});
clearBtn.addEventListener("click", deleteAllContent);
todoList.addEventListener("click", deleteOneContent);

init();
