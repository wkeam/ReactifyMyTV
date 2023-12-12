// ChannelItem.jsx

import { ChannelBox, ChannelLogo } from "planby";
import React, { useEffect } from 'react';

export const ChannelItem = ({ channel, selectedChannel, highlightedChannel }) => {
  
  const { position, logo } = channel;

  const isHighlighted = channel.uuid === highlightedChannel;
  const isSelected = selectedChannel && selectedChannel.uuid === channel.uuid;
  var borderStyle = isSelected ? '2px solid #ff0000' : '2px solid transparent';
  if(isHighlighted && !isSelected){
    borderStyle = '2px solid #ff00ff'
  }

  return (
    <ChannelBox
      {...position}
      style={{ border: borderStyle }}
    >
      {channel && channel.index}
      <ChannelLogo 
        src={logo}
        alt="Logo"
        style={{ maxHeight: 52, maxWidth: 52, zIndex: '2147483647' }}
      />
    </ChannelBox>
  );
};
