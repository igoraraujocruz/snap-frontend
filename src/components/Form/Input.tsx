import {
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input as ChakraInput,
  InputProps as ChakraInputProps,
} from '@chakra-ui/react';
import { ComponentType, forwardRef, ForwardRefRenderFunction } from 'react';
import { FieldError } from 'react-hook-form';
import { IconBaseProps } from 'react-icons';

interface InputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
  icon?: ComponentType<IconBaseProps>;
}

const InputBase: ForwardRefRenderFunction<HTMLInputElement, InputProps> = (
  { name, label, error = null, icon: Icon, bg, ...rest },
  ref,
) => {
  return (
    <FormControl isInvalid={!!error} h="6.5rem">
      {!!label && (
        <FormLabel id={`label-${name}`} htmlFor={name}>
          {label}
        </FormLabel>
      )}
      <Flex align="center" bg="gray.900" borderRadius="0.3rem">
        {Icon && <Icon size={20} />}
        <ChakraInput
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

export const Input = forwardRef(InputBase);
