import { Box, Flex, HStack, Text, useMediaQuery } from '@chakra-ui/react';
import { RiMapPin2Fill } from 'react-icons/ri';

export function Footer() {
  const [isNotLargerThan500] = useMediaQuery('(max-width: 500px)');
  return (
    <Box>
      <Flex flexDir="column" alignItems="center">
        <Flex
          mt="0.2rem"
          fontSize={['0.9rem', '0.9rem', '1rem']}
          flexDir="column"
          align="flex-start"
        >
          <HStack>
            <RiMapPin2Fill color="#000" size={isNotLargerThan500 ? 28 : 35} />
            <Text color="#000" fontFamily="Arial">
              Shopping Mestre Álvaro - 2º piso - Av. João Palácio, 300 - Eurico
              Salles, Serra - ES, 29160-161
            </Text>
          </HStack>
        </Flex>
      </Flex>
    </Box>
  );
}
