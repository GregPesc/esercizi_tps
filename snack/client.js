import axios from "axios";

axios
    .put("http://localhost:10000/snack", {
        nome: "pipas",
        categoria: "patatina",
        peso: 100,
        prezzo: 3.5,
        calorie: 10,
    })
    .then((response) => {
        console.log(response.data);
    });
