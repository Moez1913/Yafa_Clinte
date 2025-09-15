import React from 'react';
import NavBar from '../Home/NavBar';
import { Outlet } from 'react-router-dom';

const Routes = () => {
    return (
        <div>
            <NavBar></NavBar>
            <Outlet></Outlet>
        </div>
    );
};

export default Routes;