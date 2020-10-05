mongoose=require('mongoose');

const activitySchema = mongoose.Schema({
    name: String
});

module.exports=mongoose.model('Activity',activitySchema);