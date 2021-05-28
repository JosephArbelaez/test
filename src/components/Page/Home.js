import axios from 'axios';
import React, { Component } from 'react';

const slideArray = [
        "https://c868finalproject.s3.us-east-2.amazonaws.com/slide1.jpg",
        "https://c868finalproject.s3.us-east-2.amazonaws.com/slide2.jpg",
        "https://c868finalproject.s3.us-east-2.amazonaws.com/slide3.jpg"
    ]
class Home extends Component {
    constructor(props) {
        super(props);

        this.state = {
            slideURL: slideArray[0]
        };

        this.back = this.back.bind(this);
        this.forward = this.forward.bind(this);
        this.findState = this.findState.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    toRegistration = () => {
        this.props.toRegistration();
    }
    
    back = (event) => {
        event.preventDefault()
        switch (this.state.slideURL) {
            case slideArray[0]:
                this.setState({
                    slideURL: slideArray[2]
                })
                break;
            case slideArray[1]:
                this.setState({
                    slideURL: slideArray[0]
                })
                break;
            case slideArray[2]:
                this.setState({
                    slideURL: slideArray[1]
                })
                break;
        }
    }
    
    forward = (event) => {
        event.preventDefault()
        switch (this.state.slideURL) {
            case slideArray[0]:
                this.setState({
                    slideURL: slideArray[1]
                })
                break;
            case slideArray[1]:
                this.setState({
                    slideURL: slideArray[2]
                })
                break;
            case slideArray[2]:
                this.setState({
                    slideURL: slideArray[0]
                })
                break;
        }
    }
    findState= (event) => {
        event.preventDefault()
        console.log(this.state.slideURL);
    }
    render() {
        return (
            <div className="home">
                <div className="eventSlideShowContainer">
                    <button className="eventSlideShowLeftButton" onClick={this.back}>{'<'}</button>
                    <img className="slide" src={this.state.slideURL}></img>
                    <button className="eventSlideShowRightButton" onClick={this.forward}>{'>'}</button>
                </div>
            </div>
        );
    }
}

export default Home;