import React, { Component } from 'react';

const images = [
    'https://cdn.pixabay.com/photo/2015/07/11/19/23/book-841171_1280.jpg',
    'https://cdn.pixabay.com/photo/2019/02/15/11/04/book-3998252_1280.jpg',
    'https://cdn.pixabay.com/photo/2018/06/27/07/45/student-3500990_1280.jpg',
    'https://cdn.pixabay.com/photo/2015/06/18/12/41/for-reading-813666_1280.jpg',
    'https://cdn.pixabay.com/photo/2017/02/17/11/02/book-2073828_1280.jpg',
    'https://cdn.pixabay.com/photo/2018/04/04/15/34/shelf-3290109_1280.jpg'
]


class Gallery extends Component {
    constructor() {
        super();
    }

    render() {

        return (
            <div className="galleryCard">
                    <h1 className = "galleryTitle">Gallery</h1>
                    <div className="gallery">
                        {
                            images.map((url) => {
                                return (
                                    <img className="galleryPic" src={url}></img>
                                )
                            })
                        }
                    </div>
            </div>
        )
    }
}
export default Gallery;