const { modelsFiles } = require('@/models/utils');

const mongoose = require('mongoose');

const create = require('./create');
const read = require('./read');
const update = require('./update');
const remove = require('./remove');
const search = require('./search');
const filter = require('./filter');
const summary = require('./summary');
const listAll = require('./listAll');
const paginatedList = require('./paginatedList');

const createCRUDController = (modelName) => {
  // Model existence check removed to support dynamic Multi-Tenant models

  let crudMethods = {
    create: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return create(Model, req, res);
    },
    read: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return read(Model, req, res);
    },
    update: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return update(Model, req, res);
    },
    delete: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return remove(Model, req, res);
    },
    list: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return paginatedList(Model, req, res);
    },
    listAll: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return listAll(Model, req, res);
    },
    search: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return search(Model, req, res);
    },
    filter: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return filter(Model, req, res);
    },
    summary: (req, res) => {
      const Model = req.models?.[modelName] || mongoose.model(modelName);
      return summary(Model, req, res);
    },
  };
  return crudMethods;
};

module.exports = createCRUDController;
