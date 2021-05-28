import axios from 'axios';
import React, { Component } from 'react';

class Login extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: "",
            password: ""
        };

        this.handleChange = this.handleChange.bind(this);
        this.login = this.login.bind(this);
        this.toRegistration = this.toRegistration.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }
    login = (event) => {
        event.preventDefault()
        var { email, password} = this.state;
        email = email.toLowerCase();
        axios.get(
            `https://c868capstoneproject.herokuapp.com/api/v1/person/login?email=${email}&password=${password}`
        ).then(res => {
            if(res.data.userID){
                this.props.login(res.data.userID, res.data.name, res.data.cardNumber, res.data.url);
            }
        });
    }

    toRegistration = () => {
        this.props.toRegistration();
    }
    render() {
        return (
            <div  className="loginCard" onSubmit={this.login} >
                <form className = "loginForm">
                    <label>
                        Email: 
                        <input type="text" name="email" value={this.state.email} onChange={this.handleChange} />
                    </label>
                    <label>
                        Password:   
                        <input type="password" name="password" value={this.state.password} onChange={this.handleChange} />
                    </label>
                    <input type="submit" value="Login" />
                    <button className="registerButton" onClick={this.toRegistration}>Register</button>
                </form>
                
            </div>
        );
    }
}

export default Login;