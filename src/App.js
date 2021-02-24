import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book'
import {Route, Link} from 'react-router-dom'

class BooksApp extends React.Component {
    state = {
        books: [],
        showBooks: true
    }

    constructor(props) {
        super(props);
        this.filter = this.filter.bind(this);
        this.filterBy = this.filterBy.bind(this);
        this.changeBookShelf = this.changeBookShelf.bind(this);
        this.onSearch = this.onSearch.bind(this);
        this.refresh = this.refresh.bind(this);
    }

    async componentDidMount() {
        this.refresh()
    }

    async refresh() {
        const books = await BooksAPI.getAll()
        this.setState({
            books: books
        })
    }

    filter = books => shelf => this.state.books.filter(b => {
        return b.shelf === shelf;
    });

    shelvesMapping = {
        currentlyReading: 'Currently Reading',
        wantToRead: 'Want to Read',
        read: 'Already Read',
        none: 'None'
    }
    shelves = Object.keys(this.shelvesMapping).filter(shelf => shelf !== 'none')
    filterBy = this.filter(this.state.books)

    // Move a book to a different shelf or remove
    changeBookShelf(updatedBook, newReadState) {
        BooksAPI.update(updatedBook, newReadState)
            .then((books) => {
                const book = this.state.books.filter((book) => book.id === updatedBook.id)
                book[0].shelf = newReadState
                const unchangedBooks = this.state.books.filter((book) => book.id !== updatedBook.id)
                this.setState({books: [...unchangedBooks, book[0]]})
            })
    }

    // Return results from a search
    onSearch = (e) => {
        if (!e.target.value) {
            this.showBooks(false)
            return
        }
        BooksAPI.search(e.target.value)
            .then(results => {
                console.log('results', results)
                if (!results || results.error) {
                    this.showBooks(false)
                    throw new Error(results.error)
                } else {
                    this.showBooks(true)
                    this.setState(prevState => (this.compareBooks(prevState.books, results)))
                }
            })
            .catch(e => console.log(e))


    }

    // Determine whether the books should be displayed or not
    showBooks = (boolShow) => {
        this.setState({
            showBooks: boolShow
        })
    }

    // Set the shelf for books returned from a search.
    compareBooks = (booksOnShelf, searchResults) => {
        if (!searchResults || searchResults.length < 1) {
            return
        }
        let updatedSearchResults = searchResults.map((searchResult, index) => {
            let existingBook = booksOnShelf.find((book) => book.id === searchResult.id)
            if (existingBook) {
                searchResult.shelf = existingBook.shelf
            } else {
                searchResult.shelf = "none"
            }
            return searchResult
        })

        return {books: updatedSearchResults}
    }


    render() {
        return (
            <div className="app">
                <Route path='/search' render={({history}) => (
                    <div className="search-books">
                        <div className="search-books-bar">
                            <Link className="close-search" to='/' onClick={this.refresh}>Close</Link>
                            <div className="search-books-input-wrapper">
                                <input type="text" placeholder="Search by title or author" onChange={this.onSearch}/>
                            </div>
                        </div>
                        <div className="search-books-results">
                            <ol className="books-grid">
                                {this.state.showBooks && this.state.books && this.state.books.length > 0 && this.state.books.map((book, i) => (
                                    <Book book={book} key={i} shelvesmapping={this.shelvesMapping}
                                          handleChange={this.changeBookShelf}/>))}

                            </ol>
                        </div>
                    </div>
                )}/>

                <Route exact path='/' render={() => (
                    <div className="list-books">
                        <div className="list-books-title">
                            <h1>MyReads</h1>
                        </div>
                        <div className="list-books-content">
                            <div>
                                {this.shelves.map((shelf, index) => (
                                    <div className="bookshelf" key={index}>
                                        <h2 className="bookshelf-title">{this.shelvesMapping[shelf]}</h2>
                                        <div className="bookshelf-books">
                                            <ol className="books-grid">
                                                {this.filterBy(shelf).map((book, index) => (
                                                    <Book key={index} book={book} shelvesmapping={this.shelvesMapping}
                                                          handleChange={this.changeBookShelf}/>
                                                ))}
                                            </ol>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="open-search">
                            <Link to={{pathname: '/search'}}>Search</Link>
                        </div>
                    </div>
                )}/>
            </div>
        )
    }
}

export default BooksApp
