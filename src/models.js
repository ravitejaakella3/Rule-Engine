const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const nodeSchema = new Schema({
    type: { type: String, required: true },          // 'operator' or 'operand'
    value: { type: String, required: false },        // Condition for operand nodes
    left: { type: Schema.Types.Mixed, default: null },  // Left child for operator nodes
    right: { type: Schema.Types.Mixed, default: null }  // Right child for operator nodes
});

module.exports = mongoose.model('Node', nodeSchema);
