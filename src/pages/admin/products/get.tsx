import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Spinner,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from '@chakra-ui/react';
import 'react-medium-image-zoom/dist/styles.css';
import { BsTrashFill } from 'react-icons/bs';
import { useCallback, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import dynamic from 'next/dynamic';
import { ApexOptions } from 'apexcharts';
import DetailsProductModal, {
  DetailsProductModalHandle,
} from '../../../components/Modais/DetailsProductModal';
import { Product, useProducts } from '../../../services/hooks/useProducts';
import DeleteModal, {
  ModalDeleteHandle,
} from '../../../components/Modais/DeleteModal';
import { SearchInput } from '../../../components/Form/SearchInput';
import { api } from '../../../services/apiClient';
import { Pagination } from '../../../components/Pagination';
import CreateProducts, { ICreateProductModal } from './create';
import { Can } from '../../../components/Can';

interface SearchProps {
  search: string;
}

export default function GetProducts() {
  const [minWidth] = useMediaQuery('(min-width: 884px)');
  const itemsPerPage = minWidth ? 14 : 7;
  const createProductModal = useRef<ICreateProductModal>(null);
  const modalDelete = useRef<ModalDeleteHandle>(null);
  const modalUploadImage = useRef<DetailsProductModalHandle>(null);
  const [productId, setProductId] = useState('');
  const [product, setProduct] = useState({} as Product);
  const [itemFilters, setItemFilters] = useState<Product[]>([]);
  const { register, handleSubmit } = useForm();
  const [currentPage, setCurrentPage] = useState(1);
  const { data, isLoading, error, isFetching } = useProducts(
    currentPage,
    itemsPerPage,
  );

  const openDeleteModal = useCallback((productId: string) => {
    setProductId(productId);
    modalDelete.current.onOpen();
  }, []);

  const openUploadModal = useCallback((product: Product) => {
    setProduct(product);
    modalUploadImage.current.onOpen();
  }, []);

  const onSubmit = async ({ search }: SearchProps) => {
    try {
      await api
        .get(`/products?option=${search}`)
        .then(response => setItemFilters(response.data));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Flex w={['90vw', '90vw', '90vw', '100vw']} flexDir="column">
      <DeleteModal productId={productId} ref={modalDelete} />
      <DetailsProductModal product={product} ref={modalUploadImage} />
      <Can permissions={['Cadastrar Produto']}>
        <CreateProducts ref={createProductModal} />
      </Can>
      <Flex
        justify="space-evenly"
        flexDir={['column', 'row']}
        mt="2rem"
        align="center"
      >
        <Can permissions={['Cadastrar Produto']}>
          <Button
            ml={['1rem']}
            mr={['1rem']}
            onClick={() => createProductModal.current.onOpen()}
            bg="orange"
            fontSize={['0.8rem', '0.8rem', '1rem']}
            _hover={{ bg: 'orangeHover' }}
            w="10rem"
          >
            Novo Produto
          </Button>
        </Can>

        <HStack
          mt={['1rem', 0]}
          as="form"
          onSubmit={handleSubmit(onSubmit)}
          justify={['center', 'center', 'center', 'center', 'flex-end']}
        >
          <SearchInput
            w="13rem"
            borderColor="gray.600"
            name="search"
            {...register('search', {
              onChange() {
                setItemFilters([]);
              },
            })}
          />
          <Button
            bg="orange"
            fontSize={['0.8rem', '0.8rem', '1rem']}
            _hover={{ bg: 'orangeHover' }}
            type="submit"
          >
            Procurar
          </Button>
        </HStack>
      </Flex>
      <Can permissions={['Listar Produto']}>
        <Flex h="2.5rem" align="center" justify="center">
          {!isLoading && isFetching && <Spinner size="md" color="gray.500" />}
        </Flex>
        {isLoading ? (
          <Flex h="2.5rem" align="center" justify="center">
            <Spinner size="md" color="gray.500" />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Falha ao obter dados dos produtos.</Text>
          </Flex>
        ) : (
          <Flex flexDir="column" align="start">
            <Flex justify="center" w="100%">
              <Pagination
                registersPerPage={itemsPerPage}
                totalCountOfRegisters={data?.quantityOfProduct}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </Flex>

            <Table w="1rem" align="center" colorScheme="whiteAlpha" size="sm">
              <Thead>
                <Tr>
                  <Th>Nome do Produto</Th>
                  <Th>Descrição</Th>
                  <Th>Preço</Th>
                  <Th>Pontos Débito</Th>
                  <Th>Pontos Crédito</Th>
                  <Th>Slug</Th>
                  <Th>Cadastrado por:</Th>
                  <Th>Data do cadastro</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {itemFilters.length
                  ? itemFilters.map(product => (
                      <Tr key={product.id}>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.name}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.description}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          R$ {product.price}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                          color="#c30000"
                        >
                          - {product.debitPoints}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                          color="#0064cf"
                        >
                          + {product.creditPoints}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.slug}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.user
                            ? product.user.name
                            : 'Usuário Excluído'}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {new Date(product.createdAt).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                            },
                          )}
                        </Td>
                        <Td
                          color="gray.600"
                          _hover={{ color: '#FF6B00' }}
                          transition="color 200ms"
                          cursor="pointer"
                        >
                          <BsTrashFill
                            size={25}
                            onClick={() => openDeleteModal(product.id)}
                            cursor="pointer"
                          />
                        </Td>
                      </Tr>
                    ))
                  : data.products.map(product => (
                      <Tr key={product.id}>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.name}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                          maxW="0.5rem"
                          overflow="hidden"
                          whiteSpace="nowrap"
                          textOverflow="ellipsis"
                        >
                          {product.description}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          R$ {product.price}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                          color="#c30000"
                        >
                          - {product.debitPoints}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                          color="#0064cf"
                        >
                          + {product.creditPoints}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.slug}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.user
                            ? product.user.name
                            : 'Usuário Excluído'}
                        </Td>
                        <Td
                          onClick={() => openUploadModal(product)}
                          cursor="pointer"
                        >
                          {product.createdAt}
                        </Td>
                        <Td
                          color="gray.600"
                          _hover={{ color: '#FF6B00' }}
                          transition="color 200ms"
                        >
                          <BsTrashFill
                            size={25}
                            onClick={() => openDeleteModal(product.id)}
                            cursor="pointer"
                          />
                        </Td>
                      </Tr>
                    ))}
              </Tbody>
            </Table>
          </Flex>
        )}
      </Can>
    </Flex>
  );
}
