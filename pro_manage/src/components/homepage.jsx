import React from 'react';
import {useState} from 'react';
import styles from './homepage.module.css';
import { Login } from './login';
import { Register } from './register';
function Home(){
    const [showLogin, setShowLogin] = useState(true);

    const toggleAuthComponent = () => {
        setShowLogin(!showLogin);
    };
    return(
    <div className={styles.homepage}>
        <div className={styles.imgpart}>
         <img src="/images/Group.png" alt="Group"/>
         <div><h1 className={styles.htag}>Welcome aboard my friend</h1>
            <p className={styles.ptag}>just a couple of clicks and we start</p>
            </div> 
        </div>
        <div className={styles.authpart}>
             <Login/>
        </div>
    </div>
    )
}
export {Home}