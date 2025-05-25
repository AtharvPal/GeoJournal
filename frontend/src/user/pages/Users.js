import React, { useEffect, useState } from "react";
import UserList from "../components/UserList";

import ErrorModal from "../../shared/components/UIElement/ErrorModal";
import LoadingSpinner from "../../shared/components/UIElement/LoadingSpinner";

const Users = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const [loadedUsers, setLoadedUsers] = useState();

  useEffect(() => {
    const sendRequest = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("http://localhost:5000/api/users");
        const responseData = await response.json();
        if (!response.ok) {
          throw new Error(responseData.message);
        }
        setLoadedUsers(responseData.users);
        setIsLoading(false);
      } catch (err) {
        setError(
          err.message || "Something went wrong, please try again later."
        );
        setIsLoading(false);
      }
    };
    sendRequest();
  }, []);
  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={() => setError(null)} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner asOverlay />
        </div>
      )}
      {!isLoading && loadedUsers && <UserList items={loadedUsers} />};
    </React.Fragment>
  );
};

export default Users;
