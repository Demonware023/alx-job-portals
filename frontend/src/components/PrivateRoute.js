// frontend/src/components/PrivateRoute.js

import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';  // Assuming you have an AuthContext

/**
 * PrivateRoute is a wrapper for <Route> that redirects to the login page
 * if the user is not authenticated.
 * 
 * @param {React.Component} component - The component to render for this route.
 * @param {...rest} rest - The rest of the props to pass down to <Route>.
 */
const PrivateRoute = ({ component: Component, ...rest }) => {
    const { isAuthenticated } = useAuth();  // Hook that checks if the user is authenticated

    return (
        <Route
            {...rest}
            render={props =>
                isAuthenticated ? (
                    <Component {...props} />
                ) : (
                    <Redirect to="/login" />
                )
            }
        />
    );
};

PrivateRoute.propTypes = {
    component: PropTypes.elementType.isRequired,
};

export default PrivateRoute;
