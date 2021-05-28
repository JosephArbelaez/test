import React from 'react';
import { FaUser } from 'react-icons/fa';
import { AiOutlineNumber } from 'react-icons/ai';
import { HiOutlineMail } from 'react-icons/hi';
const UserCard = ({ userID, name, cardNumber, url }) => {


    return (
        <div class="userCard">
            <img src={url} class="userCardImage"></img>
            <div className="userCardRow">
                <div className="userCardIcon">
                    <FaUser color="white" size="1.5em" />
                </div>
                <p className="userCardText"><b>{name}</b></p>
            </div>
            <div className="userCardRow">
                <div className="userCardIcon">
                    <AiOutlineNumber color="white" size="1.5em" />
                </div>
                <p className="userCardText"><b>{userID}</b></p>
            </div>
            <div className="userCardRow">
                <div className="userCardIcon">
                    <HiOutlineMail color="white" size="1.5em" />
                </div>
                <p className="userCardText"><b>{cardNumber}</b></p>
            </div>
        </div>
    );
}

export default UserCard;