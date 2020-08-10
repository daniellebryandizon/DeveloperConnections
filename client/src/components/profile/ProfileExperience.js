import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import Moment from 'react-moment';

const ProfileExperience = ({ experience: {
    company,
    title,
    location,
    current,
    to,
    from,
    description
} }) => {
    return (
        <Fragment>
            <div>
                <h3 class="text-dark">{company} - {location}</h3>
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
                <p><strong>Position: </strong>{title}</p>
                <p>
                    <strong>Description: </strong> {description}
                </p>
            </div>
        </Fragment >
    )
}

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired
}

export default ProfileExperience;