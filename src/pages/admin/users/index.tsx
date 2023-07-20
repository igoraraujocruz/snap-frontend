import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import { AdminHeader } from '../../../components/AdminHeader';
import { withSSRAuth } from '../../../utils/WithSSRAuth';
import GetUsers from './get';

const Users = () => {
  return (
    <>
      <Head>
        <title>Usuários | Snap</title>
      </Head>
      <Flex flexDir="column" justify="center" align="center">
        <AdminHeader />
        <Flex
          justify="center"
          flexDir={['column', 'column', 'column', 'column', 'row']}
        >
          <GetUsers />
        </Flex>
      </Flex>
    </>
  );
};

export default Users;

export const getServerSideProps = withSSRAuth(
  async ctx => {
    return {
      props: {},
    };
  },
  {
    permissions: [
      'Cadastrar Usuario',
      'Deletar Usuario',
      'Listar Usuario',
      'Editar Usuario',
    ],
  },
);
