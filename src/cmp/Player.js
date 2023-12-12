//Player.js
import ReactPlayer from 'react-player'
import Modal from './Modal';
import React, { useState, useEffect } from 'react';
import screenfull from 'screenfull';

function Player({ channel, prechannel }){

const [isModalVisible, setModalVisibility] = useState(false);
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
	screenfull.toggle(document.querySelector('.react-player'));
			screenfull.isFullscreen 
			? (document.querySelector('.react-player').style.cursor = 'default') 
			: (document.querySelector('.react-player').style.cursor = 'none');
}

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
	{ isModalVisible && screenfull.isFullscreen && <Modal channel={channel} prechannel={prechannel}/> }
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
		{/* <div style={{
			zIndex: '2147483647',
			position: 'absolute',
			left: '10vw',
			top: '10vh',
			fontSize: '4vh'
		}}>
		</div> */}
	</span>
	
	)
}

export default Player;