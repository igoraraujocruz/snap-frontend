import {
  Box,
  Spinner,
  Flex,
  Grid,
  Heading,
  Image,
  Text,
  HStack,
  Button,
  AspectRatio,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  DrawerHeader,
  DrawerBody,
  DrawerFooter,
  Stack,
  useToast,
} from '@chakra-ui/react';
import Head from 'next/head';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Footer } from '../components/Footer';
import { SearchInput } from '../components/Form/SearchInput';
import { Header } from '../components/Header';
import { api } from '../services/apiClient';
import { Product, useProducts } from '../services/hooks/useProducts';
import { Input } from '../components/Form/Input';
import { MaskedInput } from '../components/Form/MaskedInput';
import { createClients } from '../services/hooks/useClients';

interface SearchProps {
  search: string;
}

type CreateFormData = {
  name: string;
  neighborhood: string;
  birthday: string;
  mobilePhone: string;
  email: string;
};

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

export default function Home() {
  const { data, isLoading, error, isFetching } = useProducts();
  const [itemFilters, setItemFilters] = useState<Product[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const btnRef = useRef();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateFormData>({
    resolver: yupResolver(createFormSchema),
  });

  const { handleSubmit: handleSubmitSearch, register: registerSeach } =
    useForm<SearchProps>();

  const onSubmit = async ({ search }: SearchProps) => {
    try {
      await api
        .get(`/products?option=${search}`)
        .then(response => setItemFilters(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  const toast = useToast();

  const sendSubscription: SubmitHandler<CreateFormData> = async (
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

  return (
    <>
      <Head>
        <title>Loja | Snap</title>
      </Head>
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={onClose}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay />
        <DrawerContent bgImage="./bolinhas.png" bg="gray.900">
          <DrawerCloseButton />
          <DrawerHeader>Cadastre-se</DrawerHeader>

          <DrawerBody>
            <Stack
              spacing="2"
              onSubmit={handleSubmit(sendSubscription)}
              as="form"
            >
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

              <Button
                mt="2rem"
                bg="#da251c"
                _hover={{ bg: '#000' }}
                border="0.2rem solid black"
                type="submit"
              >
                Enviar
              </Button>
            </Stack>
          </DrawerBody>

          <DrawerFooter>
            <Button variant="outline" mr={3} onClick={onClose}>
              Cancelar
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      <Flex flexDir="column" w="100%" bg="#fafaff">
        <Header />
        <Button
          bg="#da251c"
          _hover={{ bg: '#000' }}
          border="0.2rem solid black"
          ref={btnRef}
          onClick={onOpen}
          h="5rem"
        >
          CADASTRAR
        </Button>
        <HStack
          mt={['2rem']}
          as="form"
          onSubmit={handleSubmitSearch(onSubmit)}
          justify="center"
          align="center"
        >
          <SearchInput
            w={['11rem', '11rem', '15rem', '18rem']}
            borderColor="#000"
            border="0.2rem solid black"
            name="search"
            {...registerSeach('search', {
              onChange() {
                setItemFilters([]);
              },
            })}
          />
          <Button
            bg="#da251c"
            _hover={{ bg: '#000' }}
            border="0.2rem solid black"
            type="submit"
          >
            Procurar
          </Button>
        </HStack>
        <Flex justify="center" minH="70vh">
          {(!isLoading && isFetching) || isLoading ? (
            <Flex justify="center" align="center">
              <Spinner color="orange" />
            </Flex>
          ) : error ? (
            <Flex justify="center" align="center">
              <Text>Falha ao obter dados</Text>
            </Flex>
          ) : itemFilters.length ? (
            <Grid
              templateColumns={[
                '1fr',
                '1fr',
                '1fr 1fr',
                '1fr 1fr',
                '1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr',
              ]}
            >
              {itemFilters.map(product => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <Flex
                    key={product.id}
                    p="2rem"
                    flexDir="column"
                    alignItems="center"
                  >
                    <Heading color="#000" cursor="pointer">
                      {product.name}
                    </Heading>

                    <AspectRatio
                      w={['17rem', '17rem', '26rem']}
                      h={['17rem', '17rem', '26rem']}
                      ratio={[1 / 0.3]}
                    >
                      <Image
                        cursor="pointer"
                        w={['250px', '250px', '300px']}
                        zIndex={1}
                        h="324.29px"
                        src={
                          !product.photos[0]
                            ? 'imageNotFound2.svg'
                            : product.photos[0].url
                        }
                      />
                    </AspectRatio>
                    <Box
                      cursor="pointer"
                      mt="-1rem"
                      zIndex={0}
                      bg="black"
                      p="1rem"
                    >
                      <Text align="center" fontSize="1.5rem">
                        R${product.price} ou {product.debitPoints} pontos
                      </Text>
                      <HStack justify="center">
                        <Text color="orange" align="center" fontSize="1.5rem">
                          Recebe
                        </Text>
                        <Text
                          align="center"
                          fontSize="1.5rem"
                          borderBottom="0.1rem solid #FF6B00"
                        >
                          {product.creditPoints} pontos
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>
                </Link>
              ))}
            </Grid>
          ) : (
            <Grid
              templateColumns={[
                '1fr',
                '1fr',
                '1fr 1fr',
                '1fr 1fr',
                '1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr',
                '1fr 1fr 1fr 1fr',
              ]}
            >
              {data.products.map(product => (
                <Link key={product.id} href={`/product/${product.slug}`}>
                  <Flex
                    key={product.id}
                    p="2rem"
                    flexDir="column"
                    alignItems="center"
                  >
                    <Heading color="#000" cursor="pointer">
                      {product.name}
                    </Heading>
                    <AspectRatio
                      w={['17rem', '17rem', '26rem']}
                      h={['17rem', '17rem', '26rem']}
                      ratio={[1 / 0.3]}
                    >
                      <Image
                        cursor="pointer"
                        w={['250px', '250px', '300px']}
                        zIndex={1}
                        h="324.29px"
                        src={
                          !product.photos[0]
                            ? 'imageNotFound2.svg'
                            : product.photos[0].url
                        }
                      />
                    </AspectRatio>

                    <Box
                      cursor="pointer"
                      mt="-1rem"
                      zIndex={0}
                      bg="black"
                      p="1rem"
                    >
                      <Text align="center" fontSize="1.5rem">
                        R${product.price} ou {product.debitPoints} pontos
                      </Text>
                      <HStack justify="center">
                        <Text color="orange" align="center" fontSize="1.5rem">
                          Recebe
                        </Text>
                        <Text
                          align="center"
                          fontSize="1.5rem"
                          borderBottom="0.1rem solid #FF6B00"
                        >
                          {product.creditPoints} pontos
                        </Text>
                      </HStack>
                    </Box>
                  </Flex>
                </Link>
              ))}
            </Grid>
          )}
        </Flex>
        <Footer />
      </Flex>
    </>
  );
}
