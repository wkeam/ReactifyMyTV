import React, { useState, useEffect, useRef } from 'react';

const HorizontalMenu = ({ items, onItemSelected, onKeyPress }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const flexContainerRef = useRef(null);

  useEffect(() => {
    // Log the selected item whenever it changes
    //console.log('Selected Item in HorizontalMenu:', items[selectedIndex].channelURL);
    // Call the callback function to notify the parent component
    onItemSelected(items[selectedIndex].channelURL);

    // Attach event listener when component mounts
    const handleKeyPress = (event) => {
      //onKeyPress(event);
      event.preventDefault();
      handleKeystroke(event);
    };

    // Scroll the focused item into view when selectedIndex changes
    if (selectedIndex !== null && flexContainerRef.current) {
      const focusedItem = flexContainerRef.current.children[selectedIndex];
      focusedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    window.addEventListener('keydown', handleKeyPress);

    // Detach event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };


  }, [items, onItemSelected, selectedIndex, onKeyPress]);

  const handleKeystroke = (event) => {
    //console.log('child ' + event.key);
    switch (event.key) {
      case 'PageDown':
        setSelectedIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : items.length - 1));
        break;
      case 'PageUp':
        setSelectedIndex((prevIndex) => (prevIndex < items.length - 1 ? prevIndex + 1 : 0));
        break;
      default:
        break;
    }
  };

  const doClick = (a, index) => {
    //console.log(a.channelURL);
    //onItemSelected(a.channelURL);
    setSelectedIndex(index);
  };

  return (
    <div
      onKeyDown={handleKeystroke}
      style={{
        display: 'flex',
        padding: '10px',
        outline: 'none',
        flexFlow: 'row wrap',
        justifyContent: 'space-evenly'
      }}
      ref={flexContainerRef}
    >
      {items.map((item, index) => (
        <div
          key={index}
          style={{
            padding: '10px',
            margin: '5px',
            border: index === selectedIndex ? '5px solid #ccc' : '5px solid #222831',
            borderRadius: '15px',
            background: index === selectedIndex ? '#222831' : '#393E46',
            color: index === selectedIndex ? '#fff' : '#000',
            cursor: 'pointer',
            flex: '0 1 calc(10%)'
          }}
          onClick={() => doClick(item, index)}
        >
          <img style={{width: '200px',height:'100px',backgroundColor: 'lightgrey', borderRadius: '15px'}} alt={item.name} src={item.tvgLogo}/>
          <span style={{display: 'block'}}>{item.name}</span>
          
        </div>
      ))}
    </div>
  );
};

export default HorizontalMenu;