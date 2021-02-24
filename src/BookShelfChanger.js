import React, {Component} from 'react'

class BookShelfChanger extends Component {

    constructor(props) {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.props.handleChange(e.target.value);
    }

    render() {

        const { shelvesmapping, selectedshelf } = this.props

        return (
            <div className="book-shelf-changer">
                <select value={selectedshelf} onChange={this.handleChange}>
                    <option value="move" disabled>Move to...</option>
                    {Object.keys(shelvesmapping).map((shelf, index) => (
                        <option key={index} value={shelf}>{shelvesmapping[shelf]}</option>
                        )
                    )}
                </select>
            </div>
        )
    }
}

export default BookShelfChanger