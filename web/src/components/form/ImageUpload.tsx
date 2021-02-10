import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
} as const;

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
} as const;

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
} as const;

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
} as const;

export const ImageUpload = ({
  setFieldValue
}: {
  setFieldValue: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
}) => {
  const [files, setFiles] = useState<any>([]);
  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      setFiles(
        acceptedFiles.map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file)
          })
        )
      );
      await upload(acceptedFiles);
    }
  });

  const upload = async (acceptedFiles: any) => {
    acceptedFiles.forEach((file: any) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_UPLOAD_PRESET as string
      );
      axios({
        url: process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL,
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: formData
      })
        .then((res) => setFieldValue('imageUrl', res.data.secure_url))
        .catch((err) => console.log(err));
    });
  };

  const thumbs = files.map((file: any) => (
    <div style={thumb} key={file.name}>
      <div style={thumbInner}>
        <img src={file.preview} style={img} />
      </div>
    </div>
  ));

  useEffect(
    () => () => {
      // Make sure to revoke the data uris to avoid memory leaks
      files.forEach((file: any) => URL.revokeObjectURL(file.preview));
    },
    [files]
  );

  return (
    <section className="container">
      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
      </div>
      <aside style={thumbsContainer}>{thumbs}</aside>
    </section>
  );
};
