var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var eventSchema = new Schema({
    title: { type: String, required: true },
    summary: { type: String },
    host: { type: String, required: true },
    start_date: { type: Date, required: true },
    end_date: { type: Date, required: true },
    event_category: [String],
    location: String,
    likes: { type: Number, default: 0 },
    remarks: [{ type: Schema.Types.ObjectId, ref: 'Remark' }]
}, { timestamps: true });

var Event = mongoose.model('Event', eventSchema);

module.exports = Event;