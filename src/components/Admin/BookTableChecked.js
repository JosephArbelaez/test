import React, { Component } from 'react';
import axios from 'axios';
import { RiPencilFill} from "react-icons/ri";
import { GrReturn } from "react-icons/gr";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { AiFillPrinter } from "react-icons/ai";

const Row = ({ isbn, title, author, description, pageCount, price, genre, person, handleShowEditBook, checkInBook }) => (
  <tr>
    <td>{isbn}</td>
    <td>{title}</td>
    <td>{author}</td>
    <td>{pageCount}</td>
    <td>${price}</td>
    <td>{genre}</td>
    <td>{person.name}</td>
    <td>
      <a onClick={() => handleShowEditBook(isbn, title, author, description, pageCount, price, genre)}><RiPencilFill /></a>
    </td>
    <td>
      <a onClick={() => checkInBook(isbn)}><GrReturn /></a>
    </td>
  </tr>
)

class BookTableChecked extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      isbn: 0,
      title: "",
      author: "",
      description: "",
      pageCount: 0,
      price: 0.0,
      genre: "",
      person: "",
      showEditBook: false,
      message: false
    }
    this.handleShowEditBook = this.handleShowEditBook.bind(this);
    this.exportCheckedBookPDF = this.exportCheckedBookPDF.bind(this)
    this.checkInBook = this.checkInBook.bind(this);
  }

  componentDidMount = () => {
    axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/book/checked`)
      .then((res) => {
        this.setState({
          data: res.data,
        });
      })
  }

  handleClose = () => {
    this.setState({
      showAddBook: false,
      showEditBook: false,
      message: false
    })
  };
  handleShowAddBook = () => {
    this.setState({
      showAddBook: true
    })
  };

  handleShowEditBook = (isbn, title, author, description, pageCount, price, genre) => {
    this.setState({
      isbn: isbn,
      title: title,
      author: author,
      description: description,
      pageCount: pageCount,
      price: price,
      genre: genre,
      showEditBook: true
    })
  };
  editBook = () => {
    var { isbn, title, author, description, pageCount, price, genre } = this.state;
    if (title != '' && author != '' && description != '' && pageCount != 0 && pageCount != '' && price != 0 && price != '' && genre != ''){
      var temp = this.state.data;
      for (var i = 0; i < temp.length; i++) {
        if (temp[i].isbn == isbn) {
          temp[i].title = title;
          temp[i].author = author;
          temp[i].description = description;
          temp[i].pageCount = pageCount;
          temp[i].price = price;
          temp[i].genre = genre;
        }
      }
      this.setState({
        data: temp
      })
      var bodyformData = new FormData();
      bodyformData.append('file', this.state.file);

      axios.put(
        `https://c868capstoneproject.herokuapp.com/api/v1/book/`, {
        "isbn": isbn,
        "title": title,
        "author": author,
        "description": description,
        "pageCount": pageCount,
        "price": price,
        "genre": genre
      }
      ).then((response) => {
        this.handleClose();
      }, (error) => {
        console.log(error);
      });
    } else {
      this.setState({
        message: true
      })
    }
  }

  checkInBook = (isbn) => {
    this.state.data.forEach((element) => {
      if (element.isbn == isbn) {
        var temp = this.state.data;
        for (var i = 0; i < temp.length; i++) {
          if (temp[i].isbn == isbn) {
            temp.splice(i, 1);
          }
        }
    
        this.setState({
          data: temp
        })
          element.status = ''
          axios.put(`https://c868capstoneproject.herokuapp.com/api/v1/book/checkin`, {
              "isbn": element.isbn,
              "title": element.title,
              "author": element.author,
              "description": element.description,
              "pageCount": element.pageCount,
              "price": element.price,
              "status": '',
              "genre": element.genre,
              "url": element.url
          }
          )
      }
  })
  }

  exportCheckedBookPDF = () => {
    let unit = "pt";
    let size = "A4";
    let orientation = "portrait";

    let marginLeft = 40;
    let doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    let title = "My Awesome Report";
    let headers = [["isbn", "title", "author", "description", "pageCount", "price", "genre", "patron"]];

    let data = this.state.data.map(elt => [elt.isbn, elt.title, elt.author, elt.description, elt.pageCount, elt.price, elt.genre, elt.person.name]);

    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf")
  }



  render() {
    const rows = this.state.data.map((rowData) => <Row checkInBook={this.checkInBook} handleShowEditBook={this.handleShowEditBook} {...rowData} />);

    return (
      <div className="tableContainer">
        <h2>Checked Books</h2>
        <div className="tableIcons">
          <AiFillPrinter size="2em" color="navy" onClick={() => this.exportCheckedBookPDF()} />
        </div>
        <table>
          <th>ISBN</th>
          <th>Title</th>
          <th>Author</th>
          <th>Page Count</th>
          <th>Price</th>
          <th>Genre</th>
          <th>Patron</th>
          <th>Edit</th>
          <th>Return</th>
          {rows}
        </table>
        <Modal show={this.state.showEditBook} onHide={this.handleClose} editBook={this.editbook}>
          <Modal.Header closeButton>
            <Modal.Title>Edit Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <form>
                <label>
                  ISBN:
                    <input type="text" readOnly={true} name="ISBN" value={this.state.isbn} />
                </label>
                <label>
                  Title:
                    <input type="text" readOnly={false} name="title" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
                </label>
                <label>
                  Author:
                    <input type="text" readOnly={false} name="author" value={this.state.author} onChange={e => this.setState({ author: e.target.value })} />
                </label>
                <label>
                  Description:
                    <input type="text" readOnly={false} name="description" value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
                </label>
                <label>
                  Page Count:
                    <input type="text" readOnly={false} name="pageCount" value={this.state.pageCount} onChange={e => this.setState({ pageCount: e.target.value })} />
                </label>
                <label>
                  Price:
                    <input type="text" readOnly={false} name="price" value={this.state.price} onChange={e => this.setState({ price: e.target.value })} />
                </label>
                <label>
                  Genre:
                    <input type="text" readOnly={false} name="genre" value={this.state.genre} onChange={e => this.setState({ genre: e.target.value })} />
                </label>
              </form>
            </div>
            {
              this.state.message == '' ? <div></div> : <p className="message">Invalid Data</p>
            }
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleClose}>
              Close
                </Button>
            <Button variant="primary" onClick={this.editBook}>
              Save Changes
                </Button>
          </Modal.Footer>
        </Modal >
      </div >
    );
  }
}

export default BookTableChecked;