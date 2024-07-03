import React,{useState} from 'react';
import styles from './jobpage.module.css';
import {Board} from './board.jsx';
import {Analytics} from './analytics.jsx';
import {Setting} from './settings.jsx';
import { Logout } from './logout';
import logout from '../images/Logout.png';
import codesandbox from '../images/codesandbox.png';
import settingsimg from '../images/settings.png';
import layout from '../images/layout.png';
import database from '../images/database.png';
function Tasks(){
  const [showLogout, setShowLogout] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState('Board');
  const renderComponent = () => {
    switch (selectedComponent) {
        case 'Board':
            return <Board />;
        case 'Analytics':
            return <Analytics />;
        case 'Setting':
            return <Setting />;
        default:
            return <Board />;
    }
  };
    return(
        <div className={styles.taskpage}>
    <div className={styles.navbar}>
      <div className={styles.listpart}><li className={styles.heading}><img src={codesandbox} className={styles.icon}/>Pro Manage</li>
      <ul>
        <li className={`${styles.list} ${selectedComponent === 'Board' ? styles.selected : ''}`} onClick={() => setSelectedComponent('Board')}>
          <img src={layout} className={styles.icon}/>Board</li>
        <li className={`${styles.list} ${selectedComponent === 'Analytics' ? styles.selected : ''}`} onClick={() => setSelectedComponent('Analytics')}>
          <img src={database} className={styles.icon}/>Analytics</li>
        <li className={`${styles.list} ${selectedComponent === 'Setting' ? styles.selected : ''}`} onClick={() => setSelectedComponent('Setting')}>
          <img src={settingsimg} className={styles.icon}/>Settings</li>
      </ul>
      </div>
      <div className={styles.logout}>
        <button className={styles.logoutbtn} onClick={() => setShowLogout(true)}><img src={logout} className={styles.logicon}/>Log out</button>
      </div>
      </div>
      <div className={styles.taskarea}> {renderComponent()}</div>
      {showLogout && <Logout onClose={() => setShowLogout(false)} />}
        </div>
    )
}
export {Tasks}