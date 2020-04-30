const knex = require("knex");
const config = require("../knexfile");
const db = knex(config.development);
module.exports = {
  find,
  findById,
  findSteps,
  add,
  addStep,
  update,
  remove
};

function find() {
  return db("schemes");
}
function findById(id) {
  return db("schemes")
    .where({ id })
    .first();
}
function findSteps(id) {
  return db("schemes")
    .join("steps", "steps.scheme_id", "schemes.id")
    .select("schemes.scheme_name", "steps.step_number", "steps.instructions")
    .where({ scheme_id: id })
    .orderBy("steps.step_number");
}
function add(schemeData) {
  return db("schemes")
    .insert(schemeData)
    .then(ids => {
      return findById(ids[0]);
    });
}
function addStep(stepData, id) {
  const newStepData = {
    step_number: stepData.step_number,
    instructions: stepData.instructions,
    scheme_id: id
  };
  console.log(newStepData);
  return db("steps")
    .insert(newStepData)
    .then(ids => {
      console.log("id we get back", ids);
      return findSteps(id);
    });
}
function update(changes, id) {
  return db("schemes")
    .where({ id })
    .update(changes)
    .then(count => {
      return findById(id);
    });
}
function remove(id) {
  return db("schemes")
    .where({ id })
    .del();
}
