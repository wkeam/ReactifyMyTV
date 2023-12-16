// mainpage.js

import React, { useState, useEffect, useRef } from 'react';
import './App.css';
import Player from './cmp/Player';
import { Epg, Layout } from "planby";
import { useApp } from "./useApp";
import { Timeline, ChannelItem, ProgramItem } from "./components";
import { useHotkeys } from 'react-hotkeys-hook'; 

const Mainpage = () => {
  const {
    isLoading,
    getEpgProps,
    getLayoutProps,
    navigateToPreviousChannel,
    navigateToNextChannel,
    navigateToChannel,
    navigateToChannelNumber,
    navigateToChannelOnClick,
    channels,
    playerState, 
  } = useApp();
  const layoutRef = useRef(null);

  useEffect(() => {
    // Calculate the scroll position based on the index of the selected channel
    const channelIndex = channels.findIndex(c => c.index === playerState.highlightedChannel.index);
    const channelHeight = 80;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const hourWidth = 14400 / 24;
    const minuteWidth = hourWidth / 60;

    if (layoutRef.current && channelIndex !== -1 && channelHeight) {
      const containerHeight = layoutRef.current.clientHeight;
      const scrollPositionY = channelIndex * channelHeight - (containerHeight / 2) + (channelHeight / 2) + 40;

      // Calculate the horizontal scroll position based on the current time
      const scrollPositionX = (currentHour * hourWidth) + (currentMinute * minuteWidth) - (layoutRef.current.clientWidth / 2);
      
      layoutRef.current.scrollTo({ top: scrollPositionY, left: scrollPositionX, behavior: 'smooth' });
    }
  }, [playerState.highlightedChannel, channels]);

  const addDelay = (func, delay) => {
    return () => setTimeout(func, delay);
  };

  // Use the useHotkeys hook to handle key events
  useHotkeys('up', addDelay(navigateToPreviousChannel, 200));
  useHotkeys('down', addDelay(navigateToNextChannel, 200));
  useHotkeys('enter', navigateToChannel);
  useHotkeys('pageup', addDelay(() => navigateToChannelNumber(-8), 200));
  useHotkeys('pagedown', addDelay(() => navigateToChannelNumber(8), 200));

  const handleClick = (newIndex) => {
    console.log('click: ' + newIndex);
    navigateToChannelOnClick(newIndex);
  }

  return (
    <div className="App"  tabIndex={0}>
      <div className="App-header">
        <span className="column">
          <p><img src={playerState.highlightedChannel && playerState.highlightedChannel.logo} style={{ maxHeight: 150, maxWidth: 150 }} alt=""/><br/>
            {playerState.highlightedChannel && playerState.highlightedChannel.index} {playerState.highlightedChannel && playerState.highlightedChannel.title}</p>
        </span>
        <span className="column">
          {playerState.playingChannel && <Player prechannel={playerState.highlightedChannel} channel={playerState.playingChannel}/>}
        </span>
      </div>
      <div className="App-footer-container">
        <div style={{ height:"100%",width:"100%",overflowX:"hidden",overflowY:"hidden" }}>
          <Epg isLoading={isLoading} {...getEpgProps()}>
            <Layout
              {...getLayoutProps()}
              ref={layoutRef}
              renderTimeline={(props) => <Timeline {...props} />}
              renderProgram={({ program, ...rest }) => (
                <ProgramItem key={program.data.id} program={program} {...rest} />
              )}
              renderChannel={({ channel }) => (
                <div 
                  onClick={() => handleClick(channel.index)}
                  key={channel.index}
                >
                  <ChannelItem
                    key={channel.uuid}
                    channel={channel}
                    selectedChannel={playerState.playingChannel}
                    highlightedChannel={playerState.highlightedChannel.uuid}
                    data-channel-id={playerState.playingChannel.uuid}
                  />
                </div>
              )}
            />
          </Epg>
        </div>
      </div>
    </div>
  );
}

export default Mainpage;
