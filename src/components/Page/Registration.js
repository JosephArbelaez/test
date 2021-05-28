import axios from 'axios';
import React, { Component } from 'react';

class Registration extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userID: '',
            cardnumber: '',
            password: '',
            passwordCheck: '',
            valid: false,
            message: ''
        };
        this.cardnumberCheck = this.cardnumberCheck.bind(this);
        this.renderSwitch = this.renderSwitch.bind(this);
        this.toLogin = this.toLogin.bind(this);
    }

    cardnumberCheck = (event) => {
        event.preventDefault();
        if (this.state.cardnumber) {
            console.log(typeof this.state.cardnumber);
            axios.get(
                `https://c868capstoneproject.herokuapp.com/api/v1/person/cardNumber/${this.state.cardnumber}`
            ).then((response) => {
                this.setState({
                    message: 'successful',
                    userID: response.data
                })
            }, (error) => {
                this.setState({ message: 'unsuccessful' })
            });
        }
    }

    submitPassword = (event) => {
        event.preventDefault();
        if (this.state.password) {
            axios.put(
                `https://c868capstoneproject.herokuapp.com/api/v1/person/patron/`, {
                "userID": this.state.userID,
                "name": this.state.name,
                "email": this.state.email,
                "password": this.state.password,
                "cardNumber": this.state.cardnumber
            }).then((response) => {
                this.toLogin();
            }, (error) => {
                console.log(error);
            })
        }
    }
    renderSwitch(message) {
        switch (message) {
            case '':
                return (
                    <div className="registrationCard" onSubmit={this.cardnumberCheck}>
                        <form className="registrationForm">
                            <label>Card Number:
                            <input type="text" name="cardnumber" value={this.state.cardNumber} readOnly={false} onChange={e => this.setState({ cardnumber: e.target.value })} />
                            </label>
                            <input type="submit" value="Enter"></input>
                        </form>
                    </div>
                )

            case 'successful':
                return (
                    <div className="registrationCard">
                        <form onSubmit={this.submitPassword}>
                            <label>Password:
                    <input type="password" name="password" value={this.state.password} readOnly={false} onChange={e => this.setState({ password: e.target.value })} />
                            </label>
                            <label>Re-type Password:
                    <input type="password" name="passwordCheck" value={this.state.passwordCheck} readOnly={false} onChange={e => this.setState({ passwordCheck: e.target.value })} />
                            </label>
                            {
                                this.state.password == this.state.passwordCheck ?
                                    <input type="submit" value="Enter" /> :
                                    this.state.passwordCheck == "" ?
                                        <div></div> : <div><p className="warning-red">The passwords don't match</p></div>
                            }
                        </form>
                    </div>
                )

            case 'unsuccessful':
                return (
                    <div><p>Unsuccessful</p></div>
                )
        }
    }

    toLogin = () => {
        this.props.toLogin();
    }
    render() {
        return (
            <div>
                {this.renderSwitch(this.state.message)}
            </div>
        );
    }
}

export default Registration;