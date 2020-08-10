import React, { Fragment, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layout/Spinner';
import { getProfileById } from '../../actions/profile';
import ProfileTop from './ProfileTop';
import ProfileAbout from './ProfileAbout';
import ProfileExperience from './ProfileExperience';
import ProfileEducation from './ProfileEducation';
import ProfileGithub from './ProfileGithub';
import { GET_REPOS } from '../../actions/types';

const Profile = ({ getProfileById, profile: { profile, loading }, auth, match }) => {

    useEffect(() => {
        getProfileById(match.params.id);
    }, [getProfileById, match.params.id]);

    return (
        <Fragment>
            {
                profile === null || loading ? <Spinner /> :
                    <Fragment>
                        <Link to="/profiles" className="btn btn-light">Back To Profiles</Link>
                        {
                            auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id &&
                            (
                                <Link to="/edit-profile" className="btn btn-dark">
                                    Edit Profile
                                </Link>
                            )
                        }
                        <div class="profile-grid my-1">
                            <ProfileTop key={profile.user._id} profile={profile} />
                            <ProfileAbout key={profile.user._id} profile={profile} />
                            {
                                profile.experience.length > 0 ?
                                    (
                                        <div class="profile-exp bg-white p-2">
                                            <h2 class="text-primary">Experience</h2>
                                            {
                                                profile.experience.map((exp, index) => (

                                                    <ProfileExperience key={index} experience={exp} />

                                                ))
                                            }
                                        </div>
                                    ) : ''
                            }
                            {
                                profile.education.length > 0 ?
                                    (<div class="profile-edu bg-white p-2">
                                        <h2 class="text-primary">Education</h2>
                                        {
                                            profile.education.map((edu, index) => (
                                                <ProfileEducation key={index} education={edu} />
                                            ))
                                        }
                                    </div>) : ''
                            }
                            <ProfileGithub username={profile.githubusername} />
                        </div>
                    </Fragment>
            }
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, { getProfileById })(Profile);