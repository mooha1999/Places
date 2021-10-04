import React from 'react';

import UserItem from './UserItem';
import './UserList.css';
const UserList = props => {
    if(props.items.length === 0)
    {
        return( 
        <div className = "center">
            <h1>No Users Found.</h1>
        </div>);
    }
    return(
        <ul className = "center">
            {props.items.map(user => (
                <UserItem
                key={user.id}
                id={user.id}
                image={user.image}
                name={user.name}
                places={user.places}
                />
            ))}
        </ul>
    );
};
export default UserList;