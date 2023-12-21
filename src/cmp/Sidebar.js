import React from 'react';
const { invoke } = window.electron;

function Sidebar({ activeComponent, onMenuItemClick }) {
  const isOpen = activeComponent === 'sidebar';

  const handleItemClick = (menuItem) => {
    console.log(menuItem);
    if(menuItem === 'Exit'){
      window.electron.invoke('quitApp');
    }
  };

  const sidebarStyles = {
    backgroundColor: 'rgba(0,0,0,0.94)',
    height: '80vh',
    width: '400px',
    position: 'fixed',
    zIndex: '100',
    transition: 'transform 0.6s ease-in-out',
    transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
    top: '10vh',
    borderRadius: '0px 40px 40px 0px',
    padding: '20px',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
  };

  const menuItems = [
    { icon: '⚙️', text: 'Does Nothing Yet' },
    { icon: '🚪', text: 'Exit' },
  ];

  const menuItemStyles = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'background-color 1.0s',
  };

  const iconStyles = {
    marginRight: '10px',
    fontSize: 'calc(10px + 2vmin)',
  };

  return (
    <div style={sidebarStyles}>
      {menuItems.map((item, index) => (
        <div
          key={index}
          style={menuItemStyles}
          onClick={() => handleItemClick(item.text)}
        >
          <span style={iconStyles}>{item.icon}</span>
          {item.text}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
