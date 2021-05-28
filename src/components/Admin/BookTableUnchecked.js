import React, { Component } from 'react';
import axios from 'axios';
import { RiPencilFill, RiDeleteBin5Fill } from "react-icons/ri";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropzone from 'react-dropzone';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { AiFillPrinter, AiFillPlusCircle } from "react-icons/ai";

const Row = ({ isbn, title, author, description, pageCount, price, genre, handleShowEditBook, removeBook }) => (
  <tr>
    <td>{isbn}</td>
    <td>{title}</td>
    <td>{author}</td>
    <td>{pageCount}</td>
    <td>${price}</td>
    <td>{genre}</td>
    <td className="edit">
      {isbn == "In Progress" ? <div></div> :
        <a onClick={() => handleShowEditBook(isbn, title, author, description, pageCount, price, genre)}><RiPencilFill /></a>
      }
    </td>
    <td className="remove">
      {isbn == "In Progress" ? <div></div> :
        <a onClick={() => removeBook(isbn)}><RiDeleteBin5Fill /></a>
      }
    </td>
  </tr>
)

class BookTableUnchecked extends Component {

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
      showAddBook: false,
      showEditBook: false,
      message: false,
      file: ''
    }
    this.handleShowAddBook = this.handleShowAddBook.bind(this);
    this.handleShowEditBook = this.handleShowEditBook.bind(this);
    this.removeBook = this.removeBook.bind(this);
  }

  componentDidMount = () => {
    axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/book/unchecked`)
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
    var { isbn, title, author, description, pageCount, price, genre, file } = this.state;
    if (title != '' && author != '' && description != '' && pageCount != 0 && pageCount != '' && price != 0 && price != '' && genre != '' && file != '') {
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

  removeBook = (isbn) => {
    var temp = this.state.data;

    for (var i = 0; i < temp.length; i++) {
      if (temp[i].isbn == isbn) {
        temp.splice(i, 1);
      }
    }

    this.setState({
      data: temp
    })

    axios.delete(`https://c868capstoneproject.herokuapp.com/api/v1/book/${isbn}`)
  }

  exportUncheckedBookPDF = () => {
    let unit = "pt";
    let size = "A4";
    let orientation = "portrait";

    let marginLeft = 40;
    let doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    let title = "My Awesome Report";
    let headers = [["isbn", "title", "author", "description", "pageCount", "price", "genre"]];

    let data = this.state.data.map(elt => [elt.isbn, elt.title, elt.author, elt.description, elt.pageCount, elt.price, elt.genre]);

    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf")
  }

  handleOnDrop = (files) => {
    files.map(f => {
      this.setState({
        file: f
      })
    })
    console.log(this.state.file);
  }

  addBook = (event) => {
    event.preventDefault()
    var bodyformData = new FormData();
    bodyformData.append('file', this.state.file);

    var { isbn, title, author, description, pageCount, price, genre } = this.state;
    if (isbn != 0 && isbn != '' && title != '' && author != '' && description != '' && pageCount != 0 && pageCount != '' && price != 0 && price != '' && genre != '') {
      axios({
        method: "post",
        url: "https://c868capstoneproject.herokuapp.com/storage/uploadFile",
        data: bodyformData,
        headers: { "Content-Type": "multipart/form-data" },
      }).then((res) => {
        this.setState({
          url: res.data
        })
        const { url } = this.state;
        axios.post(
          `https://c868capstoneproject.herokuapp.com/api/v1/book`, {
          "isbn": isbn,
          "title": title,
          "author": author,
          "description": description,
          "pageCount": pageCount,
          "price": price,
          "genre": genre,
          "url": url
        }
        ).then((response) => {
          var temp = this.state.data;
          var json = { title: title, author: author, description: description, pageCount: pageCount, price: price, genre: genre, url: url, isbn: "In Progress" };
          temp.push(json);

          this.setState(
            {
              showAddBook: false,
              data: temp
            })
          this.handleClose();
        }, (error) => {
          console.log(error);
        });
      });
    } else {
      this.setState({
        message: true
      })
    }
  }
  render() {
    const rows = this.state.data.map((rowData) => <Row remove={this.remove} removeBook={this.removeBook} handleShowEditBook={this.handleShowEditBook} {...rowData} />);
    const baseStyle = {
      width: 300,
      height: 100,
      borderWidth: 2,
      borderColor: '#666',
      borderStyle: 'solid',
      margin: '5px',
    };
    const activeStyle = {
      borderStyle: 'solid',
      borderColor: '#6c6',
      backgroundColor: '#eee',
      alignContent: 'center'
    };
    const rejectStyle = {
      borderStyle: 'solid',
      borderColor: '#c66',
      backgroundColor: '#eee',
      alignContent: 'center'
    };
    return (
      <div className="tableContainer">
        <h2>Unchecked Books</h2>
        <div className="tableIcons">
          <AiFillPrinter size="2em" color="navy" onClick={() => this.exportUncheckedBookPDF()} />
          <AiFillPlusCircle size="2em" color="navy" onClick={this.handleShowAddBook} />
        </div>
        <table>
          <th>ISBN</th>
          <th>Title</th>
          <th>Author</th>
          <th>Page Count</th>
          <th>Price</th>
          <th>Genre</th>
          <th>Edit</th>
          <th>Remove</th>
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
        <Modal show={this.state.showAddBook} onHide={this.handleClose} addBook={this.addBook}>
          <Modal.Header closeButton>
            <Modal.Title>Add Book</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <form>
                <label>
                  ISBN:
                    <input type="text" readOnly={false} name="ISBN" value={this.state.isbn} onChange={e => this.setState({ isbn: e.target.value })} />
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
                <Dropzone className="dropzone" onDrop={this.handleOnDrop} multiple={false}>
                  {({ getRootProps, getInputProps, isDragActive, isDragReject }) => {
                    let styles = { ...baseStyle };
                    styles = isDragActive ? { ...styles, ...activeStyle } : styles
                    styles = isDragReject ? { ...styles, ...rejectStyle } : styles
                    return (
                      <div
                        {...getRootProps()}
                        style={styles}
                      >
                        <input {...getInputProps()} />
                        {
                          isDragActive ?
                            <p>Drop files here</p> :
                            <p>Add Book Picture</p>
                        }
                      </div>
                    )
                  }}
                </Dropzone>
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
            <Button variant="primary" onClick={this.addBook}>
              Save Changes
                </Button>
          </Modal.Footer>
        </Modal >
      </div>
    );

  }
}

export default BookTableUnchecked;