const url = "https://fathomless-brushlands-42339.herokuapp.com/todo3/";
const all = document.querySelector(".all");
const yet = document.querySelector(".yet");
const done = document.querySelector(".done");
const addContent = document.querySelector(".add-content");
const addBtn = document.querySelector(".add-btn");
const clearBtn = document.querySelector(".clear-btn");
const list = document.querySelector(".list");
const quantity = document.querySelector(".quantity");
const unique = [];
let position = 1;
let data = [];

function init() {
  updateData().then(() => {
    render();
  });
}

function updateData() {
  return axios.get(url).then((res) => {
    data = res.data;
    data.forEach((item) => {
      unique.push(item.unique);
    });
  });
}

function render() {
  let allContent = "";
  data.forEach((item, index) => {
    allContent += `<li class="df aic position-relative" data-unique = ${item.unique} data-index=${index} "><label class="label df aic"><input type="checkbox" class="hide" ${item.status}/><span class="check-mark position-relative border-radius-sm cursor-pointer"></span><span class="content pl-3">${item.content}</span></label><img src="/image/x.svg" class="delete-icon ml-a cursor-pointer" /></li>`;
  });
  list.innerHTML = allContent;
  quantity.textContent = `${
    data.filter((item) => item.status === "").length
  } 個待完成項目`;
}

function addTodo(e) {
  if (addContent.value.length < 1) return;
  const obj = {};
  obj.content = addContent.value;
  obj.status = "";
  obj.unique = createUniqueNumber();
  addContent.value = "";
  data.push(obj);
  render();

  // send it to server but not update local data
  axios.post(url, obj);
}

function deleteTodo(e) {
  if (!e.target.classList.contains("delete-icon")) return;
  const target = e.target.parentNode;
  const targetIndex = target.getAttribute("data-index");
  data.splice(targetIndex, 1);
  render();

  axios.get(url).then((res) => {
    const allData = res.data;
    const targetItem = allData.filter(
      (item) => item.unique === parseInt(target.getAttribute("data-unique"))
    );
    const targetId = targetItem[0].id;
    const targetUnique = targetItem[0].unique;
    unique.splice(unique.indexOf(targetUnique), 1);
    axios.delete(url + targetId);
  });
}

function toggleStatus(e) {
  if (e.target.classList.contains("label") || e.target.nodeName === "INPUT") {
    const targetIndex =
      e.target.parentNode.parentNode.getAttribute("data-index");
    if (targetIndex === null) return;

    if (data[targetIndex].status) {
      data[targetIndex].status = "";
      axios.get(url).then((res) => {
        const targetId = res.data[targetIndex].id;
        axios.patch(url + targetId, { status: "" });
      });
    } else {
      data[targetIndex].status = "checked";
      axios.get(url).then((res) => {
        const targetId = res.data[targetIndex].id;
        axios.patch(url + targetId, { status: "checked" });
      });
    }
    render();
  } else {
    return;
  }
}

function deleteFinished(e) {
  const finished = data.filter((item) => item.status === "checked");
  finished.forEach((item) => {
    // delete finished from page
    const index = data.indexOf(item);
    data.splice(index, 1);

    // delete unique number of finished from unique array
    unique.splice(unique.indexOf(item.unique), 1);

    // delete data in the server
    axios.get(url).then((res) => {
      const allData = res.data;

      // get id of item in the server
      const targetData = allData.filter((data) => data.unique === item.unique);
      axios.delete(url + targetData[0].id);
    });
  });
  render();
}

function createUniqueNumber() {
  // max 50 unique numbers
  while (unique.length < 50) {
    const uniqueNumber = Math.floor(Math.random() * 50);
    if (unique.indexOf(uniqueNumber) === -1) {
      unique.push(uniqueNumber);
      return uniqueNumber;
    }
  }
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

all.addEventListener("click", (e) => {
  position = 1;
  all.classList.add("active");
  yet.classList.remove("active");
  done.classList.remove("active");
  render();
});

yet.addEventListener("click", (e) => {
  position = 2;
  yet.classList.add("active");
  all.classList.remove("active");
  done.classList.remove("active");

  let allContent = "";
  const yetFinished = data.filter((item) => item.status === "");
  yetFinished.forEach((item, index) => {
    allContent += `<li class="df aic position-relative" data-unique = ${item.unique} data-index=${index} "><label class="label df aic"><input type="checkbox" class="hide" ${item.status}/><span class="check-mark position-relative border-radius-sm cursor-pointer"></span><span class="content pl-3">${item.content}</span></label><img src="/image/x.svg" class="delete-icon ml-a cursor-pointer" /></li>`;
  });
  list.innerHTML = allContent;
});

done.addEventListener("click", (e) => {
  position = 3;
  done.classList.add("active");
  all.classList.remove("active");
  yet.classList.remove("active");

  let allContent = "";
  const yetFinished = data.filter((item) => item.status === "checked");
  yetFinished.forEach((item, index) => {
    allContent += `<li class="df aic position-relative" data-unique = ${item.unique} data-index=${index} "><label class="label df aic"><input type="checkbox" class="hide" ${item.status}/><span class="check-mark position-relative border-radius-sm cursor-pointer"></span><span class="content pl-3">${item.content}</span></label><img src="/image/x.svg" class="delete-icon ml-a cursor-pointer" /></li>`;
  });
  list.innerHTML = allContent;
});

init();
