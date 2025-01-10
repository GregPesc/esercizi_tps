import express from "express";
import sqlite3 from "sqlite3";

const app = express();

app.use(express.json());

// PUT /snack    Inserisci uno snack nel DB
app.put("/snack", (req, res) => {
    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare(
        "INSERT INTO snack (nome, categoria, peso, prezzo, calorie) VALUES (?, ?, ?, ?, ?);"
    );

    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize)
                console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    const snack = req.query;

    if (isNaN(parseFloat(snack.prezzo))) {
        return res.status(400).send("Valore prezzo non valido");
    }
    if (isNaN(parseInt(snack.peso))) {
        return res.status(400).send("Valore peso non valido");
    }
    if (isNaN(parseInt(snack.calorie))) {
        return res.status(400).send("Valore calorie non valido");
    }

    stmt.run(
        snack.nome.toLowerCase(),
        snack.categoria.toLowerCase(),
        snack.peso,
        snack.prezzo,
        snack.calorie,
        (err) => {
            if (err) {
                console.error("Errore Run:", err.message);
                res.status(500).send(err.message);
            } else {
                res.send("Snack inserito correttamente");
            }

            stmt.finalize((errFinalize) => {
                if (errFinalize)
                    console.error("Errore Finalize:", errFinalize.message);
            });
            db.close((errClose) => {
                if (errClose) console.error("Errore Close:", errClose.message);
            });
        }
    );
});

// GET /snack/<nome_snack>  Recupera i dati su uno snack
app.get("/snack/:nome", (req, res) => {
    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare("SELECT * FROM snack WHERE nome = ?;");

    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize)
                console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    stmt.all(req.params.nome.toLowerCase(), (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        stmt.finalize((errFinalize) => {
            if (errFinalize)
                console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });
});

// GET /cat/<nome_categoria> Recupera tutti gli snack di una certa categoria
app.get("/cat/:categoria", (req, res) => {
    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare("SELECT * FROM snack WHERE categoria = ?;");

    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize)
                console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    stmt.all(req.params.categoria.toLowerCase(), (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        stmt.finalize((errFinalize) => {
            if (errFinalize)
                console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });
});

// GET /cal/<quantità_calorie>  Recupera tutti gli snack che complessivamente forniscono meno di <quantità_calorie></quantità_calorie>
app.get("/cal/:calorie", (req, res) => {
    const limiteCalorie = parseInt(req.params.calorie);

    if (isNaN(limiteCalorie)) {
        return res.status(400).send("Valore calorie non valido");
    }

    const db = new sqlite3.Database("snack.db", (err) => {
        if (err) {
            console.error("Errore apertura DB:", err.message);
            return res.status(500).send(err.message);
        }
    });

    const stmt = db.prepare(
        "SELECT * FROM snack WHERE peso * calorie / 100 < ?;"
    );

    stmt.on("error", (error) => {
        console.error("Errore Statement:", error.message);
        res.status(500).send(error.message);
        stmt.finalize((errFinalize) => {
            if (errFinalize)
                console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });

    stmt.all(limiteCalorie, (err, rows) => {
        if (err) {
            console.error("Errore Query:", err.message);
            res.status(500).send(err.message);
        } else {
            res.json(rows);
        }

        stmt.finalize((errFinalize) => {
            if (errFinalize)
                console.error("Errore Finalize:", errFinalize.message);
        });
        db.close((errClose) => {
            if (errClose) console.error("Errore Close:", errClose.message);
        });
    });
});

// Crea file db
const db = new sqlite3.Database("snack.db", (err) => {
    if (err) {
        console.error("Errore apertura DB:", err.message);
    }
});

// Crea tabella Snack se non esiste
db.run(
    `
    CREATE TABLE IF NOT EXISTS "Snack" (
    "nome"    TEXT NOT NULL,
    "categoria"   TEXT NOT NULL,
    "prezzo"    NUMERIC NOT NULL CHECK(prezzo >= 0),
    "peso"    INTEGER NOT NULL CHECK(peso > 0),
    "calorie"    INTEGER NOT NULL CHECK(calorie > 0),
    PRIMARY KEY("nome") \
    );
    `
);

// Aggiungi alcuni dati
db.run(
    `
    INSERT INTO "Snack" ("nome", "categoria", "prezzo", "peso", "calorie")
    VALUES
    ('patatine classiche', 'salato', 1.99, 100, 500),
    ('patatine paprika', 'salato', 2.49, 80, 420),
    ('cioccolato al latte', 'dolce', 1.50, 50, 250),
    ('barretta energetica', 'salute', 1.99, 45, 180),
    ('biscotti integrali', 'dolce', 2.39, 120, 480);
    `,
    (err) => {}
);

// Avvia il server in ascolto
app.listen(20000, () => {
    console.log("Server in ascolto sulla porta 20000");
});
