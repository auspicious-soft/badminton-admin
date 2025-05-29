import React from 'react';
import AllMatches from '../components/Matches/AllMatches';
import NotificationForm from '../components/notifications/notification-form';

const Page = () => {
    const handleNotificationSubmit = (data) => {
        // You can add additional logic here, like API calls
        console.log('Notification submitted:', data);
      };
    return (
        <div>
           <NotificationForm  />
        </div>
    );
}

export default Page;
