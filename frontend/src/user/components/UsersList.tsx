import Card from '../../shared/components/UIElements/Card';
import UserProps from '../interfaces/UserProps';
import UserItem from './UserItem';
import './UsersList.css';

interface Props{
  items: UserProps[],
}

const UsersList = (props:Props) => {
  if(props.items.length === 0)
    return <div className='center'>
      <Card>
        <h2>No users found</h2>
      </Card>
    </div>;
  return <ul className='users-list'>
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
}

export default UsersList;