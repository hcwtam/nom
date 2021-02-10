import { Box, Button, Flex, Text } from '@chakra-ui/react';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { Container } from '../../components/Container';
import { MyField } from '../../components/form/MyField';
import { Main } from '../../components/Main';
import Navbar from '../../components/Navbar';
import * as Yup from 'yup';
import { CreateRecipeInput } from '../../types';
import { useCreateRecipeMutation } from '../../generated/graphql';
import React from 'react';
import { ImageUpload } from '../../components/form/ImageUpload';
import { useRouter } from 'next/router';

// formik objects
const initialValues = {
  title: '',
  description: '',
  imageUrl: '',
  prepTime: '',
  activeTime: '',
  steps: [{ description: '', step: 1 }],
  ingredients: [
    {
      name: '',
      quantity: undefined,
      unit: ''
    }
  ]
};

const validationSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  imageUrl: Yup.string(),
  prepTime: Yup.number()
    .typeError('you must specify a number')
    .positive('must be greater than zero')
    .required('Please provide preparation time'),
  activeTime: Yup.number()
    .typeError('you must specify a number')
    .positive('must be greater than zero')
    .required('Please provide cooking time'),
  steps: Yup.array()
    .of(
      Yup.object().shape({
        step: Yup.number().required(),
        description: Yup.string().required('Please provide step description')
      })
    )
    .required('Must have at least one step'),
  ingredients: Yup.array()
    .of(
      Yup.object().shape({
        quantity: Yup.number()
          .typeError('you must specify a number')
          .positive('must be greater than zero'),
        unit: Yup.string(),
        name: Yup.string().required('Please provide name of ingredient')
      })
    )
    .required('Must have at least one ingredient')
});

// component
const CreateRecipe = () => {
  const router = useRouter();
  const [createRecipe] = useCreateRecipeMutation();

  const onSubmit = async (
    values: CreateRecipeInput,
    _: FormikHelpers<CreateRecipeInput>
  ) => {
    const ingredients = values.ingredients.map((ingredient) => ({
      ...ingredient,
      quantity: ingredient.quantity
        ? parseInt((ingredient.quantity as unknown) as string)
        : null
    }));
    const sortedValues = {
      ...values,
      prepTime: parseInt(values.prepTime),
      activeTime: parseInt(values.activeTime),
      ingredients
    };

    console.log(sortedValues);
    await createRecipe({
      variables: {
        input: sortedValues
      }
    }).then(() => router.push('/'));
  };

  return (
    <Container minHeight="100vh">
      <Navbar />
      <Main>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={(values, actions) => onSubmit(values, actions)}
        >
          {({ isSubmitting, isValid, dirty, values, setFieldValue }) => {
            return (
              <>
                <Form>
                  <ImageUpload setFieldValue={setFieldValue} />
                  <MyField
                    label="Recipe Name"
                    name="title"
                    placeholder="Name of the dish"
                    isRequired
                  />
                  <MyField
                    label="Description"
                    name="description"
                    placeholder="Description of recipe"
                    textarea
                    minH="100px"
                  />
                  <MyField
                    label="Preparation time"
                    name="prepTime"
                    placeholder="5"
                    isRequired
                  />
                  <MyField
                    label="Cooking time"
                    name="activeTime"
                    placeholder="5"
                    isRequired
                  />
                  <FieldArray
                    name="steps"
                    render={(arrayHelpers) => (
                      <>
                        <Text as="h2" mt={10} mb={5} fontSize="1.5rem">
                          Steps
                        </Text>
                        {values.steps.map((_, index) => (
                          <Box key={index}>
                            <Flex alignItems="flex-start">
                              <MyField
                                label={`Step ${index + 1}`}
                                name={`steps[${index}].description`}
                                placeholder="e.g. Knead dough until smooth, then cover and rest for 30 minutes."
                                isTruncated
                                isRequired={index === 0}
                              />
                              {index > 0 ? (
                                <Button
                                  ml={2}
                                  mt="2rem"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  -
                                </Button>
                              ) : null}
                            </Flex>
                            {index === values.steps.length - 1 ? (
                              <Button
                                mb={4}
                                onClick={() =>
                                  arrayHelpers.push({
                                    description: '',
                                    step: index + 2
                                  })
                                }
                              >
                                Add step
                              </Button>
                            ) : null}
                          </Box>
                        ))}
                      </>
                    )}
                  />
                  <FieldArray
                    name="ingredients"
                    render={(arrayHelpers) => (
                      <>
                        <Text as="h2" mt={10} mb={5} fontSize="1.5rem">
                          Ingredients
                        </Text>
                        {values.ingredients.map((_, index) => (
                          <Box key={index}>
                            <Flex alignItems="flex-start">
                              <MyField
                                name={`ingredients[${index}].quantity`}
                                placeholder="e.g. 1"
                                label="Quantity"
                              />
                              <MyField
                                name={`ingredients[${index}].unit`}
                                placeholder="teaspoon of"
                                label="Unit"
                              />
                              <MyField
                                name={`ingredients[${index}].name`}
                                placeholder="olive oil"
                                label="Name"
                                isRequired
                              />
                              {index > 0 ? (
                                <Button
                                  ml={2}
                                  mt="2rem"
                                  onClick={() => arrayHelpers.remove(index)}
                                >
                                  -
                                </Button>
                              ) : null}
                            </Flex>
                            {index === values.ingredients.length - 1 ? (
                              <Button
                                onClick={() =>
                                  arrayHelpers.push({
                                    quantity: undefined,
                                    unit: '',
                                    name: ''
                                  })
                                }
                              >
                                Add ingredient
                              </Button>
                            ) : null}
                          </Box>
                        ))}
                      </>
                    )}
                  />
                  <Button
                    colorScheme="orange"
                    w="100%"
                    my={4}
                    isLoading={isSubmitting}
                    type="submit"
                    disabled={!dirty || !isValid}
                  >
                    Submit
                  </Button>
                </Form>
              </>
            );
          }}
        </Formik>
      </Main>
    </Container>
  );
};

export default CreateRecipe;
