//Player.js
import ReactPlayer from 'react-player'
import Modal from './Modal';
import React, { useState, useEffect } from 'react';
import screenfull from 'screenfull';

function Player({ channel, prechannel ,updateIsFullscreen }){

const [isModalVisible, setModalVisibility] = useState(false);
const [isFullscreen, setIsFullscreen] = useState(false);
const handleClick = (e) => {
	switch (e.detail) {
		case 2:
			//double click
			toggleFullscreen();
			break;
		default:
			break;
		}
}

useEffect(() => {
	const handleKeyPress = (event) => {
	event.preventDefault();
	handleKeystroke(event);
	
	};
	window.addEventListener('keydown', handleKeyPress);
	setModalVisibility(true);
	const timeoutId = setTimeout(() => {
	setModalVisibility(false);
	}, 3000);

	return () => {
	clearTimeout(timeoutId);
	window.removeEventListener('keydown', handleKeyPress);
	};
}, [channel, prechannel]);

const toggleFullscreen = () => {
	const reactPlayer = document.querySelector('.react-player');
	screenfull.toggle(reactPlayer);
	const fullscreenChangeHandler = () => {
	  console.log(screenfull.isFullscreen);
	  if (screenfull.isFullscreen) {
		setIsFullscreen(true);
		updateIsFullscreen(true);
		reactPlayer.style.cursor = 'none';
	  } else {
		setIsFullscreen(false);
		updateIsFullscreen(false);
		reactPlayer.style.cursor = 'default';
	  }
	  screenfull.off('change', fullscreenChangeHandler);
	};
	screenfull.on('change', fullscreenChangeHandler);
};

const handleKeystroke = (event) => {
	switch (event.key) {
	case 'ContextMenu':
		toggleFullscreen();
		break;
	default:
		break;
	}
};

const playbackRate = 1.0;
const playing = true;
const playerConfig = {
	file: {
	attributes: {
		subtitles: []
	}
	}
}

return (
	<span className='react-player player-wrapper'>
		<div style={{color:'red'}}>{String(isFullscreen)}</div>
	{ isModalVisible && isFullscreen && <Modal channel={channel} prechannel={prechannel}/> }
	{channel &&
	<ReactPlayer  style={{outline: 'none'}}
		onClick={handleClick}
		url={channel.channelURL}
		playbackRate={playbackRate}
		playing={playing}
		onReady={() => console.log('onReady')}
		onStart={() => console.log('onStart')}
		config={playerConfig}
		controls={false}
		width='100%'
		height='100%' />
	}
	</span>
	
	)
}

export default Player;