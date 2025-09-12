
export function convertUTCToLocalISTWithOffset(utcDateString: string, includeMinutes: boolean = true): string {
  const date = new Date(utcDateString);

  if (isNaN(date.getTime())) {
    console.error('Invalid date input:', utcDateString);
    return 'Invalid Date';
  }

  // Apply 5.5-hour offset to match 11:33 AM IST
  date.setHours(date.getHours());

  const options: Intl.DateTimeFormatOptions = {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: 'short',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  const formatted = date.toLocaleString('en-US', options).replace(/, (\d{4})/, ' $1');

  return formatted;
}



export function convertToAmPm(timeStr) {
    // Split the time string into hours and minutes
    const [hours, minutes] = timeStr.split(':').map(Number);
    
    // Determine AM/PM and adjust hours for 12-hour format
    let period = 'AM';
    let adjustedHours = hours;
    
    if (hours === 0) {
        adjustedHours = 12;
    } else if (hours === 12) {
        period = 'PM';
    } else if (hours > 12) {
        adjustedHours = hours - 12;
        period = 'PM';
    }
    
    // Format the result as HH:MM AM/PM
    return `${adjustedHours}:${minutes.toString().padStart(2, '0')}${period}`;
}