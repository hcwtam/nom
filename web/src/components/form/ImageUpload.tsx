import { Flex } from '@chakra-ui/react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';

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
        <Flex
          cursor="pointer"
          w="100%"
          h={files[0]?.preview ? '400px' : '200px'}
          mb="30px"
          borderRadius="5px"
          border="2px dashed #808080"
          justify="center"
          align="center"
          fontWeight="600"
          backgroundImage={
            files[0]?.preview ? `url(${files[0].preview as string})` : ''
          }
          backgroundPosition="center"
          backgroundRepeat="no-repeat"
        >
          Add photo
        </Flex>
      </div>
    </section>
  );
};
