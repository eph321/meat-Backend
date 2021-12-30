const mongoose = require('mongoose');
const dotenv = require("dotenv");
dotenv.config();

const options = {
    connectTimeoutMS: 5000,
    useUnifiedTopology : true,
    useNewUrlParser: true,
}

mongoose.connect(`mongodb+srv://Neera:${process.env.MONGODB_KEY}@cluster0.almkw.mongodb.net/meat?retryWrites=true&w=majority`,
    options,
    function(err){
        console.log(err);
    }
)

module.exports = mongoose

