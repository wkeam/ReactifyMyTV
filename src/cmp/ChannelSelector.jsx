import React, { useState, useEffect } from 'react';

const ChannelSelector = ({ onChannelChange }) => {
  const [channelInput, setChannelInput] = useState('');

  useEffect(() => {
    const handleKeyDown = (event) => {
      const key = event.key;

      // Allow only numeric keys
      if (/[0-9]/.test(key)) {
        setChannelInput((prevInput) => {
          const newInput = prevInput + key;

          if (newInput.length === 3) {
            onChannelChange(newInput); // Notify parent component
            setChannelInput('');
          }

          return newInput;
        });
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onChannelChange]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (channelInput.length > 0) {
        onChannelChange(channelInput); // Notify parent component
        setChannelInput('');
      } else {
        //console.log('No channelInput, waiting for keypress...');
      }
    }, 2000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [channelInput, onChannelChange]);

  return <div style={{
    zIndex: '2147483647',
    position: 'absolute',
    left: '10vw',
    top: '10vh',
    fontSize: '4vh'
  }}>{channelInput}</div>;
};

export default ChannelSelector;
