import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState(0);
  const [userInfo, setUserInfo] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const buttonSubmit = async () => {
    let payload = { name: userName, email: userEmail };
    let response = await fetch("http://localhost:5000/create-user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    let res = await response.json();
    if (response.status != 200) {
      console.log("User Creation Failed");
      console.log(res);
    } else {
      console.log("User Creation Succeeded");
    }
  };

  const deleteButton = async () => {
    let response = await fetch("http://localhost:5000/delete-user/" + userId, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await response.json();
    if (res.status != 200) {
      console.log(res.debug);
    } else {
      console.log(res.debug);
    }
  };

  const getUserButton = async () => {
    let response = await fetch("http://localhost:5000/get-user/" + userId, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await response.json();
    if (res.status !== 200) {
      console.log(res.debug);
    } else {
      console.log(res.user);
      setUserInfo([res.user.name, res.user.email]);
    }
  };

  const getAllUsersButton = async () => {
    let response = await fetch("http://localhost:5000/get-users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    let res = await response.json();
    if (res.status != 200) {
      console.log(res.debug);
    } else {
      setAllUsers(res.users);
    }
  };

  const updateUserInfo = async () => {
    let payload = { id: userId, name: userName, email: userEmail };
    let response = await fetch("http://localhost:5000/update-user", {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    })
    let res = await response.json()
    if (res.status != 200) {
      console.log(res.debug)
    } else {
      console.log(res.debug)
    }
  }

  return (
    <div>
      <h1>Practice Frontend</h1>
      <p>Practicing Full Stack Development</p>
      <p>Create Users:</p>
      <form>
        <input
          id="name"
          type="text"
          onChange={(e) => setUserName(e.target.value)}
          placeholder="Name"
        ></input>
        <input
          id="email"
          type="text"
          onChange={(e) => setUserEmail(e.target.value)}
          placeholder="Email"
        ></input>
        <input type="button" value="Add User" onClick={buttonSubmit}></input>
      </form>
      <p>Delete Users:</p>
      <form>
        <input
          id="id"
          type="number"
          onChange={(e) => setUserId(e.target.value)}
          placeholder="id"
        ></input>
        <input
          id="delete-button"
          type="button"
          onClick={deleteButton}
          value="Delete User"
        ></input>
      </form>
      <p>Get User:</p>
      <form>
        <input
          id="id"
          type="number"
          onChange={(e) => setUserId(e.target.value)}
          placeholder="id"
        ></input>
        <input
          id="get-button"
          type="button"
          onClick={getUserButton}
          value="Get User"
        ></input>
      </form>
      <p>
        {userInfo[0]}, {userInfo[1]}
      </p>
      <p>Get all Users:</p>
      <form>
        <input
          id="get-all-button"
          type="button"
          onClick={getAllUsersButton}
          value="Get All Users"
        ></input>
      </form>
      {allUsers.map((user) => (
        <p key={user.id}>
          {user.id}, {user.name}, {user.email}
        </p>
      ))}
      <p>Update User Info:</p>
      <form>
        <input type="number" placeholder="id" onChange={(e) => setUserId(e.target.value)}></input>
        <input type="text" placeholder="name (optional)" onChange={(e) => setUserName(e.target.value)}></input>
        <input type="text" placeholder="email (optional)" onChange={(e) => setUserEmail(e.target.value)}></input>
        <input type="button" value="Submit" onClick={updateUserInfo}></input>
      </form>
    </div>
  );
}

export default App;
