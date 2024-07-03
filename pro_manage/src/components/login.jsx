import React,{ useState } from 'react';
import {login} from '../services/auth'
import { useNavigate } from 'react-router-dom'; 
import { Register } from './register';
import styles from './login.module.css'
import { IoEyeOutline,IoEyeOffOutline } from "react-icons/io5";
import { RiLockLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
function Login(){
    const [data,setdata] = useState({email:"",password:""});
    const [errors, setErrors] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showRegister, setShowRegister] = useState(false);
    const navigate = useNavigate();
    const handleChange = (e)=>{
        setdata({...data, [e.target.name]:e.target.value });
        setErrors({ ...errors, [e.target.name]: "" });
    };
    const validate = () => {
        let isValid = true;
        let newErrors = { email: "", password: "" };

        if (!data.email) {
            newErrors.email = "Email is required";
            isValid = false;
        }
        if (!data.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };
    const loginuser = async (e) =>{
        e.preventDefault();
        if (!validate()) {
            return;
        }
        try{
        const response = await login(data);
        console.log('Login response:', response);
        if(response.status === "error"){
            alert(response.message);
            return;
        }
        if (response.status === "success") {
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('userEmail', response.email);
            console.log(response.token);
            console.log('User ID set in localStorage:', response.userId);
            console.log("user email",response.email);
            navigate('/jobpage');
        } else {
            alert("invalid email or password.");
        }
    }catch (error) {
        console.error("Login error:", error);
        alert("An error occurred. Please try again later.");
    }
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };
    console.log(data);
    return(
        <>
            {showRegister ? (
                <Register setShowRegister={setShowRegister} /> // Pass the state setter to the Register component
            ) : (
        <div className={styles.loginpage}>
        <div className={styles.heading}>Login</div>
        <div><form onSubmit={loginuser} className={styles.formdata}>
        <div className={styles.inputemail}>
            <MdOutlineEmail style={{ color: 'rgba(130, 130, 130, 1)', width:'33.08px', height:'30px'}}/>
            <input 
            className={styles.inputfieldemail} 
            type="email" 
            placeholder='Email' 
            name="email" 
            value={data.email}
            onChange={handleChange}/>
            </div>
            {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
        <div className={styles.inputpassword}>
            <div>
            <RiLockLine style={{ color: 'rgba(130, 130, 130, 1)', width:'33px', height:'30px'}}/>
            <input  
            className={styles.passwordfield}
            type={showPassword ? "text" : "password"} 
            placeholder='Password' 
            name="password" 
            value={data.password}
            onChange={handleChange}/></div>
           <div> <button type="button" onClick={toggleShowPassword}  className={styles.eyeButton}>
                {showPassword ? <IoEyeOffOutline style={{ color: 'rgba(130, 130, 130, 1)', width:'25px', height:'25px'}}/> : <IoEyeOutline style={{ color: 'rgba(130, 130, 130, 1)', width:'25px', height:'25px'}}/>}
            </button></div>
        </div>
        {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
        <button className={styles.buttonlogin} type="submit">Log in</button>
        </form></div>
        <div className={styles.pquestion}>Have no account yet?</div>
        <div><button className={styles.buttonregister} onClick={() => setShowRegister(true)}>Register</button>
        </div>
        </div>
        )}
        </>
    );
}
export {Login};