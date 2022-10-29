const GROUP_ONE_API_URL = 'https://capsules7.herokuapp.com/api/group/one';
const GROUP_TWO_API_URL = 'https://capsules7.herokuapp.com/api/group/two';
const STUDENT_API = 'https://capsules7.herokuapp.com/api/user/';

const input = document.getElementById('input');
const container = document.querySelector('.container');
const category = document.getElementById('category');
const divhead = document.getElementById('append');

let students = [];

async function getFetchData(url) {
  const res = await fetch(url);
  const data = await res.json();
  return data;
}

async function getData() {
  const FirstGroup = await getFetchData(GROUP_ONE_API_URL);
  const SecondGroup = await getFetchData(GROUP_TWO_API_URL);
  const StudentsData = FirstGroup.concat(SecondGroup);
  StudentsData.sort((a, b) => a.id - b.id);
  const peopleFullData = await Promise.all(
  StudentsData.map((student) => getFetchData(STUDENT_API + student.id)));
  return peopleFullData;
}

let header = document.createElement("tr");
header.classList.add('cell' , 'item');
const createHeader = () => {
  let th = document.createElement("th");
  th.innerText = "ID";
  header.append(th);
  th = document.createElement("th");
  th.innerText = "Gender";
  header.append(th);
  th = document.createElement("th");
  th.innerText = 'FirstName';
  header.append(th);
  th = document.createElement("th");
  th.innerText = 'LastName';
  header.append(th);
  th = document.createElement("th");
  th.innerText = "Capsule";
  header.append(th);
  th = document.createElement("th");
  th.innerText = 'Age';
  header.append(th);
  th = document.createElement("th");
  th.innerText = 'City';
  header.append(th);
  th = document.createElement("th");
  th.innerText = 'Hobby';
  header.append(th);
  th = document.createElement("th");
  th.innerText = 'Edit';
  header.append(th);
  return header;
};

const buildRow = (arrOfData) => {  
  const row = document.createElement('div');
  row.classList.add('row');
  for (let i = 0; i < arrOfData.length; i++) {
    const cell = document.createElement('input');
    cell.classList.add('cell');
    cell.value = arrOfData[i];
    cell.setAttribute('readonly', true);
    row.appendChild(cell);
  };  
  addButtons(row);
  container.appendChild(row);
};
  
divhead.appendChild(header);
createHeader();
const buildTable = (arrOfData) => {  
  divhead.classList.add('cell');
  divhead.classList.add('item');
    for(let i = 0; i < arrOfData.length; i++) {
    buildRow([
      arrOfData[i].id,      
      arrOfData[i].gender,
      arrOfData[i].firstName,
      arrOfData[i].lastName,
      arrOfData[i].capsule,
      arrOfData[i].age,
      arrOfData[i].city,
      arrOfData[i].hobby,
    ]);
  };   
};
const addButtons = (row) => {
  const editBtn = document.createElement('button');
  let oldRow = row.cloneNode(true);
  oldRow = oldRow.querySelectorAll('input.cell');
  row.appendChild(editBtn);
  editBtn.innerText = 'Edit';
  editBtn.classList.add('btn', 'edit-btn');

  editBtn.addEventListener('click', (e) => { // edit button event
    row.querySelectorAll('input.cell').forEach((input) =>        
    input.removeAttribute('readonly'));
    row.querySelector(':first-child').setAttribute('readonly', true);
    row.querySelectorAll('button').forEach((button) => 
    (button.style.display = 'none'));
    const confirm = document.createElement('button');
    confirm.textContent = 'confirm';
    confirm.classList.add('btn');    
    confirm.classList.add('confirm-btn');
    row.appendChild(confirm);

    const cancel = document.createElement('button');
    cancel.textContent = 'Cancel';
    cancel.classList.add('btn');
    cancel.classList.add('cancel-btn');
    row.appendChild(cancel);

    cancel.addEventListener('click', (e) => { 
      row.querySelectorAll('input').forEach((input, index) => (input.value = oldRow[index].value)); 
      row.querySelector('.edit-btn').style.display = 'block';
      row.querySelector('.delete-btn').style.display = 'block';
      cancel.remove();
      confirm.remove();
      row
        .querySelectorAll('input.cell')
        .forEach((input) => input.setAttribute('readonly', 'true'));
    });

    confirm.addEventListener('click', (e) => {
      row.querySelector('.edit-btn').style.display = 'block';
      row.querySelector('.delete-btn').style.display = 'block';
      cancel.remove();
      confirm.remove();
      row.querySelectorAll('input.cell').forEach((input) => 
      input.setAttribute('readonly', 'true'));
    });
    console.log(row);
  });

  const deleteBtn = document.createElement('button');
  row.appendChild(deleteBtn);
  deleteBtn.innerText = 'Delete';
  deleteBtn.classList.add('btn', 'delete-btn');
  deleteBtn.addEventListener('click', (e) => {
    const persons = students.filter((person) => {
      return person.id !== row.querySelector(':first-child').value;
    });
    students = [...persons];
    console.log(students);
    row.remove();
  });
};

function filter(peopleArr, input, cat) {
  if (cat === 'everything') {
    return peopleArr.filter((person) =>
      Object.values(person).some((value) =>
        value.toString().toLowerCase().includes(input.toLowerCase())
      )
    );  
  } 
  else if (cat==='id' || cat === 'age' || cat === 'capsule') {
    return peopleArr.filter((person) =>
      person[cat].toString().toLowerCase().includes(input.toLowerCase())
    );
  }
  else {
    return peopleArr.filter((person) =>
      person[cat].toLowerCase().includes(input.toLowerCase())
    );
  }
}
function searchtoFind(e) {
  const currentInput = e.target.value;
  const currentCategory = category.value;
  const filteredPeople = filter(students, currentInput, currentCategory);
  container.innerHTML = '';
  buildTable(filteredPeople);
}

const main = async () => {
  students = await getData();
  buildTable(students);
  input.addEventListener('keyup', searchtoFind);
};
main();