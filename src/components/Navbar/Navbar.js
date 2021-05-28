import React from 'react';
import PropTypes from 'prop-types';

const Navbar = ({ pageChange, loginText }) => {
  return (
    <div className="navbar">
        <a onClick={() => pageChange('home')}><img className="logo" src='https://c868finalproject.s3.us-east-2.amazonaws.com/logo.jpg'></img></a>
        <button className="loginButton" onClick={() => pageChange('login')}> <b>{loginText}</b></button>
    </div>
  );
}

Navbar.propTypes = {};

Navbar.defaultProps = {};

export default Navbar;
