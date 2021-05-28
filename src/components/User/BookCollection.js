import React, { Component } from 'react';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'
import { AiFillPrinter } from "react-icons/ai";

const Row = ({ isbn, title, author, price, checkoutDate }) => (
  <tr>
    <td>{isbn}</td>
    <td>{title}</td>
    <td>{author}</td>
    <td>{price}</td>
    <td>{checkoutDate}</td>
  </tr>
)

class BookTableChecked extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isbn: 0,
      title: "",
      author: "",
      price: 0.0,
      checkoutDate: ""
    }

    this.exportBookCollectionPDF = this.exportBookCollectionPDF.bind(this);
  }

  exportBookCollectionPDF = () => {
    let unit = "pt";
    let size = "A4";
    let orientation = "portrait";

    let marginLeft = 40;
    let doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    let title = "My Awesome Report";
    let headers = [["isbn", "title", "author", "price", "Checkout Date"]];

    let bookCollection = this.props.books.map(elt => [elt.isbn, elt.title, elt.author, elt.price, elt.checkoutDate]);

    let content = {
      startY: 50,
      head: headers,
      body: bookCollection
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf")
  }

  render() {
    const rows = this.props.books.map((rowData) => <Row {...rowData} />);

    return (
      <div className="tableContainer">
        <h2>Your Books</h2>
        <div className="tableIcons">
          <AiFillPrinter size="2em" color="navy" onClick={() => this.exportBookCollectionPDF()} />
        </div>
        <table>
          <th>ISBN</th>
          <th>Title</th>
          <th>Author</th>
          <th>Price</th>
          <th>Checkout Date</th>
          {rows}
        </table>
      </div>
    );
  }
}

export default BookTableChecked;