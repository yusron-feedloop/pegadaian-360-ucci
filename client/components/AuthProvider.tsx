
import * as React from 'react';
import Cookies from 'js-cookie';
import { AuthContext } from '../libs/auth';


const AuthProvider: React.FC = ({ children }) => {
    function signIn(token) {
        Cookies.set('token', token)
        window.location.reload()
    }

    function signOut() {
        Cookies.remove('token')
        window.location.reload()
    }

    return (
        <AuthContext.Provider value={{signIn, signOut}}>
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;