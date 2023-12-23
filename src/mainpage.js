// Mainpage.js

import React from 'react';
import Sidebar from './cmp/Sidebar';
import Livetv from './Livetv';
import { useApp } from "./useApp";


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
    changeActiveComponent,
    channels,
    playerState,
    updateIsFullscreen
  } = useApp();

  const handleClick = (newIndex) => {
    console.log('click: ' + newIndex);
    navigateToChannelOnClick(newIndex);
  }

  return (
    <>
      {(playerState && playerState.activeComponent) &&
      <Sidebar 
        playerState={playerState}
        changeActiveComponent={changeActiveComponent}
      />}
      {(playerState && channels) &&
      <Livetv
        playerState={playerState}
        isLoading={isLoading}
        getEpgProps={getEpgProps}
        getLayoutProps={getLayoutProps}
        handleClick={handleClick}
        channels={channels}
        navigateToPreviousChannel={navigateToPreviousChannel} // Pass functions as props
        navigateToNextChannel={navigateToNextChannel}
        navigateToChannel={navigateToChannel}
        navigateToChannelNumber={navigateToChannelNumber}
        changeActiveComponent={changeActiveComponent}
        updateIsFullscreen={updateIsFullscreen}
      />}
    </>
  );
}

export default Mainpage;
