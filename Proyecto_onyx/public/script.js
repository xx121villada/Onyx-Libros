document.addEventListener("DOMContentLoaded", () => {
    const bookList = document.getElementById("book-list");
    const addBookBtn = document.getElementById("add-book-btn");
    const addBookModal = document.getElementById("add-book-modal");
    const closeAddModal = document.getElementById("close-add-modal");
    const addBookForm = document.getElementById("add-book-form");
    const updateBookModal = document.getElementById("update-book-modal");
    const closeUpdateModal = document.getElementById("close-update-modal");
    const updateBookForm = document.getElementById("update-book-form");

    const API_URL = "http://localhost:3000";  // Asegúrate de que el servidor esté en este puerto

    const fetchBooks = async () => {
        try {
            const response = await fetch(`${API_URL}/libros`);
            const books = await response.json();
            renderBooks(books);
        } catch (error) {
            console.error("Error al obtener los libros:", error);
        }
    };

    const renderBooks = (books) => {
        bookList.innerHTML = "";
        books.forEach(book => {
            const bookDiv = document.createElement("div");
            bookDiv.classList.add("book-item");

            bookDiv.innerHTML = `
                <h3>${book.title}</h3>
                <p>Autor: ${book.author}</p>
                <p>Año: ${book.year}</p>
                <p>Género: ${book.genre}</p>
                <button class="btn-update" data-id="${book.id}">Actualizar</button>
                <button class="btn-delete" data-id="${book.id}">Eliminar</button>
            `;

            bookList.appendChild(bookDiv);
        });

        // Añadir eventos a los botones de actualizar y eliminar
        document.querySelectorAll(".btn-update").forEach(btn => {
            btn.addEventListener("click", (e) => openUpdateModal(e.target.dataset.id));
        });
        document.querySelectorAll(".btn-delete").forEach(btn => {
            btn.addEventListener("click", (e) => confirmDeleteBook(e.target.dataset.id));
        });
    };

    const addBook = async (bookData) => {
        try {
            const response = await fetch(`${API_URL}/crear`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });

            if (response.ok) {
                await fetchBooks();
                Swal.fire({
                    title: "Éxito",
                    text: "Libro agregado exitosamente",
                    icon: "success",
                    allowOutsideClick: false,
                    confirmButtonText: "Cerrar",
                });
                addBookModal.style.display = "none";
            } else {
                throw new Error("Error al agregar el libro");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo agregar el libro. Inténtalo más tarde.", "error");
            console.error("Error al agregar el libro:", error);
        }
    };

    const updateBook = async (id, bookData) => {
        try {
            const response = await fetch(`${API_URL}/actualizar/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(bookData)
            });

            if (response.ok) {
                await fetchBooks();
                Swal.fire({
                    title: "Éxito",
                    text: "Libro actualizado exitosamente",
                    icon: "success",
                    allowOutsideClick: false,
                    confirmButtonText: "Cerrar",
                    timer: 5000
                });
                updateBookModal.style.display = "none";
            } else {
                throw new Error("Error al actualizar el libro");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo actualizar el libro. Inténtalo más tarde.", "error");
            console.error("Error al actualizar el libro:", error);
        }
    };

    const deleteBook = async (id) => {
        try {
            const response = await fetch(`${API_URL}/eliminar/${id}`, {
                method: "DELETE"
            });

            if (response.ok) {
                await fetchBooks();
                Swal.fire({
                    title: "Éxito",
                    text: "Libro eliminado exitosamente",
                    icon: "success",
                    allowOutsideClick: false,
                    confirmButtonText: "Cerrar",
                    timer: 5000
                });
            } else {
                throw new Error("Error al eliminar el libro");
            }
        } catch (error) {
            Swal.fire("Error", "No se pudo eliminar el libro. Inténtalo más tarde.", "error");
            console.error("Error al eliminar el libro:", error);
        }
    };

    const confirmDeleteBook = (id) => {
        Swal.fire({
            title: "¿Estás seguro?",
            text: "No podrás deshacer esta acción",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteBook(id);
            }
        });
    };

    const openUpdateModal = async (id) => {
        try {
            const response = await fetch(`${API_URL}/libros/${id}`);
            const book = await response.json();

            document.getElementById("edit-id").value = id;
            document.getElementById("update-titulo").value = book.title;
            document.getElementById("update-autor").value = book.author;
            document.getElementById("update-anio").value = book.year;
            document.getElementById("update-genero").value = book.genre;

            updateBookModal.style.display = "block";
        } catch (error) {
            Swal.fire("Error", "No se pudieron obtener los detalles del libro", "error");
            console.error("Error al obtener los detalles del libro:", error);
        }
    };

    // Abrir modal para agregar libro
    addBookBtn.addEventListener("click", () => {
        addBookModal.style.display = "block";
    });

    // Cerrar modal de agregar libro
    closeAddModal.addEventListener("click", () => {
        addBookModal.style.display = "none";
    });

    // Cerrar modal de actualizar libro
    closeUpdateModal.addEventListener("click", () => {
        updateBookModal.style.display = "none";
    });

    // Agregar libro
    addBookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const nuevoLibro = {
            titulo: document.getElementById("add-titulo").value,
            autor: document.getElementById("add-autor").value,
            anio: document.getElementById("add-anio").value,
            genero: document.getElementById("add-genero").value,
        };
        addBook(nuevoLibro);
    });

    // Actualizar libro
    updateBookForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const id = document.getElementById("edit-id").value;
        const libroActualizado = {
            titulo: document.getElementById("update-titulo").value,
            autor: document.getElementById("update-autor").value,
            anio: document.getElementById("update-anio").value,
            genero: document.getElementById("update-genero").value,
        };
        updateBook(id, libroActualizado);
    });

    // Cargar libros al cargar la página
    fetchBooks();
});
