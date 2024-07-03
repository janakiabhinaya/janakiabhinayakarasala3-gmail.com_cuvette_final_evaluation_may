const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userSchema = new Schema({
    name:{
        type: String,
        required: true,
    },
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    },
    addPeople: {
        type: [String],
        validate: {
            validator: function(v) {
                // Check if each element in the array is a valid email
                return v.every(email => /.+@.+\..+/.test(email));
            },
            message: props => `${props.value} contains an invalid email address`
        }
    }
});

module.exports = mongoose.model("User",userSchema);