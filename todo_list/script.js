const todo_list = [];
const doing_list = [];
const done_list = [];

// quando la pagina è caricata
window.onload = function () {
    // richiesta get todo
    const req_todo = new XMLHttpRequest();
    req_todo.onreadystatechange = function () {
        if (req_todo.readyState == 4 && req_todo.status == 200) {
            todo_list = JSON.parse(req_todo.responseText);
            showTasks();
        }
    }
    req_todo.open("GET", "http://172.17.0.99:3456/todo", true);
    req_todo.send();

    // richiesta get doing
    const req_doing = new XMLHttpRequest();
    req_doing.onreadystatechange = function () {
        if (req_doing.readyState == 4 && req_doing.status == 200) {
            doing_list = JSON.parse(req_doing.responseText);
            showTasks();
        }
    }
    req_doing.open("GET", "http://172.17.0.99:3456/doing", true);
    req_doing.send();

    // richiesta get done
    const req_done = new XMLHttpRequest();
    req_done.onreadystatechange = function () {
        if (req_done.readyState == 4 && req_done.status == 200) {
            done_list = JSON.parse(req_done.responseText);
            showTasks();
        }
    }
    req_done.open("GET", "http://172.17.0.99:3456/done", true);
    req_done.send();
};

function saveTasks() {
    // richiesta post todo
    let req_todo = new XMLHttpRequest();
    req_todo.onreadystatechange = function () {
        if (req_todo.readyState == 4 && req_todo.status == 200) {
            console.log("Salvataggio effettuato");
        }
    }
    req_todo.open("POST", "http://172.17.0.99:3456/todo", true);
    req_todo.setRequestHeader("Content-type", "application/json");
    req_todo.send(JSON.stringify(todo_list));

    // richiesta post doing
    let req_doing = new XMLHttpRequest();
    req_doing.onreadystatechange = function () {
        if (req_doing.readyState == 4 && req_doing.status == 200) {
            console.log("Salvataggio effettuato");
        }
    }
    req_doing.open("POST", "http://172.17.0.99:3456/doing", true);
    req_doing.setRequestHeader("Content-type", "application/json");
    req_doing.send(JSON.stringify(doing_list));

    // richiesta post done
    let req_done = new XMLHttpRequest();
    req_done.onreadystatechange = function () {
        if (req_done.readyState == 4 && req_done.status == 200) {
            console.log("Salvataggio effettuato");
        }
    }
    req_done.open("POST", "http://172.17.0.99:3456/done", true);
    req_done.setRequestHeader("Content-type", "application/json");
    req_done.send(JSON.stringify(done_list));
}

function addTask() {
    // input dati
    const nome_task = prompt("Nome task");
    const descrizione_task = prompt("Descrizione task");
    const id_task = prompt("ID task");

    const task = {
        name: nome_task,
        description: descrizione_task,
        id: id_task
    };
    todo_list.push(task);
    showTasks();
}

function startTask() {
    const input_id = prompt("ID task");
    let i = 0;
    for (let task of todo_list) {
        if (input_id == task.id) {
            doing_list.push(task);
            todo_list.splice(i, 1);
        };
        i++;
    };
    showTasks();
}

function endTask() {
    const input_id = prompt("ID task");
    let i = 0;
    for (let task of doing_list) {
        if (input_id == task.id) {
            done_list.push(task);
            doing_list.splice(i, 1);
        };
        i++;
    };
    showTasks();
}

function deleteTask() {
    const input_id = prompt("ID task");
    let i = 0;
    for (let task of done_list) {
        if (input_id == task.id) {
            done_list.splice(i, 1);
        };
        i++;
    };
    showTasks();
}

function showTasks() {
    let lista_HTML = "<ul>";
    const todo_list_div = document.getElementById("todolist");
    for (let task of todo_list) {
        lista_HTML = lista_HTML + "<li> Nome: " + task.name + " <br> Descrizione: " + task.description + "<br> ID: " + task.id + "</li>";
    };
    lista_HTML = lista_HTML + "</ul>";
    todo_list_div.innerHTML = lista_HTML;

    lista_HTML = "<ul>";
    const doing_list_div = document.getElementById("doinglist");
    for (let task of doing_list) {
        lista_HTML = lista_HTML + "<li> Nome: " + task.name + " <br> Descrizione: " + task.description + "<br> ID: " + task.id + "</li>";
    };
    lista_HTML = lista_HTML + "</ul>";
    doing_list_div.innerHTML = lista_HTML;

    lista_HTML = "<ul>";
    const done_list_div = document.getElementById("donelist");
    for (let task of done_list) {
        lista_HTML = lista_HTML + "<li> Nome: " + task.name + " <br> Descrizione: " + task.description + "<br> ID: " + task.id + "</li>";
    };
    lista_HTML = lista_HTML + "</ul>";
    done_list_div.innerHTML = lista_HTML;
}