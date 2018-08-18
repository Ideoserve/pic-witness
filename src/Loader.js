import React from 'react';

const Loader = () => {
    return (
        <div className="outerLoader">
            <div className="loader"></div>
            <h4>Saving permanently to the blockchain.<br />This transaction may take up to one minute.</h4>
        </div>
    );
};

export default Loader;