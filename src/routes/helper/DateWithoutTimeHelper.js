const DateWithoutTimeHelper = (date) => {
  var tempDate = '';
  var finalDate = '';
  
  tempDate = new Date(date).toUTCString();
  var isoString = tempDate;
  var utcDate = (new Date(isoString)).toUTCString();

  var getDate = new Date(utcDate).getDate();
  var getMonth = (new Date(utcDate).getMonth() + 1);
  var getFullYear = new Date(utcDate).getFullYear();
  
  if(getDate < 10)
  {
    getDate = '0'+getDate;
  }
  
  if(getMonth < 10)
  {
    getMonth = '0'+getMonth;
  }
  
  finalDate = getDate + "/" + getMonth + "/" + getFullYear;

  if(finalDate === '01/01/1970')
  {
    return finalDate = '-';
  }
  else
  {
    return finalDate;
  }
}
export default DateWithoutTimeHelper;