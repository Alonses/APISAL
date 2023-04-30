const mongoose = require("mongoose")

// qid -> Question ID

const schema = new mongoose.Schema({
    qid: { type: Number, default: 0 },
    question: { type: String, default: null },
    answer: { type: String, default: null }
})

const model = mongoose.model("Charada", schema)

async function getCharada() {

    // Coletando uma charada aleatória do banco
    return model.aggregate([{ $sample: { size: 1 } }])
}

module.exports.Charada = model
module.exports = {
    getCharada
}