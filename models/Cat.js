exports.name = 'Cat';

exports.initFunction = function(kabam) {
  var CatSchema = new kabam.mongoose.Schema({
    'nickname': String
  });
console.log("Cat");
  CatSchema.index({
    nickname: 1
  });

  return kabam.mongoConnection.model('Cat', CatSchema);
};
