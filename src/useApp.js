import React from "react";
const { invoke } = window.electron;

import { useEpg } from "planby";

// Import theme
import { theme } from "./helpers/theme";


export function useApp() {
  const [channels, setChannels] = React.useState([]);
  const initialState = {highlightedChannel: channels[0],playingChannel: channels[0]};
  const [epg, setEpg] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [playerState, setPlayerState] = React.useState(initialState);
  const channelsData = React.useMemo(() => channels, [channels]);
  const epgData = React.useMemo(() => epg, [epg]);
  const playerStateData = React.useMemo(() => playerState, [playerState]);

  var today = new Date();
  var dd = String(today.getDate()).padStart(2, '0');
  var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
  var yyyy = today.getFullYear();
  today = yyyy + '-' + mm + '-' + dd;
  let start = today + 'T00:00:00';
  let end = today + 'T24:00:00';

  const { getEpgProps, getLayoutProps } = useEpg({
    isCurrentTime: true,
    channels: channelsData,
    epg: epgData,
    dayWidth: 14400,
    sidebarWidth: 100,
    itemHeight: 80,
    isSidebar: true,
    isTimeline: true,
    isLine: true,
    startDate: start,
    endDate: end,
    isBaseTimeFormat: true,
    playerState: playerStateData,
    theme
  });

  const handleFetchResources = React.useCallback(async () => {
    setIsLoading(true);
    const { channels, epg } = await invoke('get-data');
    console.log('channels',channels);
    setEpg(epg);
    setChannels(channels);
    setPlayerState({highlightedChannel:channels[0],playingChannel: channels[0], activeComponent: 'livetv'});
    setIsLoading(false);
  }, []);

  const navigateToPreviousChannel = () => {
    let newIndex = playerState.highlightedChannel.index - 1;
    if(newIndex<0){
      newIndex = channelsData.length-1;
    }
    const updatedPlayerState = { ...playerState, highlightedChannel: channelsData[newIndex] };
    setPlayerState(updatedPlayerState);
  };

  const navigateToNextChannel = () => {
    let newIndex = playerState.highlightedChannel.index + 1;
    console.log(newIndex + '/' + channelsData.length);
    if(newIndex>channelsData.length-1){
      newIndex = 0;
    }
    const updatedPlayerState = { ...playerState, highlightedChannel: channelsData[newIndex] };
    setPlayerState(updatedPlayerState);
  };  

  const navigateToChannel = () => {
    const newIndex =  playerState.highlightedChannel.index;
    const updatedPlayerState = { ...playerState, highlightedChannel: channelsData[newIndex], playingChannel: channelsData[newIndex] };
    setPlayerState(updatedPlayerState);
  }

  const navigateToChannelNumber = (number) => {
    console.log(playerState);
    let newIndex =  playerState.highlightedChannel.index + number;
    if(newIndex<0){
      newIndex = channelsData.length-1;
    } else if(newIndex>channelsData.length-1){
      newIndex = 0;
    }
    const updatedPlayerState = { ...playerState, highlightedChannel: channelsData[newIndex]};
    setPlayerState(updatedPlayerState);
  }

  const navigateToChannelOnClick = (newIndex) => {
    console.log('navigateToChannelOnClick: ' + newIndex);
    const updatedPlayerState = { ...playerState, highlightedChannel: channelsData[newIndex], playingChannel: channelsData[newIndex] };
    console.log(updatedPlayerState);
    setPlayerState(updatedPlayerState);
  }

  const changeActiveComponent = (newComponent) => {
    console.log('changeActiveComponent: ' + newComponent);
    const updatedPlayerState = { ...playerState, activeComponent: newComponent };
    console.log(updatedPlayerState);
    setPlayerState(updatedPlayerState);
  }

  React.useEffect(() => {
    handleFetchResources();
  }, [handleFetchResources]);

  return {
    getEpgProps,
    getLayoutProps,
    isLoading,
    navigateToPreviousChannel,
    navigateToNextChannel,
    navigateToChannel,
    navigateToChannelOnClick,
    navigateToChannelNumber,
    changeActiveComponent,
    channels,
    epg,
    playerState
  };
}
