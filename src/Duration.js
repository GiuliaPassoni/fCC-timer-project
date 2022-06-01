import React from 'react'

const Duration = (props) => {
    return(
        <div>
            <h1 id={props.id}>{props.name} Length</h1>
            <hr/>
            <h2>Duration: <span id={props.insideId}>{props.defVal}</span>:00</h2>
        </div>
    );
};

export default Duration;