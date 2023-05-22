const TimeWithoutDateHelper = (date) => {
  if(date !== '' && date !== undefined && date !== null) {
    var tempDate = '';
    var finalTime = '';
    tempDate = new Date(date).toUTCString();
    
    // Code start for date format change to dd-mm-yyyy
    var isoString = tempDate;
    var utcTime = (new Date(isoString)).toUTCString();
    
    var getHour = new Date(utcTime).getHours();
    var getMinute = new Date(utcTime).getMinutes();
    var getSecond = new Date(utcTime).getSeconds();
    var ampm = getHour >= 12 ? 'PM' : 'AM';
    getHour = getHour % 12;
    getHour = getHour ? getHour : 12;

    if(getMinute < 10) {
      getMinute = '0'+getMinute;
    }
    if(getSecond < 10) {
      getSecond = '0'+getSecond;
    }

    finalTime = getHour + ":" + getMinute + ":" + getSecond + " " +ampm;
    if(finalTime === '5:30:00 PM')
    {
      return finalTime = '-';
    }
    else
    {
      return finalTime;
    }
  } else {
    return finalTime = '-';
  }    
}
export default TimeWithoutDateHelper;