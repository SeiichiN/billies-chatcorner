// use_fakeUser.js

var peopleDb = billiesChatcorner.model.people.get_db();

var peopleList = peopleDb.get();

console.log(peopleList);

