import React, { useState, useEffect } from 'react';

function Time({ inTime }) {
  const [formattedTime, setFormattedTime] = useState(undefined);

  const updateTime = () => {
    const currentTime = new Date();
    setFormattedTime(formatTime(currentTime));
  };

  useEffect(() => {
    // Update the time immediately when the component mounts
    updateTime();

    // Update the time every minute (adjust the interval as needed)
    const intervalId = setInterval(updateTime, 1000);

    // Clean up the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); // The empty dependency array ensures the effect runs only once on mount

  if (inTime !== undefined) {
    // If inTime is provided, update the time when inTime changes
    setFormattedTime(formatDateTimeString(inTime));
  }

  return <>{formattedTime}</>;
}

function formatTime(date) {
    const hours = (date.getHours() % 12) || 12;
    const minutes = date.getMinutes();
    const ampm = date.getHours() >= 12 ? 'PM' : 'AM';
    return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
}

function formatDateTimeString(inTime){
    const year = inTime.slice(0, 4);
    const month = inTime.slice(4, 6);
    const day = inTime.slice(6, 8);
    const hours = inTime.slice(8, 10);
    const minutes = inTime.slice(10, 12);
    const seconds = inTime.slice(12, 14);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    //return `${hours}:${minutes < 10 ? '0' : ''}${minutes} ${ampm}`;
    // Create a JavaScript Date object
    const date = new Date(`${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`);
    return formatTime(date);
}

export default Time;