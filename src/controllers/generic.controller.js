const boom = require("boom");

const genericCrud = (model) => ({
  async get({ params: { id } }, req, res) {
    try {
      const item = await model.findById(id);
      return res.status(200).send(item);
    } catch (error) {
      return res.status(400).send(boom.boomify(error));
    }
  },
  async getAll(req, res) {
    try {
      const items = await model.find();
      return res.status(200).send(items);
    } catch (error) {
      return res.status(400).send(boom.boomify(error));
    }
  },
  async create({ body }, res) {
    try {
      const item = new model(body);
      const newItem = await item.save();
      return res.status(200).send(newItem);
    } catch (error) {
      return res.status(400).send(boom.boomify(error));
    }
  },
  async update({ params: { id }, body }, res) {
    try {
      const item = await model.findByIdAndUpdate(id, body, { new: true });
      return res.status(200).send(item);
    } catch (error) {
      return res.status(400).send(boom.boomify(error));
    }
  },
  async delete({ params: { id } }, res) {
    try {
      await model.findByIdAndDelete(id);
      return res.status(200).send({ status: "OK", message: "Продукт удален" });
    } catch (error) {
      return res.status(400).send(boom.boomify(error));
    }
  },
});

module.exports = genericCrud;
