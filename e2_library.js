/* E2 Library - JS */

/*-----------------------------------------------------------*/
/* Starter code - DO NOT edit the code below. */
/*-----------------------------------------------------------*/

// global counts
let numberOfBooks = 0; // total number of books
let numberOfPatrons = 0; // total number of patrons

// global arrays
const libraryBooks = [] // Array of books owned by the library (whether they are loaned or not)
const patrons = [] // Array of library patrons.

// Book 'class'
class Book {
	constructor(title, author, genre) {
		this.title = title;
		this.author = author;
		this.genre = genre;
		this.patron = null; // will be the patron objet

		// set book ID
		this.bookId = numberOfBooks;
		numberOfBooks++;
	}

	setLoanTime() {
		// Create a setTimeout that waits 3 seconds before indicating a book is overdue

		const self = this; // keep book in scope of anon function (why? the call-site for 'this' in the anon function is the DOM window)
		setTimeout(function() {
			
			console.log('overdue book!', self.title)
			changeToOverdue(self);

		}, 3000)

	}
}

// Patron constructor
const Patron = function(name) {
	this.name = name;
	this.cardNumber = numberOfPatrons;

	numberOfPatrons++;
}


// Adding these books does not change the DOM - we are simply setting up the 
// book and patron arrays as they appear initially in the DOM.
libraryBooks.push(new Book('Harry Potter', 'J.K. Rowling', 'Fantasy'));
libraryBooks.push(new Book('1984', 'G. Orwell', 'Dystopian Fiction'));
libraryBooks.push(new Book('A Brief History of Time', 'S. Hawking', 'Cosmology'));

patrons.push(new Patron('Jim John'))
patrons.push(new Patron('Kelly Jones'))

// Patron 0 loans book 0
libraryBooks[0].patron = patrons[0]
// Set the overdue timeout
libraryBooks[0].setLoanTime()  // check console to see a log after 3 seconds


/* Select all DOM form elements you'll need. */ 
const bookAddForm = document.querySelector('#bookAddForm');
const bookInfoForm = document.querySelector('#bookInfoForm');
const bookLoanForm = document.querySelector('#bookLoanForm');
const patronAddForm = document.querySelector('#patronAddForm');

/* bookTable element */
const bookTable = document.querySelector('#bookTable')
/* bookInfo element */
const bookInfo = document.querySelector('#bookInfo')
/* Full patrons entries element */
const patronEntries = document.querySelector('#patrons')

/* Event listeners for button submit and button click */

bookAddForm.addEventListener('submit', addNewBookToBookList);
bookLoanForm.addEventListener('submit', loanBookToPatron);
patronAddForm.addEventListener('submit', addNewPatron)
bookInfoForm.addEventListener('submit', getBookInfo);

/* Listen for click patron entries - will have to check if it is a return button in returnBookToLibrary */
patronEntries.addEventListener('click', returnBookToLibrary)

/*-----------------------------------------------------------*/
/* End of starter code - do *not* edit the code above. */
/*-----------------------------------------------------------*/


/** ADD your code to the functions below. DO NOT change the function signatures. **/


/*** Functions that don't edit DOM themselves, but can call DOM functions 
     Use the book and patron arrays appropriately in these functions.
 ***/

// Adds a new book to the global book list and calls addBookToLibraryTable()
function addNewBookToBookList(e) {
	e.preventDefault();

	// Add book book to global array
	const newBookName = e.target[0].value;
	const newBookAuthor = e.target[1].value;
	const newBookGenre = e.target[2].value;
	const newBook = new Book(newBookName, newBookAuthor, newBookGenre);

	libraryBooks.push(newBook);

	// Call addBookToLibraryTable properly to add book to the DOM
	addBookToLibraryTable(newBook);
}

// Changes book patron information, and calls 
function loanBookToPatron(e) {
	e.preventDefault();

	// Get correct book and patron
	const bookId = e.target[0].value;
	const patronId = e.target[1].value;

	// Add patron to the book's patron property
	libraryBooks[bookId].patron = patrons[patronId];

	// Add book to the patron's book table in the DOM by calling addBookToPatronLoans()
	addBookToPatronLoans(libraryBooks[bookId]);

	// Start the book loan timer.
	libraryBooks[bookId].setLoanTime();

}

