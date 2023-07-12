import {
  Input as ChakraInput,
  ComponentWithAs,
  FormControl,
  FormErrorMessage,
  FormLabel,
  InputProps as ChakraInputProps,
  Flex,
} from '@chakra-ui/react';
import {
  ComponentType,
  forwardRef,
  ForwardRefRenderFunction,
  useState,
} from 'react';
import { FieldError } from 'react-hook-form';
import { IconBaseProps } from 'react-icons';
import ReactMaskedInput from 'react-text-mask';

interface MaskedInputProps extends ChakraInputProps {
  name: string;
  label?: string;
  error?: FieldError;
  bg?: string;
  mask: any;
  icon?: ComponentType<IconBaseProps>;
}

interface MaskedChakraInputProps extends Omit<ChakraInputProps, 'ref'> {
  ref?: React.RefCallback<
    (HTMLInputElement & { inputElement: HTMLInputElement }) | null
  >;
}

const MaskedChakraInput: ComponentWithAs<'input', MaskedChakraInputProps> =
  ChakraInput;

const MaskedInputBase: ForwardRefRenderFunction<
  HTMLInputElement,
  MaskedInputProps
> = ({ name, label, error = null, icon: Icon, bg, mask, ...rest }, ref) => {
  return (
    <FormControl isInvalid={!!error} h="6.5rem">
      {!!label && (
        <FormLabel id={`label-${name}`} htmlFor={name}>
          {label}
        </FormLabel>
      )}

      <Flex align="center" bg="gray.900" borderRadius="0.3rem">
        <MaskedChakraInput
          as={ReactMaskedInput}
          guide={false}
          mask={mask}
          name={name}
          id={name}
          focusBorderColor="#FF6B00"
          bgColor={bg || 'gray.900'}
          variant="filled"
          _hover={{
            bgColor: 'gray.900',
          }}
          size="lg"
          ref={data => {
            if (typeof ref === 'function') {
              if (data && data.inputElement) {
                ref(data.inputElement);
              } else {
                ref(data);
              }
            }
          }}
          {...rest}
        />
      </Flex>
      {!!error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export const MaskedInput = forwardRef(MaskedInputBase);
