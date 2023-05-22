const EmployeeDateHelper = (date) => {
  var tempDate = '';
  var finalDate = '';

  var ampm = date.substring(date.length - 2, date.length);
  let str = date;
  str = str.substring(0, str.length - 2);
  tempDate = new Date(str);

  var newyear = tempDate.getFullYear();
  var newmonth = tempDate.getMonth() + 1;
  var newdate = tempDate.getUTCDate();
  var newhour = tempDate.getHours();
  var newminute = tempDate.getMinutes();
  
  if(newdate < 10)
  {
    newdate = '0'+newdate;
  }
  
  if(newmonth < 10)
  {
    newmonth = '0'+newmonth;
  }

  if(newhour < 10)
  {
    newhour = '0'+newhour;
  }

  if(newminute < 10)
  {
    newminute = '0'+newminute;
  }
  
  finalDate = newdate + "/" + newmonth + "/" + newyear + " " + newhour + ":" + newminute + " " + ampm;

  if(finalDate === '01/01/1970')
  {
    return finalDate = '-';
  }
  else
  {
    return finalDate;
  }
}
export default EmployeeDateHelper;