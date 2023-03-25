import { FileObject, FileStatus } from './types';
/* TODO - inject "FileModifier"?
    - add rejected files with placeholder as src */

type CreateAccepted = PromiseFulfilledResult<FileObject>;

export const loadInitialFiles = async (initialFiles: string[]) => {
  const results = await Promise.allSettled(
    initialFiles.map((url) =>
      createFileFromUrl(url).then(
        (file): FileObject =>
          Object.assign(file, {
            src: url,
            id: file.lastModified + file.name,
            status: 'accepted' as FileStatus,
          }),
      ),
    ),
  );

  return results
    .filter<CreateAccepted>((res): res is CreateAccepted => res.status === 'fulfilled')
    .map((res) => res.value);
};

export async function createFileFromUrl(url: string): Promise<File> {
  const response = await fetch(url);
  const data = await response.blob();
  const metadata = { type: data.type };
  const filename = url.replace(/\?.+/, '').split('/').pop();
  return new File([data], filename!, metadata);
}

export function readFile(file: Blob): Promise<string | ArrayBuffer | null> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      resolve(event?.target?.result || null);
    };
    reader.onerror = (event) => {
      reader.abort();
      reject(event);
    };
    reader.readAsDataURL(file);
  });
}
