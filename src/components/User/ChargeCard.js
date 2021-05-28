import React from 'react';

const ChargeCard = ({chargeTotal}) => {

    return (
        <div class ="userCard">
            <p className = "userCardText"><b>Amount Due: </b>${chargeTotal}</p>
        </div>
    );
}

export default ChargeCard;