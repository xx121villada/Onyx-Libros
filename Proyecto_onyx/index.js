import express from 'express';
// Manipulación de archivos
import fs from 'fs';
// Tipo json
import bodyParser from "body-parser";
import cors from 'cors'; // Importa cors

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.get("/", (req, res) => {
    res.send("Bienvenido a mi API");
});

const readData = () => {
    try {
        const data = fs.readFileSync("./db.json");
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return { books: [] }; // Devuelve un array vacío si hay un error
    }
};

const writeData = (data) => {
    try {
        fs.writeFileSync("./db.json", JSON.stringify(data));
    } catch (error) {
        console.log(error);
    }
};

// GET para obtener todos los libros
app.get("/libros", (req, res) => {
    const data = readData();
    res.json(data.books);
});

// GET para un recurso específico
app.get("/libros/:id", (req, res) => {
    const data = readData();
    const id = parseInt(req.params.id);
    const book = data.books.find((book) => book.id === id);
    if (book) {
        res.json(book);
    } else {
        res.status(404).json({ message: "Libro no encontrado" });
    }
});

// POST para agregar un libro
app.post("/crear", (req, res) => {
    const { titulo, autor, anio, genero } = req.body;

    if (!titulo || !autor || !anio || !genero) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }

    const data = readData();
    const nuevoLibro = {
        id: Date.now(),
        title: titulo,
        author: autor,
        year: anio,
        genre: genero,
    };

    data.books.push(nuevoLibro);
    writeData(data);
    res.status(201).json({ message: "Libro agregado exitosamente" });
});

// PUT para actualizar un libro
app.put("/actualizar/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const { titulo, autor, anio, genero } = req.body;

    const data = readData();
    const index = data.books.findIndex((book) => book.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Libro no encontrado" });
    }

    data.books[index] = {
        id,
        title: titulo,
        author: autor,
        year: anio,
        genre: genero,
    };
    writeData(data);
    res.json({ message: "Libro actualizado exitosamente" });
});

// DELETE para eliminar un libro
app.delete("/eliminar/:id", (req, res) => {
    const id = parseInt(req.params.id);
    const data = readData();
    const index = data.books.findIndex((book) => book.id === id);
    if (index === -1) {
        return res.status(404).json({ message: "Libro no encontrado" });
    }

    data.books.splice(index, 1);
    writeData(data);
    res.json({ message: "Libro eliminado exitosamente" });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor en ejecución en http://localhost:${PORT}`);
});
