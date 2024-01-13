class Status {
    show(req, res) {

        const used = process.memoryUsage()

        for (let key in used)
            used[key] = Math.round(used[key] / 1024 / 1024 * 100) / 100

        return res.json({ status: "Ok", process: used, })
    }
}

module.exports = new Status()