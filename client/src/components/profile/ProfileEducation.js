import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileEducation = ({ education: {
    school,
    degree,
    current,
    to,
    from,
    description
} }) => {
    return (
        <Fragment>
            <div>
                <h3 class="text-dark">{school}</h3>
                <p>
                    {
                        current ?
                            (
                                <Fragment>
                                    <Moment format="MMM DD, YYYY">{from}</Moment> - {' '}
                                    Current
                                </Fragment>
                            )
                            :
                            (
                                <Fragment>
                                    <Moment format="MMM DD, YYYY">{from}</Moment> - {' '}
                                    <Moment format="MMM DD, YYYY">{to}</Moment>
                                </Fragment>

                            )
                    }

                </p>
                <p><strong>Degree: </strong>{degree}</p>
                <p>
                    <strong>Program: </strong> {description}
                </p>
            </div>
        </Fragment >
    )
}

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
}

export default ProfileEducation;