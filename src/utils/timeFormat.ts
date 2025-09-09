// // Function to convert UTC ISO date string to local IST format
// export function convertUTCToLocalIST(
//   utcDateString: string,
//   offsetHours: number = 0,
//   includeMinutes: boolean = true
// ): string {
//   const date = new Date(utcDateString);
//   date.setHours(date.getHours() + offsetHours); // Add offset if needed

//   if (isNaN(date.getTime())) {
//     return 'Invalid Date';
//   }

//   const options: Intl.DateTimeFormatOptions = {
//     timeZone: 'Asia/Kolkata',
//     year: 'numeric',
//     month: 'short',
//     day: '2-digit',
//     hour: '2-digit',
//     minute: '2-digit',
//     hour12: true,
//   };

//   return date.toLocaleString('en-US', options).replace(/, (\d{4})/, ' $1');
// }

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