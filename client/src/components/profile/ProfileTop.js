import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const ProfileTop = ({ profile: {
    status,
    company,
    location,
    website,
    social: {
        facebook, instagram, youtube, linkedIn, twitter
    },
    user: { name, avatar }
} }) => {
    return (
        <Fragment>
            <div class="profile-top bg-primary p-2">
                <img
                    class="round-img my-1"
                    src={avatar}
                    alt=""
                />
                <h1 class="large">{name}</h1>
                <p class="lead">{status} at {company}</p>
                <p>{location}</p>
                <div class="icons my-1">
                    {
                        website ?
                            (
                                <a href={website} target="_blank" alt={website} rel="noopener noreferrer">
                                    <i class="fas fa-globe fa-2x"></i>
                                </a>
                            ) : ''
                    }
                    {
                        facebook ?
                            (
                                <a href={facebook} target="_blank" alt={facebook} rel="noopener noreferrer">
                                    <i class="fab fa-facebook fa-2x"></i>
                                </a>
                            ) : ''
                    }
                    {
                        twitter ?
                            (
                                <a href={twitter} target="_blank" alt={twitter} rel="noopener noreferrer">
                                    <i class="fab fa-twitter fa-2x"></i>
                                </a>
                            ) : ''
                    }
                    {
                       instagram ?
                            (
                                <a href={instagram} target="_blank" alt={instagram} rel="noopener noreferrer">
                                    <i class="fab fa-instagram fa-2x"></i>
                                </a>
                            ) : ''
                    }
                    {
                        linkedIn ?
                            (
                                <a href={linkedIn} target="_blank" alt={linkedIn} rel="noopener noreferrer">
                                    <i class="fab fa-linkedIn fa-2x"></i>
                                </a>
                            ) : ''
                    }
                    {
                        youtube ?
                            (
                                <a href={youtube} target="_blank" alt={youtube} rel="noopener noreferrer">
                                    <i class="fab fa-youtube fa-2x"></i>
                                </a>
                            ) : ''
                    }
                </div>
            </div>
        </Fragment>
    )
}

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired
}

export default ProfileTop;