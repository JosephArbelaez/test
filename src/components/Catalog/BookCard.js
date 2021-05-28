import React from 'react';

const BookCard = ({ isbn, title, author, description, pageCount, price, genre, status, url, reserveBook}) => {

    return (
        <div className ="bookCard">
            <img src={url} className="bookCardImg"></img>
            <div className ="bookCardDescription">
                <h3 className = "bookCardText"><b>{title}</b></h3>
                <p className = "bookCardText"><b>Author: </b>{author}</p>
                <p className = "bookCardText"><b>ISBN: </b>{isbn}</p>
                    <p className = "bookCardText"><b>Description: </b>{description}</p>           
                <p claclassNamess = "bookCardText"><b>Page Count: </b>{pageCount} pages</p>
                <p className = "bookCardText"><b>Price: </b>${price.toFixed(2)}</p>
                <p className = "bookCardText"><b>Genre: </b>{genre}</p>
                <p className = "bookCardText"><b>Status: </b>{status}</p>
                <button className="reserveButton" onClick={() => reserveBook(isbn)}>Reserve</button>
            </div>
        </div>
    );
}

export default BookCard;