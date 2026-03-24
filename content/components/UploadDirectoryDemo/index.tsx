"use client";

import { notifications } from "@mantine/notifications";

declare module "react" {
  interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

const UploadDirectoryDemo = () => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("onChange files:", e.target.files);
  };

  const handleDrop = (e: React.DragEvent<HTMLInputElement>) => {
    // e.preventDefault();

    const items = e.dataTransfer.items;

    const checkIfDirectoryHasFiles = (
      directoryEntry: FileSystemEntry & { createReader?: () => FileSystemDirectoryReader }
    ): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        let pendingDirectories = 0;

        const readEntries = (entry: FileSystemEntry & { createReader?: () => FileSystemDirectoryReader }) => {
          pendingDirectories++;

          const reader = entry?.createReader?.();
          reader?.readEntries((entries: FileSystemEntry[]) => {
            const fileEntries: FileSystemEntry[] = [];
            const directoryEntries: FileSystemEntry[] = [];

            entries.forEach((entry) => {
              if (entry.isDirectory) {
                directoryEntries.push(entry);
              } else {
                fileEntries.push(entry);
              }
            });

            if (fileEntries.length > 0) {
              resolve(true);
              return;
            }

            for (const childEntry of directoryEntries) {
              readEntries(childEntry);
            }

            pendingDirectories--;

            if (pendingDirectories === 0) {
              resolve(false);
            }
          }, reject);
        };

        readEntries(directoryEntry);
      });
    };

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      // webkitGetAsEntry works in most modern browsers (Chrome, Firefox, Safari)
      const entry = item.webkitGetAsEntry();

      if (entry?.isDirectory) {
        checkIfDirectoryHasFiles(entry).then((hasFiles) => {
          if (!hasFiles) {
            console.log(`Empty Directory ${entry.name} Detected!`);
            notifications.show({ title: "请选择非空文件夹上传", message: `空文件夹(${entry.name})不会被上传。` });
          }
        });
      }
    }
  };

  return <input multiple type="file" webkitdirectory="" onChange={handleChange} onDrop={handleDrop} />;
};

export { UploadDirectoryDemo };
