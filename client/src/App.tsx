
import './App.css';
import LoginForm from "./components/loginForm";
import React, {FC, useContext, useEffect, useState} from "react";
import {Context} from "./index";
import {observer} from "mobx-react-lite";
import {IUser} from "./models/IUser";
import UserService from "./services/UserServices";

const App: FC = () => {
    const {store} = useContext(Context)
    const [storeUsers, getStoreUsers] = useState<IUser[]>([])
    useEffect(()=>{
        if(localStorage.getItem('token')) {
            store.checkAuth()
        }
    }, [])

    const getUsers = async () => {
        try {
            const response = await UserService.fetchUsers()
            getStoreUsers(response.data)
        } catch (e) {
            console.log(e)
        }
    }

    if(store.isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    if(!store.isAuth) {
        return (
            <LoginForm/>
        )
    }
  return (
    <div className="App">
        <h1>{store.isAuth ? `User ${store.user.email} Authorized` : 'Please Authorize'}</h1>
        <h1>{store.user.isActivated ? `User ${store.user.email} Verified` : 'Please verify your account!'}</h1>
        <button onClick={()=> store.logout()}>Выйти</button>
        <div>
            <button onClick={getUsers}>
                Get Users
            </button>
        </div>
        {
            storeUsers.map(
                user => <div key={user.email}>{user.email}</div>
            )
        }
    </div>
  );
}

export default observer(App);
