const axios = require('axios');
const { parseString } = require('xml2js');
const { promisify } = require('util');
const fs = require('fs');
const path = require('path');
const { app } = require('electron');
const { v4: uuidv4 } = require('uuid');

// Promisify the parseString function
const parseStringPromise = promisify(parseString);

async function fetchData() {
    
        console.log('calling m3u8 parser');
        const appPath = app.getAppPath();
        const onlineEpgs = [
          'https://i.mjh.nz/au/Sydney/epg.xml',
          'https://i.mjh.nz/PlutoTV/us.xml',
          'https://i.mjh.nz/Plex/au.xml'
        ];

        let combinedEpg = [];

            const options = {
              explicitArray: false,
              mergeAttrs: true,
              explicitRoot: false
            };
            for(const epg of onlineEpgs){
              const epgResponse = await axios.get(epg, {
                headers: { 'Content-Type': 'application/xml; charset=utf-8' },
              });
              // Use promisified parseString
              const episodeGuide = await parseStringPromise(epgResponse.data, options);
              combinedEpg = [...combinedEpg, ...episodeGuide.programme];
            }

            //const convertedJSON = combinedEpg.map(item => ({
            const fetchData = async () => {
              try {
                console.log('start convertedJSON');
                const convertedJSON = await Promise.all(combinedEpg.map(async (item) => {
                  let descString = '';
                  let titleString = '';
                  if(item.desc && item.desc["_"]){
                    descString = item.desc["_"];
                  }
                  if(item.title && item.title["_"]){
                    titleString = item.title["_"];
                  }
                  return {
                    id: uuidv4(),
                    description: descString !== '' ? descString : item.desc,
                    title: titleString !== '' ? titleString : item.title,
                    isYesterday: false,
                    since: parseDate(item.start).toISOString().slice(0, -5),
                    till: parseDate(item.stop).toISOString().slice(0, -5),
                    channelUuid: item.channel ? item.channel : item.uuid,
                    image: item.icon && item.icon.src ? item.icon.src : '',
                    country: "Ghana",
                    Year: '',
                    Rated: item.rating && item.rating.value ? item.rating.value : ''
                     
                  };
                }));
                console.log('end convertedJSON');
                // const filePathWrite = path.join(appPath, 'src/helpers/epg.js');
                // fs.writeFileSync(filePathWrite, 'export const epg = ' + JSON.stringify(convertedJSON));
                const userDataPath = app.getPath('userData');
                const filePathWrite = path.join(userDataPath, 'appdata/epg.js');
        
                // Make sure the directory exists before attempting to write the file
                const directoryPath = path.dirname(filePathWrite);
                if (!fs.existsSync(directoryPath)) {
                    fs.mkdirSync(directoryPath, { recursive: true });
                }
                
                // Write the file
                fs.writeFileSync(filePathWrite, 'export const epg = ' + JSON.stringify(convertedJSON));
                
                console.log(`File saved to: ${filePathWrite}`);
              } catch (error) {
                console.error('fetchData', error);
              }
            };
            
            // Call the fetchData function
            await fetchData();
        // Return the parsed result

        console.log('Fetching channels');
        const onlinePlaylists = [
            'https://i.mjh.nz/au/Sydney/raw-tv.m3u8',
            'https://i.mjh.nz/PlutoTV/us.m3u8',
            'https://i.mjh.nz/Plex/au.m3u8'
        ];
        let combinedList = [];
      
            
            for(const opl of onlinePlaylists){
            const channelResponse = await axios.get(opl, {
                headers: { 'Content-Type': 'application/xml; charset=utf-8' },
            });
            let parsedm3u8 = sortPlaylist(parseM3U8(channelResponse.data));
            combinedList = [...combinedList, ...parsedm3u8];

            }

            const mappedJson = combinedList.map((item, index) => ({
              uuid: item.channelID.replace(/^(pluto-|plex-)/, ''),
              type: "channel",
              title: item.channelName ? item.channelName : '',
              country: '',
              provider: '', //item.tvgChNo,
              logo: item.tvgLogo,
              year: 2023, // You can replace this with the actual value if available
              channelURL: item.channelURL,
              index: index, // Shorthand for index: index
            }));

        // const filePathWrite = path.join(appPath, 'src/helpers/channels.js');
        // fs.writeFileSync(filePathWrite, 'export const channels = ' + JSON.stringify(mappedJson));
        const userDataPath = app.getPath('userData');
        const filePathWrite = path.join(userDataPath, 'appdata/channels.js');
        
        // Make sure the directory exists before attempting to write the file
        const directoryPath = path.dirname(filePathWrite);
        if (!fs.existsSync(directoryPath)) {
            fs.mkdirSync(directoryPath, { recursive: true });
        }
        
        // Write the file
        fs.writeFileSync(filePathWrite, 'export const channels = ' + JSON.stringify(mappedJson));
        
        console.log(`File saved to: ${filePathWrite}`);
        
        return combinedList;

}

function getTimezoneOffset() {
  function z(n){return (n<10? '0' : '') + n}
  var offset = new Date().getTimezoneOffset();
  var sign = offset < 0? '+' : '-';
  offset = Math.abs(offset);
  return sign + z(offset/60 | 0) + z(offset%60);
}
const offset = parseInt(getTimezoneOffset().substring(1,3));

const parseDate = (dateString) => {
  const components = [
    dateString.slice(0, 4),
    dateString.slice(4, 6) - 1, // Months are 0-based in JavaScript
    dateString.slice(6, 8),
    dateString.slice(8, 10),
    dateString.slice(10, 12),
    dateString.slice(12, 14),
  ].map(Number);

  const originalDate = new Date(Date.UTC(...components));
  return setHours(originalDate, originalDate.getHours() + offset);
};

// Utility function to set hours
const setHours = (date, hours) => {
  const adjustedDate = new Date(date);
  adjustedDate.setHours(hours);
  return adjustedDate;
};

const parseM3U8 = (content) => {
  const lines = content.split('\n');
  const playlists = [];
  let currentPlaylist = null;

  for (const line of lines) {
    if (line.startsWith('#EXTINF')) {
      let match;

      // Try the first pattern
      match = line.match(/#EXTINF:-1\s+channel-id="([^"]+)"\s+tvg-id="([^"]+)"\s+tvg-logo="([^"]+)"\s+group-title="([^"]+)"\s*,\s+([^[\n]+)/);

      // Try the second pattern if the first one fails
      if (!match) {
        match = line.match(/#EXTINF:-1\s*channel-id="([^"]*)"\s*tvg-id="([^"]*)"\s*tvg-logo="([^"]*)"\s*tvg-chno="(\d+)"\s*group-title="([^"]*)"\s*,\s*(.*)$/);
      }

      // Try the third pattern if the second one fails
      if (!match) {
        match = line.match(/#EXTINF:-1\s+channel-id="([^"]+)"\s+tvg-id="([^"]+)"\s+tvg-logo="([^"]+)"\s*,\s+([^,]+)/);
      }

      if (match) {
        const [, channelID, tvgID, tvgLogo, tvgChNo, groupTitle, channelName] = match;
        currentPlaylist = {
          channelID,
          tvgID,
          tvgLogo,
          tvgChNo,
          groupTitle,
          channelName,
        };
      } else {
        console.log('no match');
        console.log(line);
      }
    } else if (line.startsWith('https://')) {
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


module.exports = { fetchData };
