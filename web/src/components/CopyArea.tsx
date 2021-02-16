import { Box, Button, FormControl, Textarea } from '@chakra-ui/react';
import React, { useRef, useState } from 'react';

interface Props {
  content: string;
}

export default function CopyArea({ content }: Props) {
  const [copySuccess, setCopySuccess] = useState('Copy');
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const copyToClipboard = (e: any) => {
    textAreaRef.current!.select();
    document.execCommand('copy');
    e.target.focus();
    setCopySuccess('Copied!');
  };

  return (
    <Box position="relative">
      {
        /* Logical shortcut for only displaying the 
          button if the copy command exists */
        document.queryCommandSupported('copy') ? (
          <Button
            onClick={copyToClipboard}
            position="absolute"
            right={2}
            top={2}
            zIndex={1}
            colorScheme="orange"
            bg="orange.400"
            color="white"
          >
            {copySuccess}
          </Button>
        ) : null
      }
      <FormControl>
        <Textarea
          ref={textAreaRef}
          value={content}
          bg="white"
          color="black"
          opacity={0.8}
          border="3px solid #eee"
          boxShadow="0 0 8px #ccc"
        />
      </FormControl>
    </Box>
  );
}
