// ChannelItem.jsx

import { ChannelBox, ChannelLogo } from "planby";
import React, { useEffect } from 'react';

export const ChannelItem = ({ channel, selectedChannel, highlightedChannel }) => {
  
  const { position, logo } = channel;

  const isHighlighted = channel.uuid === highlightedChannel;
  const isSelected = selectedChannel && selectedChannel.uuid === channel.uuid;
  var borderStyle = isSelected ? '2px solid #96B6C5' : '2px solid transparent';
  if(isHighlighted && !isSelected){
    borderStyle = '2px solid #65647C'
  }

  return (
    <ChannelBox
      {...position}
    >
      {channel && channel.index}
      <ChannelLogo 
        src={logo}
        alt="Logo"
        style={{ maxHeight: 52, maxWidth: 52, zIndex: '2147483647' }}
      />
      <div style={{ height: '80px', 
                    border: borderStyle, 
                    borderRadius: '5px',
                    width: 'calc(100vw - 20px)', 
                    backgroundColor: 'transparent',
                    position: 'absolute',
                    left: '0px'
                  }}>
      </div>
    </ChannelBox>
  );
};
