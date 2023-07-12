import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Stack,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { SubmitHandler, useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  ForwardRefRenderFunction,
  forwardRef,
  useImperativeHandle,
} from 'react';
import { createClients } from '../../../services/hooks/useClients';
import { Input } from '../../../components/Form/Input';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import { MaskedInput } from '../../../components/Form/MaskedInput';

type CreateFormData = {
  name: string;
  neighborhood: string;
  birthday: string;
  mobilePhone: string;
  email: string;
};

export interface ICreateClientModal {
  onOpen: () => void;
  onClose: () => void;
}

const createFormSchema = yup.object().shape({
  name: yup.string().required('Nome é obrigatório'),
  neighborhood: yup.string().required('O Bairro é obrigatório'),
  birthday: yup.string().required('Data de Nascimento é obrigatório'),
  mobilePhone: yup
    .string()
    .required('Nº de Celular é obrigatório')
    .matches(
      /^\([1-9]{2}\) (?:[2-8]|9[1-9])[0-9]{3}\-[0-9]{4}$/,
      'Número de telefone inválido',
    ),
  email: yup.string().required('Email é obrigatório').email(),
});

const CreateClients: ForwardRefRenderFunction<ICreateClientModal> = (
  props,
  ref,
) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(createFormSchema),
  });

  const { isOpen, onOpen, onClose } = useDisclosure();

  const toast = useToast();

  const onSubmit: SubmitHandler<CreateFormData> = async (
    values: CreateFormData,
  ) => {
    try {
      await createClients({
        name: values.name,
        neighborhood: values.neighborhood,
        birthday: values.birthday,
        mobilePhone: values.mobilePhone.replace(/\D/g, ''),
        email: values.email,
      });

      reset();
      onClose();
      toast({
        title: 'Cliente cadastrado com sucesso',
        status: 'success',
        duration: 2000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Não foi possível cadastrar o cliente',
        description: error.response.data.message,
        status: 'error',
        duration: 2000,
        isClosable: true,
      });
    }
  };

  useImperativeHandle(ref, () => ({
    onOpen,
    onClose,
  }));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent bg="gray.800">
        <ModalCloseButton />
        <ModalHeader />
        <ModalBody>
          <Flex
            onSubmit={handleSubmit(onSubmit)}
            as="form"
            borderRadius={8}
            flexDir="column"
          >
            <Text mt="-2rem" mb="1rem" fontSize="2xl">
              Novo Cliente
            </Text>

            <Stack spacing="0.5">
              <Input
                name="name"
                error={errors.name}
                label="Nome"
                {...register('name')}
              />
              <Input
                name="neighborhood"
                error={errors.neighborhood}
                label="Bairro"
                {...register('neighborhood')}
              />
              <Input
                error={errors.birthday}
                type="date"
                name="birthday"
                label="Data da Nascimento"
                max="2999-12-31"
                {...register('birthday')}
              />
              <MaskedInput
                mask={[
                  '(',
                  /\d/,
                  /\d/,
                  ')',
                  ' ',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                  '-',
                  /\d/,
                  /\d/,
                  /\d/,
                  /\d/,
                ]}
                error={errors.mobilePhone}
                name="mobilePhone"
                label="Celular"
                {...register('mobilePhone')}
              />
              <Input
                error={errors.email}
                name="email"
                label="Email"
                {...register('email')}
              />
            </Stack>
            <Button
              bg="#FF6B00"
              _hover={{ bg: 'orangeHover' }}
              type="submit"
              size="lg"
              mt="6"
              mb="2rem"
            >
              Cadastrar
            </Button>
          </Flex>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export const getServerSideProps = withSSRAuth(async () => ({
  props: {},
}));

export default forwardRef(CreateClients);
