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
