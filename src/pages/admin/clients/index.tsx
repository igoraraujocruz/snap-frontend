import { Box, Button, Flex } from '@chakra-ui/react';
import Head from 'next/head';
import { useRef } from 'react';
import { AdminHeader } from '../../../components/AdminHeader';
import { Can } from '../../../components/Can';
import { withSSRAuth } from '../../../utils/WithSSRAuth';

import GetClients from './get';
import { useClients } from '../../../services/hooks/useClients';

const Clients = () => {
  const { data } = useClients();
  const clientsCreatedAt = [];
  const count = [];
  const week = [];

  function dates(current: Date) {
    current.setDate(current.getDate() - current.getDay() + 1);
    for (let i = 0; i < 7; i++) {
      week.push(
        new Date(current).toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        }),
      );
      current.setDate(current.getDate() + 1);
    }
    return week;
  }

  dates(new Date());

  data?.clients.map(client =>
    clientsCreatedAt.push(
      new Date(client.createdAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }),
    ),
  );

  const chartFilter = clientsCreatedAt.filter(element =>
    week.includes(element),
  );

  chartFilter.forEach(element => {
    count[element] = (count[element] || 0) + 1;
  });

  return (
    <>
      <Head>
        <title>Clientes | Snap</title>
      </Head>
      <Box>
        <AdminHeader />
        {/* <Can permissions={['Listar Cliente']}>
          <Chart options={options} series={series} type="line" height={162} />
        </Can> */}

        <Flex
          justify="center"
          flexDir={['column', 'column', 'column', 'column', 'row']}
          w="100%"
        >
          <GetClients />
        </Flex>
      </Box>
    </>
  );
};

export default Clients;

export const getServerSideProps = withSSRAuth(
  async () => {
    return {
      props: {},
    };
  },
  {
    permissions: [
      'Cadastrar Cliente',
      'Deletar Cliente',
      'Editar Cliente',
      'Listar Cliente',
    ],
  },
);
