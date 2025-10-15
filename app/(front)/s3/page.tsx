// app/s3/page.tsx
"use client";

import { Dropzone, FileWithMetadata } from "@/components/ui/dropzone";
import { useState } from "react";

export default function HomePage() {
  const [files, setFiles] = useState<FileWithMetadata[]>();
  console.log(files);
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">AWS S3 File Upload</h1>
      <Dropzone
        provider="aws-s3"
        variant="minimal"
        maxFiles={10}
        maxSize={1024 * 1024 * 50} // 50MB
        onFilesChange={(files) => setFiles(files)}
      />
    </div>
  );
}
