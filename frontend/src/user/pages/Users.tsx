import { Fragment, useEffect, useState } from "react";
import ErrorModal from "../../shared/components/UIElements/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElements/LoadingSpinner";
import { useHttpClient } from "../../shared/hooks/http-hook";
import UsersList from "../components/UsersList";

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState();

  const {clearError, error, sendRequest } = useHttpClient();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await sendRequest(process.env.REACT_APP_BACKEND_URL + "/users/");
        setLoadedUsers(response.users);
      } catch (err: any) {}
    };
    fetchUsers();
  }, [sendRequest]);

  return (
    <Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {loadedUsers ? (
        <UsersList items={loadedUsers} />
      ) : (
        <LoadingSpinner asOverlay />
      )}
    </Fragment>
  );
};
export default Users;