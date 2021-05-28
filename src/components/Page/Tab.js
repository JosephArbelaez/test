
import React from 'react';
import ChargeTable from '../Admin/ChargeTable';
import BookTableChecked from '../Admin/BookTableChecked';
import BookTableUnchecked from '../Admin/BookTableUnchecked';
import PatronTable from '../Admin/PatronTable';
import AdminTable from '../Admin/AdminTable';

const Tab = ({ tab, changeName, userID }) => {
    switch (tab) {
        case 'user':
            return (
                <div className="userContainer">
                    <PatronTable />
                    <AdminTable userID={userID} changeName={changeName} />
                </div>
            )

        case 'book':
            return (
                <div className="userContainer">
                    <BookTableChecked />
                    <BookTableUnchecked />
                </div>
            )

        case 'charge':
            return (
                <div className="userContainer">
                    <ChargeTable />
                </div>
            )
        default:
            return (
                <div className="userContainer">
                    <PatronTable />
                    <AdminTable userID={userID} changeName={changeName} />
                </div>
            )
    }
}

export default Tab;