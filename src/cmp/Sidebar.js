import React, { useState, useEffect } from 'react';

function Sidebar({ playerState }) {
  const isOpen = playerState.activeComponent === 'sidebar';
  const [selectedItem, setSelectedItem] = useState(0);

  const handleItemClick = (menuItem) => {
    console.log(menuItem);
    if (menuItem === 'Exit') {
      window.electron.invoke('quitApp');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      setSelectedItem((prev) => (prev > 0 ? prev - 1 : menuItems.length - 1));
    } else if (e.key === 'ArrowDown') {
      setSelectedItem((prev) => (prev < menuItems.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Enter') {
      const selectedLabel = menuItems[selectedItem].label;
      console.log('Selected:', selectedLabel);
      handleItemClick(selectedLabel);
    }
  };

  useEffect(() => {
    if (isOpen && !playerState.isFullscreen) {
      window.addEventListener('keydown', handleKeyDown);
    } else {
      window.removeEventListener('keydown', handleKeyDown);
    }
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, selectedItem]);

  const sidebarStyles = {
    backgroundColor: 'rgba(0,0,0,0.94)',
    height: '80vh',
    width: '300px',
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
    { index: 0, icon: '📡', label: 'Live TV (TBA)' },
    { index: 1, icon: '📺', label: 'TV Episodes (TBA)' },
    { index: 2, icon: '🎬', label: 'Movies (TBA)' },
    { index: 3, icon: '⚙️', label: 'Settings (TBA)' },
    { index: 4, icon: '🚪', label: 'Exit' },
  ];

  const menuItemStyles = (index) => ({
    display: 'flex',
    alignItems: 'center',
    marginBottom: '15px',
    cursor: 'pointer',
    transition: 'background-color 0.3s',
    backgroundColor: index === selectedItem ? 'gray' : 'transparent',
  });

  const iconStyles = {
    marginRight: '10px',
    fontSize: 'calc(10px + 2vmin)',
  };

  return (
    <div style={sidebarStyles}>
      {menuItems.map((item, index) => (
        <div
          key={index}
          style={menuItemStyles(index)}
          onClick={() => handleItemClick(item.label)}
        >
          <span style={iconStyles}>{item.icon}</span>
          {item.label}
        </div>
      ))}
    </div>
  );
}

export default Sidebar;
