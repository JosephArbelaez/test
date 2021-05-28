import axios from 'axios';
import React, { Component } from 'react';
import AdminCard from '../Admin/AdminCard';
import Tab from './Tab';
import { jsPDF } from "jspdf";
import 'jspdf-autotable'

class AdminAccount extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tab: 'user'
        };

        this.changeTab = this.changeTab.bind(this);
    };

    changeTab = (tab) => {
        this.setState({
            tab: tab
        })
    }

    render() {
        return (
            <div className="userAccountPage">
                <div className="user-fifth">
                    <AdminCard userID={this.props.userID} name={this.props.name} url={this.props.url} />
                </div>
                <div className="user-fourfifths">
                    <div className="adminTabs">
                        <button className="adminTabButton" onClick={() => this.changeTab('user')}><b>User</b></button>
                        <button className="adminTabButton" onClick={() => this.changeTab('book')}><b>Book</b></button>
                        <button className="adminTabButton" onClick={() => this.changeTab('charge')}><b>Charge</b></button>
                    </div>
                    <Tab
                        tab={this.state.tab}
                        userID={this.props.userID}
                        changeTab={this.changeTab}
                        changeName={this.props.changeName}
                    />
                </div>
            </div>
        );
    }
}

export default AdminAccount;