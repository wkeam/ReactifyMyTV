// useHotkeysHandler.js
import { useHotkeys } from 'react-hotkeys-hook';

const useHotkeysHandler = ({
    playerState,
    navigateToPreviousChannel,
    navigateToNextChannel,
    navigateToChannel,
    navigateToChannelNumber,
    changeActiveComponent
}) => {
    const addDelay = (func, delay) => {
        return () => setTimeout(func, delay);
    };
    const handleLeftKey = () => {
        if (playerState.activeComponent === 'livetv' && !playerState.isFullscreen) {
            changeActiveComponent('sidebar');
        } else if (playerState.activeComponent === 'sidebar') {
            changeActiveComponent('livetv');
        }
    };
    useHotkeys('left', addDelay(handleLeftKey, 200));

    const handleUpKey = () => {
        if (playerState.activeComponent === 'livetv') {
            navigateToPreviousChannel();
        } else if (playerState.activeComponent === 'sidebar') {
            //changeActiveComponent('livetv');
        }
    };
    useHotkeys('up', addDelay(handleUpKey, 200));

    const handleDownKey = () => {
        if (playerState.activeComponent === 'livetv') {
            navigateToNextChannel();
        } else if (playerState.activeComponent === 'sidebar') {
            //changeActiveComponent('livetv');
        }
    };
    useHotkeys('down', addDelay(handleDownKey, 200));

    const handleEnterKey = () => {
        if (playerState.activeComponent === 'livetv') {
            navigateToChannel();
        } else if (playerState.activeComponent === 'sidebar') {
            //changeActiveComponent('livetv');
        }
    };
    useHotkeys('enter', handleEnterKey);

    const handlePageUpKey = () => {
        if (playerState.activeComponent === 'livetv') {
            navigateToChannelNumber(-8);
        } else if (playerState.activeComponent === 'sidebar') {
            //changeActiveComponent('livetv');
        }
    };    
    useHotkeys('pageup', addDelay(() => handlePageUpKey(-8), 200));

    const handlePageDownKey = () => {
        if (playerState.activeComponent === 'livetv') {
            navigateToChannelNumber(8);
        } else if (playerState.activeComponent === 'sidebar') {
            //changeActiveComponent('livetv');
        }
    };     
    useHotkeys('pagedown', addDelay(() => handlePageDownKey(8), 200));
    
    
    
};
export default useHotkeysHandler;