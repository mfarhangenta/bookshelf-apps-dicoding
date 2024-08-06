const incompletedBookList = [];
const RENDER_EVENT = 'render-book ';
const SAVED_EVENT = 'saved-book ';
const STORAGE_KEY = 'BOOK_APPS';


function generateId() {
    return +new Date();
}

function generatebookObject(id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function findBook(bookId) {
    for (const bookItem of incompletedBookList) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function findBookIndex(bookId) {
    for (const index in incompletedBookList) {
        if (incompletedBookList[index].id === bookId) {
            return index;
        }
    }
    return -1;
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Your Browser not Support local storage');
        return false;
    }
    return true;
}

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(incompletedBookList);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const bookshelf of data) {
            incompletedBookList.push(bookshelf);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {

    const titleBook = document.createElement('h3');
    titleBook.innerText = `Judul : ${bookObject.title} `;

    const textAuthor = document.createElement('h4');
    textAuthor.innerText = `Penulis: ${bookObject.author}`;

    const textYear = document.createElement('p');
    textYear.innerText = `Tahun : ${bookObject.year}`;

    const container = document.createElement('article');
    container.classList.add('book_item');
    container.append(titleBook, textAuthor, textYear);

    
    if (bookObject.isComplete) {
        const greenBtn = document.createElement('button');
        greenBtn.classList.add('green');
        greenBtn.innerText = 'Belum selesai dibaca';

        const containerBtn = document.createElement('div');
        containerBtn.classList.add('action');
        containerBtn.append(greenBtn);
        container.append(containerBtn);

        greenBtn.addEventListener('click', function () {
            undoBookFromCompleted(bookObject.id);
        })

        const redBtn = document.createElement('button');
        redBtn.classList.add('red');
        containerBtn.append(redBtn);
        container.append(containerBtn);
        redBtn.innerText = 'Hapus';
        redBtn.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        })


    } else {
        const greenBtn = document.createElement('button');
        greenBtn.classList.add('green');
        greenBtn.innerText = 'Selesai dibaca';

        const containerBtn = document.createElement('div');
        containerBtn.classList.add('action');

        containerBtn.append(greenBtn);
        container.append(containerBtn);

        greenBtn.addEventListener('click', function () {
            addBookToCompleted(bookObject.id);
        })

        const redBtn = document.createElement('button');
        redBtn.classList.add('red');
        redBtn.innerText = 'Hapus';

        containerBtn.append(redBtn);
        container.append(containerBtn);


        redBtn.addEventListener('click', function () {
            removeBookFromCompleted(bookObject.id);
        })
    }
    return container;
}

function addBook() {
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = Number(document.getElementById('inputBookYear').value);
    const checkBook = document.getElementById('inputBookIsComplete').checked;


    const generatedID = generateId();
    const bookObject = generatebookObject(generatedID, titleBook, authorBook, yearBook, checkBook);
    incompletedBookList.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();

}

function addBookToCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}


function removeBookFromCompleted(bookId) {
    const bookTarget = findBookIndex(bookId);

    if (bookTarget === -1) return;

    incompletedBookList.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoBookFromCompleted(bookId) {
    const bookTarget = findBook(bookId);

    if (bookTarget === null) return;

    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        addBook();
    });
    if (isStorageExist()) {
        loadDataFromStorage();
    }
})

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

document.addEventListener(RENDER_EVENT, function () {
    console.log(incompletedBookList);
    const unfinishedBOOKLIST = document.getElementById('incompletedBookList');
    const finishedBOOKList = document.getElementById('completedBookList');

    unfinishedBOOKLIST.innerHTML = '';
    finishedBOOKList.innerHTML = '';

    for (const bookItem of incompletedBookList) {
        const bookElement = makeBook(bookItem);

        if (!bookItem.isComplete) {
            unfinishedBOOKLIST.append(bookElement);
        }
        else {
            finishedBOOKList.append(bookElement);
        }

    }

});











