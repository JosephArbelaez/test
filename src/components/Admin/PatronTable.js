import React, { Component } from 'react';
import axios from 'axios';
import { AiFillPlusCircle } from "react-icons/ai";
import { RiPencilFill, RiDeleteBin5Fill } from "react-icons/ri";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import 'bootstrap/dist/css/bootstrap.min.css';
import Dropzone from 'react-dropzone';

const Row = ({ userID, name, email, activated, cardNumber, handleShowEditPatron, remove }) => (
  <tr>
    <td>{userID}</td>
    <td>{name}</td>
    <td>{email}</td>
    {
      activated ? <td>true</td> : <td>false</td>
    }
    <td>{cardNumber}</td>
    <td>
      {userID == "In Progress" ? <div></div> :
        <a onClick={() => handleShowEditPatron(userID, name, email)}><RiPencilFill /></a>
      }
    </td>
    <td>
      {userID == "In Progress" ? <div></div> :
        <a onClick={() => remove(userID)}><RiDeleteBin5Fill /></a>
      }
    </td>
  </tr>
)

class PatronTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      userID: 0,
      name: "",
      email: "",
      activated: "",
      cardNumber: 0,
      showAddPatron: false,
      showEditPatron: false,
      message: false,
      file: ''
    }
    this.handleShowAddPatron = this.handleShowAddPatron.bind(this);
    this.handleShowEditPatron = this.handleShowEditPatron.bind(this);
    this.addUser = this.addUser.bind(this);
    this.handleOnDrop = this.handleOnDrop.bind(this);
  }

  componentDidMount = () => {
    axios.get(`https://c868capstoneproject.herokuapp.com/api/v1/person/patron`)
      .then((res) => {
        this.setState({
          data: res.data,
        });

        console.log(this.state.data);
      })

    axios.get(
      `https://c868capstoneproject.herokuapp.com/api/v1/person/cardNumber`
    ).then(res => {
      var used = true;
      while (used) {
        var number = Math.floor(Math.random() * 1000000000);
        if (res.data.includes(number)) {
          console.log(res.data.includes(number));
          used = true;
        } else {
          used = false;
          this.setState({
            cardNumber: number
          })
        }
      }
    })
  }

  remove = (userID) => {
    var temp = this.state.data;

    for (var i = 0; i < temp.length; i++) {
      if (temp[i].userID == userID) {
        temp.splice(i, 1);
      }
    }

    this.setState({
      data: temp
    })

    axios.delete(`https://c868capstoneproject.herokuapp.com/api/v1/person/${userID}`)
  }
  editPatron = () => {
    var { userID, name, email } = this.state;
    if (name != '' && email != '') {
      var temp = this.state.data;

      for (var i = 0; i < temp.length; i++) {
        if (temp[i].userID == userID) {
          temp[i].name = name;
          temp[i].email = email;
        }
      }
      this.setState({
        data: temp
      })
      var bodyformData = new FormData();
      bodyformData.append('file', this.state.file);

      axios.put(
        `https://c868capstoneproject.herokuapp.com/api/v1/person/patron`, {
        "userID": userID,
        "name": name,
        "email": email
      }
      ).then((response) => {
        this.setState({
          showAddPatron: false,
          showEditPatron: false
        })
      }, (error) => {
        console.log(error);
      });
    } else {
      this.setState({
        message: true
      })
    }
  }

    handleClose = () => {
      this.setState({
        showAddPatron: false,
        showEditPatron: false,
        message: false
      })
    };
    handleShowAddPatron = () => {
      this.setState({
        showAddPatron: true
      })
    };

    handleShowEditPatron = (userID, name, email) => {
      this.setState({
        userID: userID,
        name: name,
        email: email,
        showEditPatron: true
      })
    };

    addUser = (event) => {
      event.preventDefault()
      this.setState({
        message: false
      })
      var bodyformData = new FormData();
      bodyformData.append('file', this.state.file);
      var { name, email, cardNumber, file } = this.state;
      if (name != '' && email != '' && file != '') {
        axios({
          method: "post",
          url: "https://c868capstoneproject.herokuapp.com/storage/uploadFile",
          data: bodyformData,
          headers: { "Content-Type": "multipart/form-data" },
        }).then((res) => {
          this.setState({
            url: res.data
          })
          var { url } = this.state;

          axios.post(
            `https://c868capstoneproject.herokuapp.com/api/v1/person/patron`, {
            "userID": 0,
            "name": name,
            "email": email,
            "password": null,
            "url": url,
            "cardNumber": cardNumber
          }
          ).then((response) => {
            var temp = this.state.data;
            var json = { name: name, email: email, password: "password", url: this.state.url, activated: false, cardNumber: this.state.cardNumber, userID: "In Progress" };
            temp.push(json);

            this.setState({
              showAddPatron: false,
              data: temp,
              userID: 0,
              name: "",
              email: "",
              activated: "",
              file: ''
            })
            axios.get(
              `https://c868capstoneproject.herokuapp.com/api/v1/person/cardNumber`
            ).then(res => {
              var used = true;
              while (used) {
                var number = Math.floor(Math.random() * 1000000000);
                if (res.data.includes(number)) {
                  console.log(res.data.includes(number));
                  used = true;
                } else {
                  used = false;
                  this.setState({
                    cardNumber: number
                  })
                }
              }
            })
            this.handleClose();
          }, (error) => {
            this.setState(
              { message: true }
            )
            console.log(error);
          });
        }
        )
      } else {
        this.setState({
          message: true
        })
      }
    }

    handleOnDrop = (files) => {
      files.map(f => {
        this.setState({
          file: f
        })
      })
    }

    render() {
      const rows = this.state.data.map((rowData) => <Row remove={this.remove} handleShowEditPatron={this.handleShowEditPatron} togglePopup={this.togglePopup} {...rowData} />);
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
          <h2>Patrons</h2>
          <div className="tableIcons">
            <AiFillPlusCircle size="2em" color="navy" onClick={this.handleShowAddPatron} />
          </div>
          <table>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Activated</th>
              <th>Card Number</th>
              <th>Edit</th>
              <th>Remove</th>
            </tr>
            {rows}
          </table>
          <Modal show={this.state.showAddPatron} onHide={this.handleClose} addUser={this.addUser}>
            <Modal.Header closeButton>
              <Modal.Title>Add Patron</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div onSubmit={this.addUser}>
                <form >
                  <label>
                    Name:
                    <input type="text" readOnly={false} name="userName" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
                  </label>
                  <label>
                    Email:
                    <input type="text" readOnly={false} name="userName" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
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
                              <p>Add Profile Picture</p>
                          }
                        </div>
                      )
                    }}
                  </Dropzone>
                  {
                    this.state.message == '' ? <div></div> : <p className="message">Invalid Data</p>
                  }
                </form>
              </div></Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
                </Button>
              <Button variant="primary" onClick={this.addUser}>
                Add Patron
                </Button>
            </Modal.Footer>
          </Modal>
          <Modal show={this.state.showEditPatron} onHide={this.handleClose} editPatron={this.editPatron}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Patron</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <label>
                ID:
                       <input type="text" readOnly={true} name="ID" value={this.state.userID} />
              </label>
              <label>
                Name:
                       <input type="text" readOnly={false} name="name" value={this.state.name} onChange={e => this.setState({ name: e.target.value })} />
              </label>
              <label>
                Email:
                       <input type="text" readOnly={false} name="email" value={this.state.email} onChange={e => this.setState({ email: e.target.value })} />
              </label>
              {
                    this.state.message == '' ? <div></div> : <p className="message">Invalid Data</p>
                  }
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleClose}>
                Close
                </Button>
              <Button variant="primary" onClick={() => this.editPatron()}>
                Save Changes
                </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );

    }
  }

  export default PatronTable;