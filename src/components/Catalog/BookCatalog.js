
import React from 'react';
import BookCard from './BookCard';

const BookCatalog = ({ books, reserveBook }) => {
    if(books == undefined){
        return(
            <div></div>
        )
    }
    return (
        <div className ="bookCatalog">
            <h2 className="bookCatalogTitle">Book Catalog</h2>
            {
                books.map((book, i) => {
                    console.log(book);
                    return (
                        <BookCard 
                            key = {i} 
                            isbn = {book.isbn}
                            title= {book.title}
                            author = {book.author}
                            description = {book.description}
                            pageCount = {book.pageCount}
                            price = {book.price}
                            genre = {book.genre}
                            status = {book.status}
                            url = {book.url}
                            reserveBook={reserveBook}/>
                    );
                })
            }
        </div>
    );
}

export default BookCatalog;