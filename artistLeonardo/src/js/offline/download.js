/**
 * Created by developercomputer on 18.11.15.
 */
function DownloadFile(URL, Folder_Name, File_Name, callback) {
  //Parameters mismatch check
  if (URL == null && Folder_Name == null && File_Name == null) {
    throw new Error("some fields are empty");
  }
  else {
    //checking Internet connection availablity
    var networkState = navigator.connection.type;
    if(networkState == Connection.NONE) {
      return console.warn("offline");
    } else {
      return download(URL, Folder_Name, File_Name, callback); //If available download function call
    }
  }
}
function download(URL, Folder_Name, File_Name, callback) {
//step to request a file system
  window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, fileSystemSuccess, fileSystemFail);

  function fileSystemSuccess(fileSystem) {
    var download_link = encodeURI(URL);
    var ext = download_link.substr(download_link.lastIndexOf('.') + 1); //Get extension of URL

    var directoryEntry = fileSystem.root; // to get root path of directory
    directoryEntry.getDirectory(Folder_Name, { create: true, exclusive: false }, onDirectorySuccess, onDirectoryFail); // creating folder in sdcard
    var rootdir = fileSystem.root;
    //var fp = rootdir.fullPath; // Returns Fulpath of local directory
    var fp = rootdir.nativeURL; // Returns Fulpath of local directory

    fp = fp + "/" + Folder_Name + "/" + File_Name + "." + ext; // fullpath and name of the file which we want to give
    // download function call
    filetransfer(download_link, fp, callback);
  }

  function onDirectorySuccess(parent) {
    // Directory created successfuly
  }

  function onDirectoryFail(error) {
    //Error while creating directory
    console.log("Unable to create new directory: " + error.code);
  }

  function fileSystemFail(evt) {
    //Unable to access file system
    console.log(evt.target.error.code);
  }
}
function filetransfer(download_link, fp, callback) {
  var fileTransfer = new FileTransfer();
  // File download function with URL and local path
  fileTransfer.download(download_link, fp,
      function (entry) {
        if(typeof(callback) === "function") {
          callback(entry.nativeURL);
        }
      },
      function (error) {
        //Download abort errors or download failed errors
        console.log("download error source " + error.source);
        console.log("download error target " + error.target);
        console.log("upload error code" + error.code);
      }
  );
}

module.exports = DownloadFile;
