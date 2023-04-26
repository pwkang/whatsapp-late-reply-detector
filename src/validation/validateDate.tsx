import React from 'react';
import moment from 'moment';


const isContainsDate = (content: string, format: string) => {
  for (let i = 0; i < content.length; i++) {
    const str = content.slice(0, i + 1).replaceAll(' ', ' ');
    const date = moment(str, format);
    const parsedFormat = date.format(format).replaceAll(' ', ' ');
    if (parsedFormat === str) {
      return {
        timestamp: date.valueOf(),
        content: content.slice(i + 1),
      };
    }
    // console.log(str, date.isValid(), date.valueOf(), date.format(format));
  }
  return false;
};

type validateDateProps = {
  content: string,
  format: string,
}

type validateDateReturn = {
  isValid: boolean,
  content: string,
  timestamp: number,
}

function validateDate({content, format}: validateDateProps): validateDateReturn {
  const date = isContainsDate(content, format);
  return {
    isValid: !!date,
    content: date ? date.content : content,
    timestamp: date ? date.timestamp : 0,
  };
}

export default validateDate;