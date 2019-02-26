const Apartment = require('./apartment/apartment.model');
const { dbConnection } = require('./services/connection.service');


const execute = async () => {
  dbConnection();
  const Ap = new Apartment({
    address: {
      country: "21212"
    }
  }).save();
  console.log(Ap);
}
execute()