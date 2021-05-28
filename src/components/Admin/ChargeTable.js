import React, { Component } from 'react';
import axios from 'axios';
import { RiPencilFill, RiDeleteBin5Fill } from "react-icons/ri";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import { jsPDF } from "jspdf";
import 'jspdf-autotable';
import { AiFillPrinter, AiFillPlusCircle } from "react-icons/ai";

const Row = ({ id, type, price, description, person, removeCharge}) => (
  <tr>
    <td>{id}</td>
    <td>{type}</td>
    <td>${price}</td>
    <td>{description}</td>
    <td>{person.name}</td>
    <td>
      <a onClick={() => removeCharge(id)}><RiDeleteBin5Fill /></a>
    </td>
  </tr>
)

const Option = ({ userID, name }) => (
  <option value={userID}>{name}</option>
)

class ChargeTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      patronData: [],
      patronId: '',
      id: 0,
      type: "",
      price: 0.0,
      description: '',
      person: "",
      showAddCharge: false,
      message: false
    }
    this.handleShowAddCharge = this.handleShowAddCharge.bind(this);
    this.removeCharge = this.removeCharge.bind(this);
  }

  componentDidMount() {
    axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/charge`)
      .then((res) => {
        this.setState({
          data: res.data
        });
      })
    console.log(this.state.data);
    axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/person/patron`)
      .then((res) => {
        this.setState({
          patronData: res.data,
        });
        console.log(this.state.patronData);
      })

  }

  handleClose = () => {
    this.setState({
      showAddCharge: false,
      showEditCharge: false,
      message: false
    })
  };
  handleShowAddCharge = () => {
    this.setState({
      showAddCharge: true
    })
  };

  exportChargePDF = () => {
    let unit = "pt";
    let size = "A4";
    let orientation = "portrait";

    let marginLeft = 40;
    let doc = new jsPDF(orientation, unit, size);

    doc.setFontSize(15);

    let title = "My Awesome Report";
    let headers = [["id", "type", "price", "description", "patron"]];

    let data = this.state.data.map(elt => [elt.id, elt.type, elt.price, elt.description, elt.person.name]);

    console.log(data);
    let content = {
      startY: 50,
      head: headers,
      body: data
    };

    doc.text(title, marginLeft, 40);
    doc.autoTable(content);
    doc.save("report.pdf")
  }

  removeCharge = (id) => {
    var temp = this.state.data;

    for (var i = 0; i < temp.length; i++) {
      if (temp[i].id == id) {
        temp.splice(i, 1);
      }
    }

    this.setState({
      data: temp
    })

    axios.delete(`https://c868capstoneproject.herokuapp.com/api/v1/charge/${id}`)
  }
  addCharge = (event) => {
    event.preventDefault()

    var { title,type, price, description, patronId } = this.state;
    if (title != '' && type != '' && price != 0 && price != '' && description != '') {
      var date = new Date();
      var dd = String(date.getDate()).padStart(2, '0');
      var mm = String(date.getMonth() + 1).padStart(2, '0');
      var yyyy = date.getFullYear();

      date = yyyy + '-' + mm + '-' + dd;
      var bodyformData = new FormData();
      bodyformData.append('file', this.state.file);
      axios.post(
        `https://c868capstoneproject.herokuapp.com/api/v1/charge/${patronId}`, {
        "id": 0,
        "type": type,
        "price": price,
        "date": date,
        "description": description
      }
      ).then((response) => {
        var temp = this.state.data;
        var json = { id: "In Progress", type: type, price: price, description: description, person: "In Progress" };
        temp.push(json);

        this.setState(
          {
            showAddCharge: false,
            data: temp
          })
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
  render() {
    const rows = this.state.data.map((rowData) => <Row removeCharge={this.removeCharge} handleShowEditCharge={this.handleShowEditCharge} {...rowData} />);
    const patrons = this.state.patronData.map((rowData) => <Option {...rowData} />);
    return (
      <div className="tableContainer">
        <h2>Charge</h2>
        <div className="tableIcons">
          <AiFillPrinter size="2em" color="navy" onClick={() => this.exportChargePDF()} />
          <AiFillPlusCircle size="2em" color="navy" onClick={this.handleShowAddCharge} />
        </div>
        <table>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Price</th>
            <th>Description</th>
            <th>Patron</th>
            <th>Remove</th>
          </tr>
          {rows}
        </table>
        <Modal show={this.state.showAddCharge} onHide={this.handleClose} addCharge={this.addCharge}>
          <Modal.Header closeButton>
            <Modal.Title>Add Charge</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div>
              <form>
                <label>
                  Title:
                    <input type="text" readOnly={false} name="title" value={this.state.title} onChange={e => this.setState({ title: e.target.value })} />
                </label>
                <br />
                <label>
                  Type:
                    <select name="type" readOnly={false} name="type" value={this.state.type} onChange={e => this.setState({ type: e.target.value })}>
                    <option>Select Type</option>
                    <option value="DamagedBook">Damaged Book</option>
                    <option value="LostBook">Lost Book</option>
                  </ select>
                </label>
                <br />
                <label>
                  Patron:
                    <select name="type" readOnly={false} name="type" value={this.state.patronId} onChange={e => this.setState({ patronId: e.target.value })}>
                    <option>Select Patron</option>
                    {patrons}
                  </ select>
                </label>
                <label>
                  Price:
                    <input type="text" readOnly={false} name="author" value={this.state.price} onChange={e => this.setState({ price: e.target.value })} />
                </label>
                <label>
                  Description:
                    <input type="text" readOnly={false} name="description" value={this.state.description} onChange={e => this.setState({ description: e.target.value })} />
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
            <Button variant="primary" onClick={this.addCharge}>
              Add Charge
                </Button>
          </Modal.Footer>
        </Modal >
      </div>
    );

  }
}

export default ChargeTable;