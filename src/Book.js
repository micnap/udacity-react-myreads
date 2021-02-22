import React, {Component} from 'react'
import BookShelfChanger from "./BookShelfChanger";


class Book extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(readState) {
        this.props.handleChange(this.props.book, readState)
    }

    render() {
        const { book, shelvesmapping } = this.props
        const backgroundImage = book.imageLinks.thumbnail ? book.imageLinks.thumbnail : 'https://via.placeholder.com/128x193.png'

        return (

            <li>
                {console.log('book', 'grr')}
                <div className="book">
                    <div className="book-top">

                        <div className="book-cover" style={{
                            width: 128,
                            height: 193,
                            backgroundImage: `url(${backgroundImage})`
                        }}></div>
                        <BookShelfChanger selectedshelf={book.shelf} shelvesmapping={shelvesmapping} handleChange={this.handleChange} />
                    </div>
                    <div className="book-title">{book.title}</div>
                    <div className="book-authors">{
                        // Splits list of authors onto their own lines.
                        book.authors.map(item => <div>{item}</div>)
                    }</div>
                </div>
            </li>

        )
    }
}

export default Book