// ChannelItem.jsx

import { ChannelBox, ChannelLogo } from "planby";
import React, { useEffect } from 'react';

export const ChannelItem = ({ channel, selectedChannel, highlightedChannel }) => {
  
  const { position, logo } = channel;

  const isHighlighted = channel.uuid === highlightedChannel;
  const isSelected = selectedChannel && selectedChannel.uuid === channel.uuid;
  var borderStyle = isSelected ? '5px solid #65647C' : '5px solid transparent';
  if(isHighlighted){
    borderStyle = '5px solid #96B6C5';
  }

  return (
    <ChannelBox
      {...position}
    >
      {channel && channel.index+1}
      <ChannelLogo 
        src={logo}
        alt="Logo"
        style={{ maxHeight: 52, maxWidth: 52, zIndex: 2147483647 }}
      />
      <div style={{ 
        height: '80px',
        width: 'calc(100vw - 25px)',
        backgroundColor: isHighlighted || isSelected ? 'rgba(214,	226,	231, 0.05)' : 'transparent',
        position: 'absolute',
        left: '0px',
        border: borderStyle,
        borderRadius: '15px'
      }}>
      </div>
    </ChannelBox>
  );
};
