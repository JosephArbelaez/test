import React, { Component } from 'react';
import AdminAccount from './AdminAccount';
import Login from './Login';
import UserAccount from './UserAccount';
import Registration from './Registration';
import Home from '../Page/Home';
import Navbar from '../Navbar/Navbar';
import NewNonFiction from './NewNonFiction';
import NewFiction from './NewFiction';
import Gallery from './Gallery';
import Bar from './Bar';
import Footer from '../Footer/Footer';

const initialState = {
    userID: '',
    name: '',
    username: '',
    password: '',
    cardNumber: '',
    url: '',
    bar1: 'Our Mission: Transforming lives by Educating, Inspiring, and Connecting',
    bar2: 'Sign up today to hear about new programs & events!',
    loginText: 'Login'
}

class Page extends Component {
    constructor() {
        super();
        this.state = initialState;
    }

    login = (userID, name, cardNumber, url) => {
        this.setState({
            userID: userID,
            name: name,
            cardNumber: cardNumber,
            url: url
        });

        if (this.state.cardNumber === undefined) {
            this.props.pageChange('adminAccount');
        } else {
            this.props.pageChange('userAccount')
        }
    }

    toRegistration = () => {
        this.props.pageChange('registration');
    }

    toLogin = () => {
        this.props.pageChange('login');
    }

    toPhoto = () => {
        this.props.pageChange('photo');
    }

    changeName = (name) => {
        this.setState({
            name: name
        })
    }

    renderSwitch() {
        var { userID, name, cardNumber, url } = this.state;
        switch (this.props.page) {
            case 'login':
                return (
                    <div className="login">
                        <Login
                            name={name}
                            userID={userID}
                            cardNumber={cardNumber}
                            url={url}
                            login={this.login}
                            toRegistration={this.toRegistration} />
                    </div>
                )
            case 'userAccount':
                return (
                    <UserAccount
                        name={name}
                        userID={userID}
                        cardNumber={cardNumber}
                        url={url}
                        toPhoto={this.toPhoto}
                    />
                )

            case 'adminAccount':
                return (
                    <AdminAccount
                        changeName={this.changeName}
                        name={name}
                        userID={userID}
                        url={url} />
                )

            case 'registration':
                return (
                    <div>
                        <Registration
                            toLogin={this.toLogin} />
                    </div>
                )

            case 'home':
                return (
                    <div>
                        <Home />
                        <Bar text={this.state.bar1} />
                        <div className="newBookCard">
                            <NewNonFiction />
                            <NewFiction />
                        </div>
                        <Bar text={this.state.bar2} />
                        <div className="galleryContainer">
                            <Gallery />
                        </div>
                        <Footer />
                    </div>
                )

            default:
                return (
                    <div>
                        <Home />
                        <Bar text={this.state.bar1} />
                        <div className="newBookCard">
                            <NewNonFiction />
                            <NewFiction />
                        </div>
                        <Bar text={this.state.bar2} />
                        <div className="galleryContainer">
                            <Gallery />
                        </div>
                        <Footer />
                    </div>
                )
        }
    }
    render() {
        return (
            <div className="content">
                <Navbar pageChange={this.props.pageChange} loginText={this.state.loginText} />
                {this.renderSwitch()}
            </div>
        )
    }
}

export default Page;