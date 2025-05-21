import React from "react";
import UserList from "../components/UserList";

const USERS = [
  {
    id: 'u1',
    name: "Name 1",
    places: 2,
    image: "https://hips.hearstapps.com/hmg-prod/images/dahlia-1508785047.jpg?crop=1.00xw:0.669xh;0,0.0136xh&resize=980:*",
  },
];
const Users = () => {
  return <UserList items={USERS} />;
};

export default Users;
