import { Box, Button, Flex } from '@chakra-ui/react';
import { FieldArray, Form, Formik, FormikHelpers } from 'formik';
import { Container } from '../../components/Container';
import { MyField } from '../../components/form/MyField';
import { Main } from '../../components/Main';
import Navbar from '../../components/Navbar';
import * as Yup from 'yup';
import { CreateRecipeInput } from '../../types';
import { useCreateRecipeMutation } from '../../generated/graphql';

// formik objects
const initialValues = {
  title: '',
  description: '',
  imageUrl: '',
  prepTime: 5,
  activeTime: 5,
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
  prepTime: Yup.number(),
  activeTime: Yup.number(),
  steps: Yup.array(),
  ingredients: Yup.array()
});

// component
const CreateRecipe = () => {
  const [createRecipe] = useCreateRecipeMutation();

  const onSubmit = async (
    values: CreateRecipeInput,
    { setErrors }: FormikHelpers<CreateRecipeInput>
  ) => {
    console.log(values);
    const res = await createRecipe({
      variables: { input: values }
    });

    if (!res.errors) console.log('success');
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
          {({ isSubmitting, isValid, dirty, values }) => (
            <>
              <Form>
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
                  type="number"
                  isRequired
                />
                <MyField
                  label="Cooking time"
                  name="activeTime"
                  placeholder="5"
                  type="number"
                  isRequired
                />
                <FieldArray
                  name="steps"
                  render={(arrayHelpers) => (
                    <>
                      {values.steps.map((_, index) => (
                        <Box key={index}>
                          <Flex alignItems="flex-end">
                            <MyField
                              label={`Step ${index + 1}`}
                              name={`steps[${index}].description`}
                              placeholder="e.g. Knead dough until smooth, then cover and rest for 30 minutes."
                              isTruncated
                              isRequired
                            />
                            {index > 0 ? (
                              <Button
                                ml={2}
                                mb="1rem"
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
                      {values.ingredients.map((_, index) => (
                        <Box key={index}>
                          <Flex alignItems="flex-end">
                            <MyField
                              name={`ingredients[${index}].quantity`}
                              placeholder="e.g. 1"
                            />
                            <MyField
                              name={`ingredients[${index}].unit`}
                              placeholder="teaspoon of"
                            />
                            <MyField
                              name={`ingredients[${index}].name`}
                              placeholder="olive oil"
                              isRequired
                            />
                            {index > 0 ? (
                              <Button
                                ml={2}
                                mb="1rem"
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
          )}
        </Formik>
      </Main>
    </Container>
  );
};

export default CreateRecipe;
