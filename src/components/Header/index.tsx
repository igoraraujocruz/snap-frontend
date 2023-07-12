import {
  Box,
  Flex,
  HStack,
  Heading,
  Image,
  useMediaQuery,
} from '@chakra-ui/react';
import { GrInstagram } from 'react-icons/gr';
import { BsWhatsapp } from 'react-icons/bs';
import Link from 'next/link';

export function Header() {
  const [isNotLargerThan500] = useMediaQuery('(max-width: 500px)');
  return (
    <Flex
      as="header"
      w="100%"
      align="center"
      justify="center"
      h={['50px', '100px']}
      p="5rem"
    >
      <Box>
        <Flex alignItems="center">
          <Image
            mt="1rem"
            maxW={[225, 225, 255]}
            src="../snapLogo3.svg"
            sizes="10rem"
            alt="Snap Logo"
          />
        </Flex>
        <HStack
          align="center"
          spacing={5}
          mt="-2rem"
          mb="2rem"
          justify="center"
        >
          <Link
            href="https://www.instagram.com/snapboardshop"
            rel="noopener noreferrer"
            target="_blank"
          >
            <Flex cursor="pointer" bg="#fff" borderRadius="1rem">
              <GrInstagram color="black" size={isNotLargerThan500 ? 28 : 35} />
            </Flex>
          </Link>
          <Link href="/">
            <Flex cursor="pointer" bg="#fff" borderRadius="2rem">
              <BsWhatsapp color="#000" size={isNotLargerThan500 ? 28 : 35} />
            </Flex>
          </Link>
        </HStack>
      </Box>
    </Flex>
  );
}
