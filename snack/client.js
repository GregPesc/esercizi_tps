import axios from "axios";
import inquirer from "inquirer";

const menù = [
    {
        type: "list",
        name: "menù",
        message: "Cosa vuoi fare?",
        choices: [
            "Aggiungi snack",
            "Visualizza dati su uno snack",
            "Visualizza tutti gli snack di una categoria",
            "Visualizza tutti gli snack con meno di un certo valore di calorie",
            "Esci",
        ],
    },
];

const domandeAggiunta = [
    {
        type: "input",
        name: "nome",
        message: "Nome snack:",
        filter: function (val) {
            return val.trim().toLowerCase();
        },
        validate: function (value) {
            if (value.trim().length) {
                return true;
            } else {
                return "Inserisci un nome valido!";
            }
        },
    },
    {
        type: "input",
        name: "categoria",
        message: "Categoria snack:",
        filter: function (val) {
            return val.trim().toLowerCase();
        },
        validate: function (value) {
            if (value.trim().length) {
                return true;
            } else {
                return "Inserisci una categoria valida!";
            }
        },
    },
    {
        type: "input",
        name: "prezzo",
        message: "Prezzo snack:",
        validate: (value) => {
            if (isNaN(parseFloat(value))) {
                return "Inserisci un prezzo valido!";
            }
            if (parseFloat(value) >= 0) {
                return true;
            } else {
                return "Inserisci un prezzo non negativo!";
            }
        },
    },
    {
        type: "number",
        name: "peso",
        message: "Peso snack:",
        validate: (value) => {
            if (parseInt(value) >= 0) {
                return true;
            } else {
                return "Inserisci un peso non negativo!";
            }
        },
    },
    {
        type: "number",
        name: "calorie",
        message: "Calorie snack per 100g:",
        validate: (value) => {
            if (parseInt(value) >= 0) {
                return true;
            } else {
                return "Inserisci un valore non negativo!";
            }
        },
    },
];

const domandeVisualizzaSnack = [
    {
        type: "input",
        name: "nome",
        message: "Nome snack:",
        filter: function (val) {
            return val.trim().toLowerCase();
        },
        validate: function (value) {
            if (value.trim().length) {
                return true;
            } else {
                return "Inserisci un nome valido!";
            }
        },
    },
];

const domandeVisualizzaSnackPerCategoria = [
    {
        type: "input",
        name: "categoria",
        message: "Categoria snack:",
        filter: function (val) {
            return val.trim().toLowerCase();
        },
        validate: function (value) {
            if (value.trim().length) {
                return true;
            } else {
                return "Inserisci una categoria valida!";
            }
        },
    },
];

const domandeVisualizzaSnackPerCalorie = [
    {
        type: "number",
        name: "calorie",
        message: "Calorie snack per 100g:",
        validate: (value) => {
            if (parseInt(value) >= 0) {
                return true;
            } else {
                return "Inserisci un valore non negativo!";
            }
        },
    },
];

function main() {
    inquirer.prompt(menù).then((answers) => {
        switch (answers.menù) {
            case "Aggiungi snack":
                inquirer.prompt(domandeAggiunta).then((answers) => {
                    axios
                        .put("http://localhost:20000/snack", {
                            nome: answers.nome,
                            categoria: answers.categoria,
                            prezzo: answers.prezzo,
                            peso: answers.peso,
                            calorie: answers.calorie,
                        })
                        .then((response) => {
                            console.log(response.data);
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                        });
                });
                break;
            case "Visualizza dati su uno snack":
                inquirer.prompt(domandeVisualizzaSnack).then((answers) => {
                    axios
                        .get(`http://localhost:20000/snack/${answers.nome}`)
                        .then((response) => {
                            console.log(response.data);
                        })
                        .catch((err) => {
                            console.log(err.response.data);
                        });
                });
                break;
            case "Visualizza tutti gli snack di una categoria":
                inquirer
                    .prompt(domandeVisualizzaSnackPerCategoria)
                    .then((answers) => {
                        axios
                            .get(
                                `http://localhost:20000/cat/${answers.categoria}`
                            )
                            .then((response) => {
                                console.log(response.data);
                            })
                            .catch((err) => {
                                console.log(err.response.data);
                            });
                    });
                break;
            case "Visualizza tutti gli snack con meno di un certo valore di calorie":
                inquirer
                    .prompt(domandeVisualizzaSnackPerCalorie)
                    .then((answers) => {
                        axios
                            .get(
                                `http://localhost:20000/cal/${answers.calorie}`
                            )
                            .then((response) => {
                                console.log(response.data);
                            })
                            .catch((err) => {
                                console.log(err.response.data);
                            });
                    });
                break;
            case "Esci":
                console.log("Bye!");
                return;
        }
    });
}

main();
