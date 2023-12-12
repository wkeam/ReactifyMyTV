import React, { useEffect, useState } from 'react';
import { Parser as M3U8Parser } from 'm3u8-parser';
import axios from 'axios';
import { XMLParser, XMLBuilder } from 'fast-xml-parser';
import PropTypes from 'prop-types';
import he from 'he';

const extM3UPattern = /#EXTM3U(.*)/g;
//const extInfPattern = /#EXTINF:-1\schannel-id="([^"]+)"\stvg-id="([^"]+)"\stvg-logo="([^"]+)"\stvg-chno="([^"]+)"\sgroup-title="([^"]+)"\s,\s([^[\n]+)/g;
//const extInfPattern = /#EXTINF:-1\s+channel-id="([^"]+)"\s+tvg-id="([^"]+)"\s+tvg-logo="([^"]+)"\s+tvg-chno="(\d+)"\s+group-title="([^"]+)"\s*,\s+([^ \r\n]+)\s+([^ \r\n]+)/g;
const urlPattern = /(https:[^\s]+)/g;

const parseM3U8 = (content) => {
    const lines = content.split('\n');
    const playlists = [];
  
    let currentPlaylist = null;
  
    for (const line of lines) {
      if (line.startsWith('#EXTINF')) {
        // Extract information from the #EXTINF line
        const match = line.match(/#EXTINF:-1\s+channel-id="([^"]+)"\s+tvg-id="([^"]+)"\s+tvg-logo="([^"]+)"\s+group-title="([^"]+)"\s*,\s+([^[\n]+)/);
        if (match) {
          const [, channelID, tvgID, tvgLogo, groupTitle, channelName] = match;
          currentPlaylist = {
            channelID,
            tvgID,
            tvgLogo,
            groupTitle,
            channelName,
          };
        } else {
          const pattern = /#EXTINF:-1\s*channel-id="([^"]*)"\s*tvg-id="([^"]*)"\s*tvg-logo="([^"]*)"\s*tvg-chno="(\d+)"\s*group-title="([^"]*)"\s*,\s*(.*)$/;

          const match2 = line.match(pattern);
          if (match2) {
            const [, channelID, tvgID, tvgLogo, tvgChNo, groupTitle, channelName] = match2;
            currentPlaylist = {
              channelID,
              tvgID,
              tvgLogo,
              tvgChNo,
              groupTitle,
              channelName,
            }
          } else {

            const pattern2 = /#EXTINF:-1\s+channel-id="([^"]+)"\s+tvg-id="([^"]+)"\s+tvg-logo="([^"]+)"\s*,\s+([^,]+)/;
            const match3 = line.match(pattern2);
            if (match3) {
              const [, channelID, tvgID, tvgLogo, channelName] = match3;
              currentPlaylist = {
                channelID,
                tvgID,
                tvgLogo,
                channelName,
              }
              
            } else {
              console.log('no match: ' + line);
            }
          }
        }
      } else if (line.startsWith('https://')) {
        // If it's a URL line, add it to the current playlist
        if (currentPlaylist) {
          currentPlaylist.channelURL = line.trim();
          playlists.push(currentPlaylist);
          currentPlaylist = null;
        }
      }
    }
  
    return playlists;
  };

const sortPlaylist = (content) => {
  return content.sort((a, b) => {
    if ('tvgChNo' in a && 'tvgChNo' in b) {
      // If both have tvgChNo, compare numerically
      const tvgChNoComparison = parseInt(a.tvgChNo) - parseInt(b.tvgChNo);
  
      // If tvgChNo is the same, compare alphabetically by channelName
      return tvgChNoComparison !== 0
        ? tvgChNoComparison
        : a.channelName.localeCompare(b.channelName);
    } else if ('tvgChNo' in a) {
      // If only 'a' has tvgChNo, it comes first
      return -1;
    } else if ('tvgChNo' in b) {
      // If only 'b' has tvgChNo, it comes first
      return 1;
    } else {
      // If neither has tvgChNo, compare alphabetically by channelName
      return a.channelName.localeCompare(b.channelName);
    }
  });
}

function M3u8parser({ onChannelObjChange }) {
	const [jObj, setJObj] = useState(null);
    const [jChannelObj, setJChannelObj] = useState(null);

	useEffect(() => {
		const fetchData = async () => {
            try {
                console.log('calling m3u8 parser');
                const response = await axios.get('https://i.mjh.nz/au/Sydney/epg.xml', {
                //const response = await axios.get('https://i.mjh.nz/SamsungTVPlus/all.xml', {
                headers: {'Content-Type': 'application/xml; charset=utf-8',},
                });
                const options = {
                attributeNamePrefix: '',
                ignoreAttributes: false,
                };

                const parser = new XMLParser(options);
                const parsedObject = parser.parse(response.data);
                setJObj(parsedObject);

                const builder = new XMLBuilder();
                const xmlContent = builder.build(parsedObject);

                
            } catch (error) {
                console.error('Error fetching XML data:', error);
            }
		};

    const fetchChannels = async () => {
        if (!jChannelObj) {
          console.log('Fetching channels');
          const onlinePlaylists = [
            'https://i.mjh.nz/au/Sydney/raw-tv.m3u8',
            'https://i.mjh.nz/PlutoTV/us.m3u8',
            'https://i.mjh.nz/Plex/au.m3u8'
          ];
          try {
            let combinedList = [];
            for(const opl of onlinePlaylists){
              const channelResponse = await axios.get(opl, {
                headers: { 'Content-Type': 'application/xml; charset=utf-8' },
              });
              let parsedm3u8 = sortPlaylist(parseM3U8(channelResponse.data));
              combinedList = [...combinedList, ...parsedm3u8];

            }
            console.log(combinedList); 
            setJChannelObj(combinedList);
            onChannelObjChange(combinedList); // Call the function in the parent component
          } catch (error) {
            console.error('Error fetching M3U8 data:', error);
          }
        }
      };

		//fetchData();
        fetchChannels();
        //console.log(jChannelObj);
	}, [onChannelObjChange]); // Empty dependency array ensures the effect runs once on mount

	return (
		<div></div>
	);
}

M3u8parser.propTypes = {
    onChannelObjChange: PropTypes.func.isRequired,
};

export default M3u8parser;