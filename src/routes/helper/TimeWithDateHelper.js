const TimeWithDateHelper = (date) => {
  var tempDate = '';
  var finalTime = '';
  var finalDate = '';
  tempDate = new Date(date).toUTCString();
  
  // Code start for date format change to dd-mm-yyyy
  var isoString = tempDate;
  var utcTime = (new Date(isoString)).toUTCString();

  var getDate = new Date(utcTime).getDate();
  var getMonth = (new Date(utcTime).getMonth() + 1);
  var getFullYear = new Date(utcTime).getFullYear();

  var getHour = new Date(utcTime).getHours();
  var getMinute = new Date(utcTime).getMinutes();
  var getSecond = new Date(utcTime).getSeconds();
  var ampm = getHour >= 12 ? 'PM' : 'AM';
  getHour = getHour % 12;
  getHour = getHour ? getHour : 12;

  if(getDate < 10)
  {
    getDate = '0'+getDate;
  }
  if(getMonth < 10)
  {
    getMonth = '0'+getMonth;
  }
  if(getMinute < 10) {
    getMinute = '0'+getMinute;
  }
  if(getSecond < 10) {
    getSecond = '0'+getSecond;
  }

  finalDate = getDate + "/" + getMonth + "/" + getFullYear;
  if(finalDate === '01/01/1970')
  {
    return finalDate = '-';
  }
  
  finalTime =  getHour + ":" + getMinute + ":" + getSecond + " " +ampm;
  if(finalDate === '01/01/1970' || finalTime === '5:30:00 PM')
  {
    return finalTime = '-';
  }
  else
  {
    return finalDate + ' ' + finalTime;
  }
}
export default TimeWithDateHelper;