const url = "https://fathomless-brushlands-42339.herokuapp.com/todo3/";
const all = document.querySelector(".all");
const yet = document.querySelector(".yet");
const done = document.querySelector(".done");
const addContent = document.querySelector(".add-content");
const addBtn = document.querySelector(".add-btn");
const clearBtn = document.querySelector(".clear-btn");
const list = document.querySelector(".list");
const quantity = document.querySelector(".quantity");
const loading = document.querySelector(".loading");
const unique = [];
let position = 1;
let data = [];

function init() {
  update()
    .then((res) => {
      render();
    })
    .catch((err) => {
      console.log(err);
    });
}

function update() {
  return axios
    .get(url)
    .then((res) => {
      data = res.data;
    })
    .catch((err) => {
      console.log(err);
    });
}

function render() {
  let allContent = "";
  if (position === 1) {
    data.forEach((item) => {
      allContent += `<li class="df aic position-relative" data-id=${item.id} ><label class="label df aic"><input type="checkbox" class="hide" ${item.status}/><span class="check-mark position-relative border-radius-sm cursor-pointer"></span><span class="content pl-3">${item.content}</span></label><img src="/image/x.svg" class="delete-icon ml-a cursor-pointer" /></li>`;
    });
    list.innerHTML = allContent;
    quantity.textContent = `${
      data.filter((item) => item.status === "").length
    } 個待完成項目`;
  } else if (position === 2) {
    const yetItems = data.filter((item) => item.status === "");
    yetItems.forEach((item) => {
      allContent += `<li class="df aic position-relative" data-id=${item.id} ><label class="label df aic"><input type="checkbox" class="hide" ${item.status}/><span class="check-mark position-relative border-radius-sm cursor-pointer"></span><span class="content pl-3">${item.content}</span></label><img src="/image/x.svg" class="delete-icon ml-a cursor-pointer" /></li>`;
    });
    list.innerHTML = allContent;
    quantity.textContent = `${
      data.filter((item) => item.status === "").length
    } 個待完成項目`;
  } else {
    const doneItems = data.filter((item) => item.status === "checked");
    doneItems.forEach((item) => {
      allContent += `<li class="df aic position-relative" data-id=${item.id} ><label class="label df aic"><input type="checkbox" class="hide" ${item.status}/><span class="check-mark position-relative border-radius-sm cursor-pointer"></span><span class="content pl-3">${item.content}</span></label><img src="/image/x.svg" class="delete-icon ml-a cursor-pointer" /></li>`;
    });
    list.innerHTML = allContent;
    quantity.textContent = `${
      data.filter((item) => item.status === "").length
    } 個待完成項目`;
  }

  loading.classList.add("hide");
}

function addTodo(e) {
  if (addContent.value.length < 1) return;

  loading.classList.remove("hide");

  const obj = {};
  obj.content = addContent.value;
  obj.status = "";
  addContent.value = "";

  axios
    .post(url, obj)
    .then((res) => {
      data.push(res.data);
      render();
    })
    .catch((err) => {
      console.log(err);
    });
}

function deleteTodo(e) {
  if (!e.target.classList.contains("delete-icon")) return;

  loading.classList.remove("hide");

  e.target.classList.add("no-event");
  const targetId = e.target.parentNode.getAttribute("data-id");

  axios
    .delete(url + targetId)
    .then((res) => {
      const targetItem = data.filter(
        (item) => item.id === parseInt(targetId)
      )[0];
      data.splice(data.indexOf(targetItem), 1);
      render();
    })
    .catch((err) => {
      // if failed, rerender the page cause we hide the item
      render();
    });
}

function toggleStatus(e) {
  if (e.target.nodeName !== "INPUT") return;

  loading.classList.remove("hide");

  const checkBox = e.target;
  const targetId = checkBox.parentNode.parentNode.getAttribute("data-id");
  const targetItem = data.filter((item) => item.id === parseInt(targetId))[0];
  const targetIndex = data.indexOf(targetItem);
  checkBox.parentNode.classList.add("no-event");

  if (checkBox.checked === true) {
    axios.patch(url + targetId, { status: "checked" }).then((res) => {
      data[targetIndex].status = "checked";
      render();
      loading.classList.add("hide");
    });
  } else {
    axios.patch(url + targetId, { status: "" }).then((res) => {
      data[targetIndex].status = "";
      render();
      loading.classList.add("hide");
    });
  }
}

function deleteFinished(e) {
  const finished = data.filter((item) => item.status === "checked");
  if (finished < 1) return;

  loading.classList.remove("hide");

  clearBtn.classList.add("no-event");

  finished.forEach((finishedItem) => {
    axios
      .delete(url + finishedItem.id)
      .then((res) => {
        const targetItem = data.filter(
          (item) => item.id === parseInt(finishedItem.id)
        )[0];
        const targetIndex = data.indexOf(targetItem);
        data.splice(targetIndex, 1);
        render();
        clearBtn.classList.remove("no-event");
      })
      .catch((err) => {
        console.log(err);
      });
  });
}

function checkAll(e) {
  position = 1;
  all.classList.add("active");
  yet.classList.remove("active");
  done.classList.remove("active");
  render();
}

function checkYet(e) {
  position = 2;
  yet.classList.add("active");
  all.classList.remove("active");
  done.classList.remove("active");
  render();
}

function checkDone(e) {
  position = 3;
  done.classList.add("active");
  all.classList.remove("active");
  yet.classList.remove("active");
  render();
}

addBtn.addEventListener("click", addTodo);
addContent.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    addBtn.click();
  }
});

list.addEventListener("click", deleteTodo);

list.addEventListener("click", toggleStatus);

clearBtn.addEventListener("click", deleteFinished);

all.addEventListener("click", checkAll);

yet.addEventListener("click", checkYet);

done.addEventListener("click", checkDone);

init();
