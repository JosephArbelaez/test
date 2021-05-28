import React from 'react';
import {FaUser} from 'react-icons/fa';
import { AiOutlineNumber } from 'react-icons/ai';

const AdminCard = ({ userID, name, url}) => {


    return (
        <div className ="userCard">
            <img src={url} class="userCardImage" alt="profile"></img>
            
            <div className ="userCardRow">
                <div className = "userCardIcon">
                    <FaUser color = "white" size = "1.5em"/>
                </div>
                <h3 className = "userCardText"><b>{name}</b></h3>
            </div>
            <div className ="userCardRow">
            <div className = "userCardIcon">
                    <AiOutlineNumber color = "white" size = "1.5em"/>
                </div>
                <h3 className = "userCardText"><b>{userID}</b></h3>
            </div>
        </div>
    );
}

export default AdminCard;