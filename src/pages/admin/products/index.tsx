import { Box, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import { AdminHeader } from '../../../components/AdminHeader';
import { Can } from '../../../components/Can';

import { withSSRAuth } from '../../../utils/WithSSRAuth';

import GetProducts from './get';

const Products = () => (
  <>
    <Head>
      <title>Produtos | Snap</title>
    </Head>
    <Flex flexDir="column" justify="center" align="center">
      <AdminHeader />
      <Flex
        justify="center"
        flexDir={['column', 'column', 'column', 'column', 'row']}
        w="100%"
      >
        <GetProducts />
      </Flex>
    </Flex>
  </>
);

export default Products;

export const getServerSideProps = withSSRAuth(
  async ctx => {
    return {
      props: {},
    };
  },
  {
    permissions: [
      'Cadastrar Produto',
      'Deletar Produto',
      'Listar Produto',
      'Editar Produto',
    ],
  },
);
