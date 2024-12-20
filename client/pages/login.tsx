import {
    Flex,
    useColorModeValue,
  } from '@chakra-ui/react';
import AuthLoginForm from '../components/AuthLoginForm';
  
export default function Page() {

  return( 
    <Flex
      minH={'100vh'}
      align={'center'}
      justify={'center'}
      bg={useColorModeValue('gray.50', 'gray.800')}>
        <AuthLoginForm />
    </Flex>
  )
}
