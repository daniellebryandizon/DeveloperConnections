import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types'
import { connect } from 'react-redux';
import { addComment } from '../../actions/post';

const CommentForm = ({ postId, addComment }) => {
    const [text, setText] = useState('');

    return (
        <Fragment>
            <div className="post-form">
                <div className="bg-primary p">
                    <h3>Leave a comment...</h3>
                </div>
                <form className="form my-1" onSubmit={
                    (event) => {
                        event.preventDefault();
                        addComment(postId, { text });
                        setText('');
                    }
                }>
                    <textarea
                        name="text"
                        value={text}
                        cols="30"
                        rows="5"
                        placeholder="Create a comment"
                        required
                        onChange={(event) => { setText(event.target.value); }}
                    ></textarea>
                    <input type="submit" className="btn btn-dark my-1" value="Submit" />
                </form>
            </div>
        </Fragment >
    )
}

CommentForm.propTypes = {
    addComment: PropTypes.func.isRequired
}

export default connect(null, { addComment })(CommentForm);