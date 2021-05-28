
import axios from 'axios';
import React, { Component } from 'react';
import BookCatalog from '../Catalog/BookCatalog';
import BookCollection from '../User/BookCollection';
import ChargeCard from '../User/ChargeCard';
import UserCard from '../User/UserCard';
import { BsSearch } from "react-icons/bs";



class UserAccount extends Component {

    constructor(props) {
        super(props);
        this.state = {
            books: [],
            bookResults: [],
            bookCollection: [],
            dropzoneActive: false,
            file: [],
            charges: [],
            chargeSum: 0,
            value: '',
            tab: "books"
        };

        this.handleChange = this.handleChange.bind(this);
        this.changeTab = this.changeTab.bind(this);
    };

    componentDidMount() {
        axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/book`)
            .then((res) => {
                var temp = [];

                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].title = (res.data[i].title.charAt(0).toUpperCase() + res.data[i].title.slice(1));
                    if (res.data[i].person) {
                        if (res.data[i].person.userID == this.props.userID) {
                            temp.push(res.data[i]);
                        }
                    }
                }

                this.setState({
                    books: res.data,
                    bookResults: res.data,
                    bookCollection: temp
                });
            })

        axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/charge`)
            .then((res) => {
                var temp = [];
                var total = [];
                for (var i = 0; i < res.data.length; i++) {
                    if (res.data[i].person) {
                        if (res.data[i].person.userID == this.props.userID) {
                            temp.push(res.data[i]);
                            total.push(res.data[i].price);
                        }
                    }
                }

                var sum = total.reduce(function (a, b) {
                    return a + b;
                }, 0);

                this.setState({
                    charges: temp,
                    chargeSum: sum.toFixed(2)
                })
            }
            )
        axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/book`)
            .then((res) => {
                var temp = [];

                for (var i = 0; i < res.data.length; i++) {
                    res.data[i].title = (res.data[i].title.charAt(0).toUpperCase() + res.data[i].title.slice(1));
                    if (res.data[i].person) {
                        if (res.data[i].person.userID == this.props.userID) {
                            temp.push(res.data[i]);
                        }
                    }
                }

                this.setState({
                    books: res.data,
                    bookResults: res.data,
                    bookCollection: temp
                });
            })

    }

    searchBooks = (event) => {
        event.preventDefault()
        var sString = this.state.value;
        axios.get(
            `https://c868capstoneproject.herokuapp.com/api/v1/book/${sString}`
        ).then(res => {
            var temp = res.data;
            for (var i = 0; i < res.data.length; i++) {
                temp[i].title = (temp[i].title.charAt(0).toUpperCase() + temp[i].title.slice(1));
            }
            this.setState({
                bookResults: res.data
            })
        });
    }
    handleChange(event) {
        this.setState({ value: event.target.value });
    }

    changeTab = (string) => {
        this.setState({
            tab: string
        })
    }

    reserveBook = (isbn) => {
        this.state.books.forEach((element) => {
            if (element.isbn == isbn) {
                element.status = "reserved"
                var date = new Date();
                var dd = String(date.getDate()).padStart(2, '0').toString();
                var mm = String(date.getMonth() + 1).padStart(2, '0').toString();
                var yyyy = date.getFullYear().toString();
          
                date = yyyy + '-' + mm + '-' + dd;
                axios.put(`https://c868capstoneproject.herokuapp.com/api/v1/book/reserve/${this.props.userID}`, {
                    "isbn": element.isbn,
                    "title": element.title,
                    "author": element.author,
                    "description": element.description,
                    "pageCount": element.pageCount,
                    "price": element.price,
                    "status": element.status,
                    "genre": element.genre,
                    "url": element.url,
                    "person_id":this.props.userID
                }
                ).then((response) => {
                    console.log(response);
                    var temp = this.state.bookCollection;
                    temp.push({isbn:element.isbn, title: element.title, author: element.author, price: element.price, checkoutDate: date})
                    this.setState({
                        bookCollection: temp
                    })
                }, (error) => {
                    console.log(error);
                });
            }
        })
    }
    renderSwitch = () => {
        switch (this.state.tab) {
            case "books":
                return (
                    <div className="userContainer">
                        <BookCollection books={this.state.bookCollection} />
                    </div>
                )
            case "reserve":
                return (
                    <div className="userContainer">
                        <form className="search" onSubmit={this.searchBooks}>
                            <input className="searchText" type="text" value={this.state.value} onChange={this.handleChange} />
                            <button type="submit" value="Submit" className="searchButton"><BsSearch size="1.5em" color="white" /> Search</button>
                        </form>
                        <BookCatalog books={this.state.bookResults} reserveBook={this.reserveBook} />
                    </div>
                )
        }
    }
    render() {
        return (
            <div className="userAccountPage">
                <div className="user-fifth">
                    <UserCard
                        userID={this.props.userID}
                        name={this.props.name}
                        cardNumber={this.props.cardNumber}
                        url={this.props.url} />
                    <ChargeCard chargeTotal={this.state.chargeSum} />
                </div>
                <div className="user-fourfifths">
                    <div className="adminTabs">
                        <button className="adminTabButton" onClick={() => this.changeTab("books")}>Home</button>
                        <button className="adminTabButton" onClick={() => this.changeTab("reserve")}>Reserve</button>
                    </div>
                    {this.renderSwitch()}
                </div >
            </div>
        );
    }
}

export default UserAccount;