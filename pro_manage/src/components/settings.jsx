import React, { useState, useEffect } from 'react';
import styles from './settings.module.css';
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import { RiLockLine } from "react-icons/ri";
import { MdOutlineEmail } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import axios from 'axios';
import { fetchUserData } from '../services/auth';
import { useNavigate } from 'react-router-dom';
function Setting(){
    const [oldPasswordicon, setoldPasswordicon] = useState(false);
    const [newPasswordicon, setnewPasswordicon] = useState(false);
    const [user, setUser] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const userId = localStorage.getItem('userId'); 
    const token = localStorage.getItem('token'); 
    const navigate = useNavigate();
    const toggleShowPassword = () => {
        setoldPasswordicon(!oldPasswordicon);
    };

    const toggleShownewPassword = () => {
        setnewPasswordicon(!newPasswordicon);
    };
    useEffect(() => {
        if (userId && token) {
            fetchUserData(userId, token)
              .then(data => {
                setUser(data);
                setName(data.name);
                setEmail(data.email);
              }
            )
              .catch(error => console.error('Error fetching user data:', error));
          }
    }, [userId, token]);
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const originalEmail = user.email;
            const response = await axios.patch('/api/auth/userdata/:userId', {
                name,
                email,
                oldPassword,
                newPassword
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
             // Clear local storage if email or password was updated
             if (originalEmail !== email || newPassword) {
                localStorage.removeItem('token');
                localStorage.removeItem('userId');
                navigate('/homepage'); // Redirect to homepage or login page
            }

            alert(response.data.message);
        } catch (error) {
            console.error('Update error:', error);
            alert('Error in updating password');
        }
    };

    if (!user) {
        return <div>Loading...</div>;
    }
    return(
        <>
         <div className={styles.headpart}>Settings</div>
         <form className={styles.formdata} onSubmit={handleUpdate}>
         <div className={styles.inputname}>
                    <FaRegUser style={{ color: 'rgba(130, 130, 130, 1)', width: '29.5px', height: '29.5px' }} />
                    <input
                     value={name}
                     onChange={(e) => setName(e.target.value)}
                        placeholder="username"
                        className={styles.inputfield}
                        name="name"
                    />
                </div>
                <div className={styles.inputemail}>
                    <MdOutlineEmail style={{ color: 'rgba(130, 130, 130, 1)', width: '24px', height: '24px' }} />
                    <input
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className={styles.inputfield}
                        name="email"
                    />
                </div>
                <div className={styles.oldpassword}>
                    <div>
                        <RiLockLine style={{ color: 'rgba(130, 130, 130, 1)', width: '33.08px', height: '33.08px' }} />
                        <input
                             value={oldPassword}
                             onChange={(e) => setOldPassword(e.target.value)}
                             placeholder="Old Password"
                             type={oldPasswordicon ? "text" : "password"}
                             className={styles.inputfield}
                        />
                    </div>
                    <button type="button" onClick={toggleShowPassword} className={styles.eyeButton}>
                        {oldPasswordicon ? (
                            <IoEyeOffOutline className={styles.iconStyle} />
                        ) : (
                            <IoEyeOutline className={styles.iconStyle} />
                        )}
                    </button>
                    </div>
                    <div className={styles.newpassword}>
                    <div>
                        <RiLockLine style={{ color: 'rgba(130, 130, 130, 1)', width: '33.08px', height: '33.08px' }} />
                        <input
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="New Password"
                            type={newPasswordicon ? "text" : "password"}
                            className={styles.inputfield}
                        />
                    </div>
                    <button type="button" onClick={toggleShownewPassword} className={styles.eyeButton}>
                        {newPasswordicon ? (
                            <IoEyeOffOutline className={styles.iconStyle} />
                        ) : (
                            <IoEyeOutline className={styles.iconStyle} />
                        )}
                    </button>
                </div>
                <button  type="submit" className={styles.updatebtn}>Update</button>
         </form>
        </>
    )
}
export {Setting}