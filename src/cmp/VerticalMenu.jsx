//VerticalMenu.jsx
import React, { useState, useEffect, useRef } from 'react';
import ChannelSelector from './ChannelSelector';
import parsedData from '../data/parsed_data/parsedData.json';

const VerticalMenu = ({ items, onItemSelected, onItemPreSelected, onKeyPress }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [preselectedIndex, setPreSelectedIndex] = useState(0);
  const flexContainerRef = useRef(null);
  const [selectedChannel, setSelectedChannel] = useState('');
  const channelData = JSON.parse(JSON.stringify(parsedData));
  const handleChannelChange = (newChannel) => {
    if(newChannel<channelData.channels.length && newChannel>0){
      setSelectedChannel(newChannel);
      setSelectedIndex(newChannel-1);
      setPreSelectedIndex(newChannel-1);
    }
    // Add any other logic you want to perform when the channel changes
  };

  useEffect(() => {
    // console.log('verticalmenu useeffct');
    let a = {'channel':channelData.channels[selectedIndex],'index':selectedIndex};
    let b = {'channel':channelData.channels[preselectedIndex],'index':preselectedIndex};
    onItemSelected(a);
    onItemPreSelected(b);

    // Attach event listener when component mounts
    const handleKeyPress = (event) => {
      //onKeyPress(event);
      event.preventDefault();
      handleKeystroke(event);
      
    };

    // Scroll the focused item into view when selectedIndex changes
    if (flexContainerRef.current) {
      const container = flexContainerRef.current;
      const focusedItem = container.children[preselectedIndex];
      focusedItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    window.addEventListener('keydown', handleKeyPress);

    // Detach event listener when component unmounts
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };


  }, [selectedIndex, items, preselectedIndex]);

  const handleKeystroke = (event) => {
    switch (event.key) {
      case 'PageUp':
        setTimeout(() => {
          setPreSelectedIndex((prevIndex) => (prevIndex > 10 ? preselectedIndex - 10 : 0));
        }, 200);
          break;
        case 'PageDown':
          setTimeout(() => {
            setPreSelectedIndex((prevIndex) => (prevIndex < channelData.channels.length - 10 ? preselectedIndex + 10 : channelData.length-1));
          }, 200);
          break;
        case 'ArrowUp':
          setTimeout(() => {
            setPreSelectedIndex((prevIndex) => (prevIndex > 0 ? preselectedIndex - 1 : channelData.channels.length - 1));
          }, 200);
          break;
          case 'ArrowDown':
            setTimeout(() => {
              setPreSelectedIndex((prevIndex) => (prevIndex < channelData.channels.length - 1 ? preselectedIndex + 1 : 0));
            }, 200);
          break;
        case 'Enter':
          setSelectedIndex(preselectedIndex);
          break;
        default:
          break;
    }
  };

  const doClick = (a, index) => {
    //console.log(a);
    //onItemSelected(a.channelURL);
    setSelectedIndex(index);
    setPreSelectedIndex(index);
  };

  const formatToLocalTime = (dateString) => {
    try {
      const utcDate = getDateFromString(dateString); // Ensure the UTC offset is recognized by replacing the "+0000" with "Z"
      const localDate = new Date(utcDate.toLocaleString('en-US', { timeZone: 'Australia/Sydney' })); // Replace 'Your-Timezone' with your actual timezone (e.g., 'Australia/Sydney')
  
      // Format the date in the desired way
      const formattedDate = localDate.toLocaleString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      });
      return formattedDate;
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Invalid date';
    }
  };

  function getDateFromString(dateString) {
    // Parse the provided date string
    const year = parseInt(dateString.slice(0, 4), 10);
    const month = parseInt(dateString.slice(4, 6), 10) - 1; // Month is zero-based
    const day = parseInt(dateString.slice(6, 8), 10);
    const hour = parseInt(dateString.slice(8, 10), 10);
    const minute = parseInt(dateString.slice(10, 12), 10);
    const second = parseInt(dateString.slice(12, 14), 10);

    // Create a Date object in the UTC timezone from the provided date string
    const dateInUTC = new Date(Date.UTC(year, month, day, hour, minute, second));

    // Parse the date in the local timezone
    //const dateInLocalTimezone = new Date(dateInLocalTimezoneString);

    return dateInUTC;
  }

  return (
    <div
      onKeyDown={handleKeystroke}
      style={{
        //display: 'flex',
        // padding: '10px',
        outline: 'none',
        //flexFlow: 'row wrap',
        //position: 'relative',
        justifyContent: 'space-evenly',
      }}
      ref={flexContainerRef}
    >
      {channelData.channels.map((item, index) => {
        // Function to get the current program for a channel
        const getCurrentProgram = () => {
          //console.log('getCurrentProgram');
            const currentTime = new Date();

            for (const program of item.programs) {
              const startTime = getDateFromString(program.start);
              const stopTime = getDateFromString(program.stop);
              if (currentTime >= startTime && currentTime < stopTime) {
                return program;
              }
            }
            return null; // Return null if no program is currently airing
        };

        const currentProgram = getCurrentProgram();
        return(
        <div
          key={index}
          style={{
            width: 'calc(100vw - 160px)',
            // padding: '10px',
            margin: '2px',
            border: index === preselectedIndex ? '5px solid #ccc' : '5px solid #222831',
            borderRadius: '15px',
            background: index === preselectedIndex ? '#222831' : '#393E46',
            color: index === preselectedIndex ? '#fff' : '#aaa',
            cursor: 'pointer',
            fontWeight: 'bold',
            //fontSize: 'calc(1vw)'
            //flex: '0 1 calc(10%)'
          }}
          onClick={() => doClick(item, index)}
        >
          <table>
            <tbody>
              <tr>
                <td>
                <p>{index+1}</p>
                </td>
                <td>
                  <img style={{width: '10vw',height: '5vh', maxWidth: '100px', maxHeight: '50px',backgroundColor: 'lightgrey', borderRadius: '1vw'}} alt={item.name} src={item.tvgLogo}/>
                  {item.channelName}
                </td>
                {/* <td>
                  <img style={{height: '10vh', float: 'left'}} src={currentProgram && currentProgram.icon && currentProgram.icon.src} alt=""/>
                </td> */}
                <td style={{minWidth:'200px'}}>
                  {currentProgram && currentProgram.title ? <p>{currentProgram.title.toString()}</p> : ''}
                  {currentProgram && currentProgram["sub-title"] ? <p>{currentProgram["sub-title"].toString()}</p> : ''}
                </td>
                <td style={{width:'100%'}}>
                    {currentProgram && (
                      <p>{formatToLocalTime(currentProgram.start)}</p>
                    )}

                    {currentProgram && (
                      <p>{formatToLocalTime(currentProgram.stop)}</p>
                    )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        );
      })}
      <ChannelSelector  onChannelChange={handleChannelChange}/>
    </div>
  );
};

export default VerticalMenu;