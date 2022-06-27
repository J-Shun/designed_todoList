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
