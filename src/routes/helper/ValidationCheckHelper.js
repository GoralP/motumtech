const ValidationCheckHelper = (fieldName, value, validationCheck=[]) => {
    var errorMessages = '';
    var errorFound = false;
    validationCheck.forEach((mapValue, mapKey) => {
        value = value.trim();
        if(!errorFound) {
            if(mapValue === 'blank') {
                if(value === '') {
                errorFound = true;
                errorMessages += fieldName + ' is required.';
                }
            } else if(mapValue === 'email') {
                errorFound = true;
                if(!new RegExp(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,15}/g).test(value)) {
                errorMessages += 'Please provide valid ' + fieldName + '.';
                }
            }
        }
    });
    return errorMessages;
}
  export default ValidationCheckHelper;