// Changes book patron information and calls returnBookToLibraryTable()
function returnBookToLibrary(e){
	e.preventDefault();
	
	// check if return button was clicked, otherwise do nothing.
	if(e.target.nodeName != 'BUTTON'){
		return ;
	}
	
	//find the book
	const bookId = e.target.parentElement.parentElement.getElementsByTagName('td')[0].innerText;
	
	// Call removeBookFromPatronTable()
	removeBookFromPatronTable(libraryBooks[bookId]);

	// Change the book object to have a patron of 'null'
	libraryBooks[bookId].patron = null;
}

// Creates and adds a new patron
function addNewPatron(e) {
	e.preventDefault();

	// Add a new patron to global array
	const newPatronName = e.target[0].value;
	const newPatron = new Patron(newPatronName);
	patrons.push(newPatron);

	// Call addNewPatronEntry() to add patron to the DOM
	addNewPatronEntry(newPatron);
}

// Gets book info and then displays
function getBookInfo(e) {
	e.preventDefault();

	// Get correct book
	console.log(e.target[0].value);
	const bookId = e.target[0].value;
	const book = libraryBooks[bookId];

	// Call displayBookInfo()	
	displayBookInfo(book);
}


/*-----------------------------------------------------------*/
/*** DOM functions below - use these to create and edit DOM objects ***/

// Adds a book to the library table.
function addBookToLibraryTable(book) {
	// Add code here
	console.log(book);

	//create new row in the table
	const newBook = document.createElement('tr');
	
	//add book Id to the table row as a cell element
	const bookId = document.createElement('td');
	bookId.textContent = book.bookId;
	newBook.appendChild(bookId);

	//add Book Title to table row as cell element
	const bookTitle = document.createElement('td');
	const titleText = document.createElement('strong');
	titleText.textContent = book.title;
	bookTitle.appendChild(titleText);
	newBook.appendChild(bookTitle);

	//add patron card to table row as cell element
	const patronCard = document.createElement('td');
	book.patron ? patronCard.textContent = book.patron 
	: patronCard.textContent = ""
	newBook.appendChild(patronCard);

	//add the row to the existing book table
	bookTable.appendChild(newBook);

}


// Displays deatiled info on the book in the Book Info Section
function displayBookInfo(book) {
	// Add code here
	console.log(bookInfo.getElementsByTagName('span'));
	const bookAttributes = bookInfo.getElementsByTagName('span');
	bookAttributes[0].innerText = book.bookId;
	bookAttributes[1].innerText = book.title;
	bookAttributes[2].innerText = book.author;
	bookAttributes[3].innerText = book.genre;
	book.patron ? bookAttributes[4].innerText = book.patron.name
	: bookAttributes[4].innerText = 'N/A';
}

// Adds a book to a patron's book list with a status of 'Within due date'. 
// (don't forget to add a 'return' button).
function addBookToPatronLoans(book) {
	// Add code here

	//Create new table row
	const newLoan  = document.createElement('tr');

	//add book Id to row
	const bookId = document.createElement('td');
	bookId.textContent = book.bookId;
	newLoan.appendChild(bookId);
	
	//add book title to row
	const bookTitle = document.createElement('td');
	const titleText = document.createElement('strong');
	titleText.textContent = book.title;
	bookTitle.appendChild(titleText);
	newLoan.appendChild(bookTitle);

	//add status to the row
	const status = document.createElement('td');
	const statusText = document.createElement('span');
	statusText.textContent = "Within due date";
	statusText.className = 'green';
	status.appendChild(statusText);
	newLoan.appendChild(status);

	//add return button to the row
	const returnBook = document.createElement('td');
	const returnButton = document.createElement('button');
	returnButton.className = 'return';
	returnButton.textContent = "return";
	returnBook.appendChild(returnButton);
	newLoan.appendChild(returnBook);

	//add row to respective patron's table
	const patronId = book.patron.cardNumber;
	const patronTable = patronEntries.getElementsByClassName('patronLoansTable')[patronId];
	patronTable.appendChild(newLoan);

	//add patrons card number to library table
	const loanedBook = bookTable.getElementsByTagName('tr')[book.bookId + 1];
	loanedBook.getElementsByTagName('td')[2].textContent = book.patron.cardNumber;
	//console.log(loanedBook.getElementsByTagName('td')[2].value);

}

