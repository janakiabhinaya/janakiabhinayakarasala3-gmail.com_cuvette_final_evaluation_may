const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const checklistItemSchema = new Schema({
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
});
const usertaskSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    selectpriority:{
        type: String,
        required: true,
    },
    assignto:{
        type: String,
        default: null,
        required: false,
    },
    checklist: {
        type: [checklistItemSchema],
        required: true,
    },
    duedate: {
        type: Date,
        default: null,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
      status: {
        type: String, 
        enum: ['backlog', 'todo', 'inProgress', 'done'], 
        default: 'todo' 
    },
    sharedUrl: { type: String },
})

module.exports = mongoose.model("Usertask",usertaskSchema);