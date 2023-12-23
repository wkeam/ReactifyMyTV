// Livetv.js

import React, { useRef, useEffect } from 'react';
import Player from './cmp/Player';
import { Epg, Layout } from "planby";
import { Timeline, ChannelItem, ProgramItem } from "./components";
import useHotkeysHandler from './useHotkeysHandler';
import './App.css';

const Livetv = ({ playerState, isLoading, getEpgProps, getLayoutProps, handleClick, channels, navigateToPreviousChannel, 
                  navigateToNextChannel, navigateToChannel, navigateToChannelNumber, changeActiveComponent,
                  updateIsFullscreen
}) => {  const layoutRef = useRef(null);

  useEffect(() => {
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

      const scrollPositionX = (currentHour * hourWidth) + (currentMinute * minuteWidth) - (layoutRef.current.clientWidth / 2);
      
      layoutRef.current.scrollTo({ top: scrollPositionY, left: scrollPositionX, behavior: 'smooth' });
    }
  }, [playerState.highlightedChannel, channels]);

  useHotkeysHandler({
    playerState,
    navigateToPreviousChannel,
    navigateToNextChannel,
    navigateToChannel,
    navigateToChannelNumber,
    changeActiveComponent
  });

  return (
    <div className="App" tabIndex={0}>
      <div className="App-header">
        <span className="column">
          <p><img src={playerState.highlightedChannel && playerState.highlightedChannel.logo} style={{ maxHeight: 150, maxWidth: 150 }} alt="" /><br />
            {playerState.highlightedChannel && playerState.highlightedChannel.index + 1} {playerState.highlightedChannel && playerState.highlightedChannel.title}<br />
          </p>
        </span>
        <span className="column">
          {playerState.playingChannel && 
            <Player prechannel={playerState.highlightedChannel} 
                    channel={playerState.playingChannel}
                    updateIsFullscreen={updateIsFullscreen}
            />
          }
        </span>
      </div>
      <div className="App-footer-container">
        <div style={{ height: "100%", width: "100%", overflowX: "hidden", overflowY: "hidden" }}>
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

export default Livetv;
