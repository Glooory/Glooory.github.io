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

    Promise.all(
      Array.from(items)
        .filter((item) => !!item.webkitGetAsEntry()?.isDirectory)
        .map((item) => {
          const entry = item.webkitGetAsEntry()!;
          return checkIfDirectoryHasFiles(entry).then((hasFiles) => {
            return { name: entry.name, hasFiles };
          });
        })
    ).then((res) => {
      const emptyDirectories = res.filter((entry) => !entry.hasFiles).map((entry) => entry.name);
      if (emptyDirectories.length) {
        console.log(`Empty Directory ${emptyDirectories.join(", ")} Detected!`);
        notifications.show({
          title: "请选择非空文件夹上传",
          message: `空文件夹(${emptyDirectories.join(", ")})不会被上传。`,
        });
      }
    });
  };

  return (
    <input
      multiple
      type="file"
      webkitdirectory=""
      title="点击选择空文件夹或拖入空文件夹"
      onChange={handleChange}
      onDrop={handleDrop}
    />
  );
};

export { UploadDirectoryDemo };