// Adds a new patron with no books in their table to the DOM, including name, card number,
// and blank book list (with only the <th> headers: BookID, Title, Status).
function addNewPatronEntry(patron) {
	// Add code here
	console.log(patron);
	console.log(patronEntries);

	//to be added to patronEntries
	const newPatronBox = document.createElement('div');
	newPatronBox.className = 'patron';

	//Name: to be added to newPatronBox
	const patronNametag = document.createElement('p');
	const patronName = document.createElement('span');
	patronName.className = 'bold';
	patronName.innerText = patron.name;
	patronNametag.innerText = `Name: `;
	patronNametag.appendChild(patronName);
	newPatronBox.appendChild(patronNametag);

	//Card Number: to be added to newPatronBox
	const patronCardtag = document.createElement('p');
	const patronCard = document.createElement('span');
	patronCard.className = 'bold';
	patronCard.innerText = patron.cardNumber;
	patronCardtag.innerText = `Card Number: `;
	patronCardtag.appendChild(patronCard);
	newPatronBox.appendChild(patronCardtag);

	//title of the table
	const tableTitle = document.createElement('h4');
	tableTitle.innerText= 'Books on Loan:';
	newPatronBox.appendChild(tableTitle);

	//make table to be added to newPatronBox
	const patronTable = document.createElement('table');
	patronTable.className = 'patronLoansTable';
	const tableFirstRow = document.createElement('tr');
	const bookId = document.createElement('th');
	bookId.innerText = 'BookId';
	tableFirstRow.appendChild(bookId);
	const bookTitle = document.createElement('th');
	bookTitle.innerText = "Title";
	tableFirstRow.appendChild(bookTitle);
	const status = document.createElement('th');
	status.innerText = 'Status';
	tableFirstRow.appendChild(status);
	const returnBook = document.createElement('th');
	returnBook.innerText = 'Return';
	tableFirstRow.appendChild(returnBook);
	patronTable.appendChild(tableFirstRow);
	newPatronBox.appendChild(patronTable);

	//add new box to list of patrons
	patronEntries.appendChild(newPatronBox);
}


// Removes book from patron's book table and remove patron card number from library book table
function removeBookFromPatronTable(book) {
	// Add code here
	const loaningPatron = book.patron.cardNumber;
	const patron = patronEntries.getElementsByClassName('patron')[loaningPatron];
	const tableRows = patron.getElementsByTagName('tr');
	for(let i = 1; i < tableRows.length; i++){
		if(tableRows[i].getElementsByTagName('td')[0].innerText == book.bookId){
			console.log(tableRows[i].parentElement);
			tableRows[i].parentElement.deleteRow(i);
			break;
		}
	}

	//change table of books to remove the patron
	const returnedBook = bookTable.getElementsByTagName('tr')[book.bookId + 1];
	returnedBook.getElementsByTagName('td')[2].textContent = "";
}

// Set status to red 'Overdue' in the book's patron's book table.
function changeToOverdue(book) {
	// Add code here
	const loaningPatron = book.patron.cardNumber;
	const patron = patronEntries.getElementsByClassName('patron')[loaningPatron];
	const tableRows = patron.getElementsByTagName('tr');
	for(let i = 1; i < tableRows.length; i++){
		if(tableRows[i].getElementsByTagName('td')[0].innerText == book.bookId){
			console.log(tableRows[i].getElementsByTagName('td')[2].getElementsByTagName('span')[0]);
			const statusCell = tableRows[i].getElementsByTagName('td')[2].getElementsByTagName('span')[0];
			statusCell.innerText = 'OverDue';
			statusCell.className = 'red';
			break;
		}
	}
}

