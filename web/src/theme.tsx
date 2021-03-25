import { extendTheme } from '@chakra-ui/react';
import { createBreakpoints } from '@chakra-ui/theme-tools';

const fonts = { mono: `'Menlo', monospace` };

const Button = {
  baseStyle: {
    _hover: {
      boxShadow: '0 0 5px #fff9ee'
    },
    _focus: { boxShadow: '0 0 5px #fff9ee' }
  }
};

const ModalCloseButton = {
  baseStyle: {
    _hover: {
      boxShadow: '0 0 5px #fff9ee'
    },
    _focus: { boxShadow: '0 0 5px #fff9ee' }
  }
};

const ModalContent = {
  baseStyle: {
    backgroundColor: '#111111'
  }
};

const breakpoints = createBreakpoints({
  sm: '40em',
  md: '52em',
  lg: '64em',
  xl: '80em'
});

const theme = extendTheme({
  initialColorMode: 'dark',
  useSystemColorMode: false,
  colors: {
    customBlack: '#212121',
    customGray: '#2d2d2d'
  },
  fonts,
  breakpoints,
  components: {
    Button,
    ModalContent,
    ModalCloseButton
  }
});

export default theme;
