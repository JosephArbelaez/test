import axios from 'axios';
import React, { Component } from 'react';

class NewNonFiction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            books: [],
            booksRandom: []
        }
    };

    componentDidMount = () => {
        axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/book/genre/NonFiction`)
            .then((res) => {
                var x = 0, y = 0, z = 0;
                var randomBooks = [];

                console.log(x, y, z);

                x = Math.floor(Math.random() * 7);
                while (y == 0 || y == x) {
                    y = Math.floor(Math.random() * 7);
                }
                while (z == 0 || z == x || z == y) {
                    z = Math.floor(Math.random() * 7);
                }
                console.log(x, y, z);
                randomBooks.push(res.data[x]);
                randomBooks.push(res.data[y]);
                randomBooks.push(res.data[z]);

                this.setState({
                    books: res.data,
                    booksRandom: randomBooks
                })
                console.log(randomBooks);

            })
    }
    render() {
        return (
            <div className="newBookContainer">
                <h2 className="newBookTitle"><b>New Non-Fiction</b></h2>
                {
                    this.state.booksRandom.map((book, i) => {
                        return (
                            <img className="newBookImage" src={book.url}></img>
                        )
                    })
                }
            </div>
        );
    }
}


export default NewNonFiction;