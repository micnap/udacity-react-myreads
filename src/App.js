import React from 'react'
import * as BooksAPI from './BooksAPI'
import './App.css'
import Book from './Book'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    books: []
  }

  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.filterBy = this.filterBy.bind(this);
    this.changeBookShelf = this.changeBookShelf.bind(this);
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


  changeBookShelf(updatedBook, newReadState) {
    BooksAPI.update(updatedBook, newReadState)
        .then((books) => {
          this.refresh()
        })

    /*const book = this.state.books.filter((book) => book.id === oldBook.id)
    book[0].shelf = newReadState
    const unchangedBooks = this.state.books.filter((book) => book.id !== oldBook.id)
    this.setState({ books: [...unchangedBooks, book[0]] })*/

  }

  render() {
    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <button className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</button>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid"></ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {this.shelves.map(shelf => (
                    <div className="bookshelf">
                      <h2 className="bookshelf-title">{this.shelvesMapping[shelf]}</h2>
                      <div className="bookshelf-books">
                        <ol className="books-grid">
                          {this.filterBy(shelf).map((book) => (
                            <Book book={book} shelvesmapping={this.shelvesMapping} handleChange={this.changeBookShelf}/>
                            ))}
                        </ol>
                      </div>
                    </div>
                ))}
              </div>
            </div>

            <div className="open-search">
              <button onClick={() => this.setState({ showSearchPage: true })}>Add a book</button>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
