import React,{useState} from 'react';
import styles from './jobpage.module.css';
import {Board} from './board.jsx';
import {Analytics} from './analytics.jsx';
import {Setting} from './settings.jsx';
import { Logout } from './logout';
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
      <div className={styles.listpart}><li className={styles.heading}><img src="/images/codesandbox.png" className={styles.icon}/>Pro Manage</li>
      <ul>
        <li className={`${styles.list} ${selectedComponent === 'Board' ? styles.selected : ''}`} onClick={() => setSelectedComponent('Board')}>
          <img src="/images/layout.png" className={styles.icon}/>Board</li>
        <li className={`${styles.list} ${selectedComponent === 'Analytics' ? styles.selected : ''}`} onClick={() => setSelectedComponent('Analytics')}>
          <img src="/images/database.png" className={styles.icon}/>Analytics</li>
        <li className={`${styles.list} ${selectedComponent === 'Setting' ? styles.selected : ''}`} onClick={() => setSelectedComponent('Setting')}>
          <img src="/images/settings.png" className={styles.icon}/>Settings</li>
      </ul>
      </div>
      <div className={styles.logout}>
        <button className={styles.logoutbtn} onClick={() => setShowLogout(true)}><img src="/images/Logout.png" className={styles.logicon}/>Log out</button>
      </div>
      </div>
      <div className={styles.taskarea}> {renderComponent()}</div>
      {showLogout && <Logout onClose={() => setShowLogout(false)} />}
        </div>
    )
}
export {Tasks}