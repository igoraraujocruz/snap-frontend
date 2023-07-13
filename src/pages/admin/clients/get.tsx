import {
  Box,
  Button,
  Flex,
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
import { useCallback, useRef, useState } from 'react';
import { BsTrashFill } from 'react-icons/bs';
import { LiaBirthdayCakeSolid } from 'react-icons/lia';
import { useForm } from 'react-hook-form';
import DeleteModal, {
  ModalDeleteHandle,
} from '../../../components/Modais/DeleteModal';
import { Client, useClients } from '../../../services/hooks/useClients';
import DetailsClientModal, {
  ModalDetailsClient,
} from '../../../components/Modais/DetailsClientModal';
import { SearchInput } from '../../../components/Form/SearchInput';
import { api } from '../../../services/apiClient';
import { Pagination } from '../../../components/Pagination';
import CreateClients, { ICreateClientModal } from './create';
import { Can } from '../../../components/Can';

interface SearchProps {
  search: string;
}

export default function GetClients() {
  const [minWidth] = useMediaQuery('(min-width: 884px)');
  const createClientModal = useRef<ICreateClientModal>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = minWidth ? 12 : 7;
  const { data, isLoading, error, isFetching } = useClients(
    currentPage,
    itemsPerPage,
  );
  const [clientId, setClientId] = useState('');
  const [client, setClient] = useState({} as Client);
  const { register, handleSubmit } = useForm();
  const [itemFilters, setItemFilters] = useState<Client[]>([]);

  const modalDelete = useRef<ModalDeleteHandle>(null);
  const modalDetailsClientModal = useRef<ModalDetailsClient>(null);

  const openDeleteModal = useCallback((clientId: string) => {
    setClientId(clientId);
    modalDelete.current.onOpen();
  }, []);

  const openDetailsClientModal = useCallback((client: Client) => {
    setClient(client);
    modalDetailsClientModal.current.onOpen();
  }, []);

  const onSubmit = async ({ search }: SearchProps) => {
    try {
      await api
        .get(`/clients?option=${search}`)
        .then(response => setItemFilters(response.data));
    } catch (err) {
      //
    }
  };

  return (
    <Flex w={['90vw', '90vw', '90vw', '100vw', '70vw']} flexDir="column">
      <DeleteModal clientId={clientId} ref={modalDelete} />
      <DetailsClientModal client={client} ref={modalDetailsClientModal} />
      <Can permissions={['Cadastrar Cliente']}>
        <CreateClients ref={createClientModal} />
      </Can>
      <Flex
        justify="space-evenly"
        flexDir={['column', 'row']}
        mt="2rem"
        align="center"
      >
        <Can permissions={['Cadastrar Cliente']}>
          <Button
            ml={['1rem']}
            mr={['1rem']}
            onClick={() => createClientModal.current.onOpen()}
            bg="orange"
            fontSize={['0.8rem', '0.8rem', '1rem']}
            _hover={{ bg: 'orangeHover' }}
            w="10rem"
          >
            Novo Cliente
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

      <Can permissions={['Listar Cliente']}>
        <Flex h="2.5rem" justify="center" align="center">
          {!isLoading && isFetching && <Spinner size="md" color="gray.500" />}
        </Flex>

        {isLoading ? (
          <Flex h="2.5rem" justify="center" align="center">
            <Spinner size="md" color="gray.500" />
          </Flex>
        ) : error ? (
          <Flex justify="center">
            <Text>Falha ao obter dados dos clientes.</Text>
          </Flex>
        ) : (
          <Flex flexDir="column" align="start">
            <Flex justify="center" w="100%">
              <Pagination
                registersPerPage={itemsPerPage}
                totalCountOfRegisters={data?.quantityOfClients}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            </Flex>
            <Table colorScheme="whiteAlpha" align="center" w="1rem" size="sm">
              <Thead>
                <Tr>
                  <Th />
                  <Th>Nome</Th>
                  <Th>Email</Th>
                  <Th>Celular</Th>
                  <Th>Data de Nascimento</Th>
                  <Th>Data do cadastro</Th>
                  <Th>Pontos</Th>
                  <Th />
                </Tr>
              </Thead>
              <Tbody>
                {itemFilters.length
                  ? itemFilters.map(client => (
                      <Tr key={client.id} cursor="pointer">
                        <Td onClick={() => openDetailsClientModal(client)}>
                          <LiaBirthdayCakeSolid size={25} />
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.name}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.email}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.mobilePhone}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {new Date(client.birthday).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            },
                          )}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {new Date(client.createdAt).toLocaleDateString(
                            'pt-BR',
                            {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                            },
                          )}
                        </Td>
                        <Td>{client.points}</Td>
                        <Td
                          color="gray.600"
                          _hover={{ color: '#FF6B00' }}
                          transition="color 200ms"
                        >
                          <BsTrashFill
                            size={25}
                            onClick={() => openDeleteModal(client.id)}
                            cursor="pointer"
                          />
                        </Td>
                      </Tr>
                    ))
                  : data.clients.map(client => (
                      <Tr key={client.id} cursor="pointer">
                        <Td onClick={() => openDetailsClientModal(client)}>
                          <LiaBirthdayCakeSolid size={25} />
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.name}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.email}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.mobilePhone}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.birthday}
                        </Td>
                        <Td onClick={() => openDetailsClientModal(client)}>
                          {client.createdAt}
                        </Td>
                        <Td>{client.points}</Td>
                        <Td
                          color="gray.600"
                          _hover={{ color: '#FF6B00' }}
                          transition="color 200ms"
                        >
                          <BsTrashFill
                            size={25}
                            onClick={() => openDeleteModal(client.id)}
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
