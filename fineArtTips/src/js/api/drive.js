/**
 * Created by developercomputer on 29.11.15.
 */
var drive = {
  api_key: "AIzaSyCcn4pssZn81PRzyib9cYN5WpwgMNAusN0",
  fileId: (() => {
    if(!window.Parse) {
      return "0B95dcO1jEknfZ3BQN1JNV2JPSWc";
    }
    var getFile = new Promise((resolve, reject) => {
      var FileId = Parse.Object.extend("FileId");
      var query = new Parse.Query(FileId);
      query.find({
        success: results => resolve(results[0]),
        error: error => reject(error)
      });
    });
    getFile.then(
            file => drive.fileId = file.toJSON().file_id
    ).catch(
        () => drive.fileId = "0B95dcO1jEknfZ3BQN1JNV2JPSWc"
    );
  })(),
  query(fileId) {
    return `https://www.googleapis.com/drive/v2/files/${this.fileId}?key=${this.api_key}`;
  }
};

module.exports = drive;
