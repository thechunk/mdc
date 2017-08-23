
/*
 * GET users listing.
 */

exports.list = function(req, res){
  res.send( process.env.OPENSHIFT_REPO_DIR ); // __dirname ); //require.resolve('jade')) ;//"respond with a resource");
};