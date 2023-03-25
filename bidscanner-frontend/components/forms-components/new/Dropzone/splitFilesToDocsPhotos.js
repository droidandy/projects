import { photoExtension } from 'context/regexps';

function splitFilesToDocsPhotos(files) {
  const photos = [];
  const documents = [];

  files.forEach(file => {
    if (file.name.match(photoExtension)) {
      photos.push(file.bucketId);
    } else {
      documents.push(file.bucketId);
    }
  });

  return {
    documents,
    photos,
  };
}

export default splitFilesToDocsPhotos;
