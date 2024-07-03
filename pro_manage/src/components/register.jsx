import React,{ useState } from 'react';
import { Registeruser } from '../services/auth';
import styles from './register.module.css'; 
import { IoEyeOutline,IoEyeOffOutline } from "react-icons/io5";
import { RiLockLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
function Register({ setShowRegister }){
    const [data, setdata] = useState({name:"",email:"",password:"",confirmPassword: ""});
    const [passwordMatchError, setPasswordMatchError] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errors, setErrors] = useState({name:"",email:"",password:"",confirmPassword: ""});
    const handleChange = (e)=>{
        const { name, value } = e.target;
        setdata({...data, [name]: value });
        setErrors({ ...errors, [name]: "" });
    };
    const validate = () => {
        let isValid = true;
        let newErrors = { name: "", email: "", password: "", confirmPassword: "" };

        if (!data.name) {
            newErrors.name = "this field is required";
            isValid = false;
        }
        if (!data.email) {
            newErrors.email = "this field is required";
            isValid = false;
        }
        if (!data.password) {
            newErrors.password = "Password is required";
            isValid = false;
        }
        if (!data.confirmPassword) {
            newErrors.confirmPassword = "Confirm Password is required";
            isValid = false;
        }
        setErrors(newErrors);
        return isValid;
    };

    const registration = async (e) =>{
        e.preventDefault();
        if (!validate()) {
            return;
        }
        if (data.password !== data.confirmPassword) {
            setPasswordMatchError(true);
            return;
        } else {
            setPasswordMatchError(false);
        }
        try{
        const response = await Registeruser(data);
        console.log(response);
        if(response.status === "error"){
            alert(response.message);
        }
        else if(response.status === "success"){
            alert(response.message);
            setShowRegister(false);
        }
    }catch (error) {
        console.error("Registration error:", error);
        alert("An error occurred during registration. Please try again later.");
    }
    setdata({ name: "", email: "", password: "", confirmPassword: "" });
    };
    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const toggleShowConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    console.log(data);
    return(
        <div className={styles.registerpage}>
        <p className={styles.header}>Register</p>
        <form onSubmit={registration} className={styles.formdata}>
        <div className={styles.inputname}>
            <FaRegUser style={{ color: 'rgba(130, 130, 130, 1)', width:'29.5px', height:'29.5px'}}/>
            <input type="text"
            className={styles.inputfield}
             placeholder='Name'
             name="name" 
             value={data.name} 
             onChange={handleChange} />
             </div>
             {errors.name && <div className={styles.errorMessage}>{errors.name}</div>}
         <div className={styles.inputemail}>
            <MdOutlineEmail style={{ color: 'rgba(130, 130, 130, 1)', width:'33.08px', height:'33.08px'}}/>
            <input type="email" 
            className={styles.inputfield}
            placeholder='Email' 
            name="email" 
            value={data.email} 
            onChange={handleChange} />
            </div> 
            {errors.email && <div className={styles.errorMessage}>{errors.email}</div>}
         <div className={styles.inputpassword}>
            <div><RiLockLine style={{ color: 'rgba(130, 130, 130, 1)', width:'33.08px', height:'33.08px'}}/>
            <input type={showPassword ? "text" : "password"} 
            placeholder='Password' 
            className={styles.inputfield}
            name="password" 
            value={data.password} 
            onChange={handleChange} />
            </div>
            <div> <button type="button" onClick={toggleShowPassword}  className={styles.eyeButton}>
            {showPassword ? (
                            <IoEyeOffOutline className={styles.iconStyle} />
                        ) : (
                            <IoEyeOutline className={styles.iconStyle} />
                        )}
            </button></div>
            </div>
            {errors.password && <div className={styles.errorMessage}>{errors.password}</div>}
         <div className={styles.inputconfirmpassword}>
            <div><RiLockLine style={{ color: 'rgba(130, 130, 130, 1)', width:'33.08px', height:'33.08px'}}/>
            <input type={showConfirmPassword ? "text" : "password"} 
            placeholder='Confirm Password'
            className={styles.inputfield}
            name="confirmPassword" 
            value={data.confirmPassword} 
            onChange={handleChange} /></div>
            <div> <button type="button" onClick={toggleShowConfirmPassword} className={styles.eyeButton}>
                        {showConfirmPassword ? (
                             <IoEyeOffOutline className={styles.iconStyle} />
                        ) : (
                           <IoEyeOutline className={styles.iconStyle} />
                        )}
                    </button></div>
            </div>
            {errors.confirmPassword && <div className={styles.errorMessage}>{errors.confirmPassword}</div>}
            {passwordMatchError && <p style={{ color: 'red' }}>Passwords do not match</p>}
            <button type="submit" className={styles.registerbtn}>Register</button>
        </form>
        <p className={styles.pquestion}>Have an account ?</p>
        <button className={styles.loginbtn} onClick={() => setShowRegister(false)}>Log in</button>
        </div>
    )
}
export {Register};