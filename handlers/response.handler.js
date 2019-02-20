
'use strict';

const response = (data, statusCode) => {

  //console.log(`cors: ${process.env.DOMAIN}`);
  //console.log(`statusCode: ${statusCode || 200}`)
  
  return {
    statusCode: statusCode || 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify(data),
  };
}

module.exports = {
  response
}