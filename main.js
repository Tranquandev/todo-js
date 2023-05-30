const formElement = document.querySelector(".form");
const formInputElement = formElement.querySelector(".form-input");
const todoListElement = document.querySelector(".todo-list");
const countElement = document.querySelector(".item-count");
// get todolist localstorage
const getTodolist = () => {
  return JSON.parse(localStorage.getItem("todo-list")) || [];
};
// save todolist localstorage
const saveTodolist = (newTodolist) => {
  localStorage.setItem("todo-list", JSON.stringify(newTodolist));
};

// create todo and add to UI
const createTodoUI = (todo) => {
  if (!todo) return;
  const newTodo = document.createElement("li");
  newTodo.classList = "todo-item";

  newTodo.innerHTML = `<input type="checkbox" data-id=${
    todo.id
  } class="item-check"
  ${todo.isCompleted ? "checked" : ""}

  />
  <input
    type="text"
    class="${todo.isCompleted ? "item-input completed" : "item-input"}"
    data-id=${todo.id}
    value=${todo.title}
    readonly

  />
  <div class="item-remove" data-id=${todo.id} >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke-width="1.5"
      stroke="currentColor"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
      />
    </svg>
  </div>
  `;

  return newTodo;
};

const filters = {
  // All: (todo) => true,
  Active: (todo) => !todo.isCompleted,
  Completed: (todo) => todo.isCompleted,
};
// render new todolist
const renderUI = () => {
  const filterOption = document.querySelector(".filter-item.active").innerText;
  // console.log(filterOption);
  let todoList = getTodolist();
  if (filterOption !== "All") {
    todoList = todoList.filter(filters[filterOption]);
    console.log("check todolist ", todoList);
  }

  if (todoList.length === 0) {
    document.querySelector(".footer").style.display = "none";
  } else {
    document.querySelector(".footer").style.display = "flex";
  }
  todoListElement.innerHTML = "";
  todoList.forEach((element) => {
    todoListElement.appendChild(createTodoUI(element));
  });

  countElement.textContent = `${todoList.length} items left`;
};
(() => {
  renderUI();
})();

// add todo to localstorage
const addTodo = (value) => {
  if (!value) return;
  const newTodo = {
    id: new Date().toISOString(),
    title: value,
    isCompleted: false,
  };
  const todoList = getTodolist();
  todoList.push(newTodo);
  saveTodolist(todoList);
};

// remove todo of localstorage
const removeTodo = (id) => {
  const todoList = getTodolist();
  const newTodoList = todoList.filter((todo) => todo.id !== id);
  saveTodolist(newTodoList);
};

// add event add todo
formElement.addEventListener("submit", function (e) {
  e.preventDefault();
  addTodo(formInputElement.value);
  this.reset();
  renderUI();
});

// add event remove todo
todoListElement.addEventListener("click", (e) => {
  // console.log(e.target.parentNode);
  if (e.target.parentNode.classList.contains("item-remove")) {
    const id = e.target.parentNode.getAttribute("data-id");
    console.log(id);
    removeTodo(id);
    renderUI();
  }
});

// completed check box
const handleCompleted = (id) => {
  const todoList = getTodolist();
  const newTodoList = todoList.map((todo) => {
    if (todo.id === id) {
      return {
        ...todo,
        isCompleted: !todo.isCompleted,
      };
    }
    return todo;
  });
  saveTodolist(newTodoList);
};

todoListElement.addEventListener("click", (e) => {
  if (e.target.classList.contains("item-check")) {
    // console.log(e.target.checked);
    const id = e.target.getAttribute("data-id");
    handleCompleted(id);
    renderUI();
  }
});

// check all completed
const isAllCompleted = () => {
  const todoList = getTodolist();
  return todoList.every((item) => item.isCompleted);
};

// add event completed all
const toggleElement = document.querySelector(".form-toggle");
toggleElement.addEventListener("click", (e) => {
  const todoList = getTodolist();
  const newTodoList = todoList.map((todo) => {
    todo.isCompleted = isAllCompleted() ? false : true;
    return todo;
  });
  saveTodolist(newTodoList);
  renderUI();
});

// active filter
const filterList = document.querySelectorAll(".filter-item");
filterList.forEach((item) => {
  item.addEventListener("click", (e) => {
    if (e.target.classList.contains("active")) return;
    filterList.forEach((item) => item.classList.remove("active"));
    e.target.classList.add("active");
    renderUI();
  });
});

// remove isCompleted

const clearCompleted = document.querySelector(".clear-completed");
clearCompleted.addEventListener("click", (e) => {
  console.log(e.target);
  const todoList = getTodolist();
  const newtodoList = todoList.filter((todo) => !todo.isCompleted);
  saveTodolist(newtodoList);
  renderUI();
});

// handle edit
todoListElement.addEventListener("dblclick", (e) => {
  if (e.target.classList.contains("item-input")) {
    e.target.removeAttribute("readonly");
    e.target.classList.add("edit");
    e.target.classList.remove("completed");
    e.target.parentNode.querySelector(".item-check").classList.add("hidden");
    // move cursor focus to end text
    const end = e.target.value.length;
    e.target.setSelectionRange(end, end);
    e.target.focus();
    // add event key enter
    e.target.addEventListener("keypress", (e) => {
      if (e.which === 13) {
        const id = e.target.getAttribute("data-id");
        const todoList = getTodolist();
        const indexTodo = todoList.findIndex((todo) => todo.id === id);
        if (!e.target.value) {
          todoList.splice(indexTodo, 1);
        } else {
          todoList[indexTodo].title = e.target.value;
        }
        saveTodolist(todoList);
        renderUI();
      }
    });
    // add event blur
    e.target.addEventListener("blur", (e) => {
      const id = e.target.getAttribute("data-id");
      const todoList = getTodolist();
      const indexTodo = todoList.findIndex((todo) => todo.id === id);
      if (!e.target.value) {
        todoList.splice(indexTodo, 1);
      } else {
        todoList[indexTodo].title = e.target.value;
      }
      saveTodolist(todoList);
      renderUI();
    });
  }
});
