import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import JitsiMeet from '../dashboard/components/JitsiMeet';
import meetImage from '../dashboard/assetes/meet.jpeg';

const MeetScreen = () => {
  const [callInProgress, setCallInProgress] = useState(false);
  const [meetingData, setMeetingData] = useState(null);
  const { linkMeet } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/meet/getbylink/${linkMeet}`);
        const meetingData = response.data;
        setMeetingData(meetingData);
        setCallInProgress(true);
      } catch (error) {
        console.error('Error fetching meeting link:', error);
      }
    };

    fetchData();
  }, [linkMeet]);

  const onCallEnd = () => {
    setCallInProgress(false);
  };

  return (
    <div className="meetscreen">
      {callInProgress && meetingData && (
        <JitsiMeet
          roomName={meetingData.summary}
          displayName={meetingData.summary}
          onEnd={onCallEnd}
        />
      )}
    </div>
  );
};

export default MeetScreen;
