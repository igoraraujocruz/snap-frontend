import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Textarea as ChakraTextarea,
  TextareaProps as ChakraTextareaProps,
  Flex,
} from '@chakra-ui/react';
import { forwardRef, ForwardRefRenderFunction, useState } from 'react';
import { FieldError } from 'react-hook-form';

interface TextareaProps extends ChakraTextareaProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
}

const TextAreaBase: ForwardRefRenderFunction<
  HTMLTextAreaElement,
  TextareaProps
> = ({ name, label, error = null, bg, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error} h="9rem">
      {!!label && (
        <FormLabel id={`label-${name}`} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Flex align="center" bg="gray.900" borderRadius="0.3rem">
        <ChakraTextarea
          name={name}
          id={name}
          focusBorderColor="#FF6B00"
          bgColor={bg || 'gray.900'}
          variant="filled"
          _hover={{
            bgColor: 'gray.900',
          }}
          size="lg"
          {...rest}
          ref={ref}
        />
      </Flex>

      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const Textarea = forwardRef(TextAreaBase);
