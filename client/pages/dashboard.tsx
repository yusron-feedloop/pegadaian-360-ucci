import LayoutDashboard from "../components/LayoutDashboard"

import {
    Flex,
    Stack,
    Link,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
import { navLinkitems } from "../libs/passion";
  
  export default function Page() {
    return (
      <Flex
        minH={'100vh'}
        align={'center'}
        justify={'center'}
        bg={useColorModeValue('gray.50', 'gray.800')}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
          <Stack align={'center'}>
            <Heading fontSize={'4xl'}>This is dashboard page</Heading>
            <Text fontSize={'lg'} color={'gray.600'}>
              to enjoy all of our cool <Link color={'blue.400'} href="/login">try Login</Link> ✌️
            </Text>
          </Stack>
          
        </Stack>
      </Flex>
    );
  }

Page.getLayout = function getLayout(page) {
    return (
      <LayoutDashboard linkItems={navLinkitems}>
        {page}
    </LayoutDashboard>
    )
}