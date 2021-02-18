import React, { useEffect, useState } from 'react';
import { useCombobox } from 'downshift';
import { Flex, Input, List, ListItem, Text } from '@chakra-ui/react';
import { useSearchQuery } from '../../generated/graphql';

interface Item {
  label: string;
  value: string;
}

interface Props {
  selectResult: (Item: Item) => void;
}

const ComboboxInput = React.forwardRef(({ ...props }, ref: any) => {
  return <Input {...props} ref={ref} />;
});

const ComboboxList = React.forwardRef(({ isOpen, ...props }: any, ref) => {
  return <List display={isOpen ? null : 'none'} py={2} {...props} ref={ref} />;
});

const ComboboxItem = React.forwardRef(
  ({ itemIndex, highlightedIndex, ...props }: any, ref) => {
    const isActive = itemIndex === highlightedIndex;

    return (
      <ListItem
        transition="background-color 220ms, color 220ms"
        bg={isActive ? 'teal.100' : null}
        px={4}
        py={2}
        cursor="pointer"
        {...props}
        ref={ref}
      />
    );
  }
);

export default function SearchBar({ selectResult }: Props) {
  const { data } = useSearchQuery();
  const [inputItems, setInputItems] = useState<Item[]>([]);
  const [recipes, setRecipes] = useState<Item[]>([]);

  useEffect(() => {
    if (data?.paths) {
      setInputItems(
        data.paths.map((item) => ({
          value: item.id.toString(),
          label: item.title
        }))
      );
      setRecipes(
        data.paths.map((item) => ({
          value: item.id.toString(),
          label: item.title
        }))
      );
    }
  }, [data, data?.paths]);

  const {
    isOpen,
    openMenu,
    closeMenu,
    getMenuProps,
    getInputProps,
    getItemProps,
    getComboboxProps,
    highlightedIndex
  } = useCombobox({
    items: recipes,
    onInputValueChange: ({ inputValue }: any) => {
      setInputItems(
        recipes.filter((item) =>
          item.label.toLowerCase().includes(inputValue.toLowerCase())
        )
      );
    }
  });
  return (
    <Flex
      {...getComboboxProps()}
      direction="column"
      m="0 auto"
      position="relative"
      maxW="500px"
      w="100%"
    >
      <Flex direction="row" alignItems="baseline" w="100%">
        <ComboboxInput
          {...getInputProps({
            onFocus: () => {
              if (!isOpen) {
                openMenu();
              }
            }
          })}
          placeholder={!data ? 'Loading...' : 'Search for recipe...'}
          mt={3}
          id="downshift-0-input"
        />
      </Flex>
      <ComboboxList
        isOpen={isOpen}
        {...getMenuProps()}
        flex={1}
        overflowY="auto"
        mt={20}
        id="downshift-0-menu"
      >
        {inputItems.length ? (
          inputItems.map((item, index) => (
            <ComboboxItem
              itemIndex={index}
              {...getItemProps({ item, index })}
              highlightedIndex={highlightedIndex}
              key={index}
              onClick={() => {
                selectResult(item);
                closeMenu();
              }}
            >
              {item.label}
            </ComboboxItem>
          ))
        ) : (
          <Text px={5} py={2}>
            No available results.
          </Text>
        )}
      </ComboboxList>
    </Flex>
  );
}
