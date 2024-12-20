import {
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Button,
    Heading,
    Text,
    useColorModeValue,
  } from '@chakra-ui/react';
import { useContext, useState } from 'react';
import {useForm} from 'react-hook-form'
import { apiQore } from '../libs/api';
import { AuthContext } from '../libs/auth';
  

export default function AuthLoginForm() {
  const form = useForm({
    defaultValues: { id: "", password: "" },
  });
  
  const {signIn} = useContext(AuthContext)
  const [loading, setLoading] = useState(false)
  const [errMessage, setErrMessage] = useState('')

  async function handleFormSubmit(val) {
    setErrMessage('')
    setLoading(true)
    try {
      const response = await apiQore.post('/v1/authorize', {
        identifier: val.id,
        password: val.password
      })
  
      signIn(response.data.token)
    } catch (error) {
        setErrMessage("Mohon maaf username atau password yang Anda masukkan salah");

        const Swal = require('sweetalert2');
        Swal.fire({
            title: "Error",
            text: "Mohon maaf username atau password yang Anda masukkan salah",
            icon: "error"
        });
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(handleFormSubmit)}>
        <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
            <Box
            rounded={'lg'}
            bg={useColorModeValue('white', 'gray.700')}
            boxShadow={'lg'}
            p={8}>
            <Stack align={'center'}>
                <Heading fontSize={'4xl'}>Informasi C360</Heading>
                <Text fontSize={'md'} color={'gray.600'}>
                Silakan masukkan informasi berikut untuk melihat informasi C360
                </Text>
            </Stack>

                <Stack spacing={4} marginTop="6">
                <FormControl id="id">
                    <FormLabel>User ID</FormLabel>
                    <Input disabled={loading} type="email" {...form.register('id', {required: true})} />
                    { form.formState.errors.id && <Text fontSize={'sm'} color={'red.300'}>User ID harus diisi</Text> }
                </FormControl>
                <FormControl id="password">
                    <FormLabel>Password</FormLabel>
                    <Input disabled={loading} type="password" {...form.register("password", { required: true })} />
                    { form.formState.errors.password && <Text fontSize={'sm'} color={'red.300'}>Password harus diisi</Text> }
                </FormControl>
                <Stack spacing={2}>
                    {/* errMessage && <Text align={'center'} fontSize={'sm'} fontWeight={'bold'} color={'red.300'}>{errMessage}</Text> */}
                    <Button
                    isLoading={loading}
                    type='submit'
                    bg={'cyan.600'}
                    color={'white'}
                    _hover={{
                        bg: 'cyan.700',
                    }}>
                    Sign in
                    </Button>
                </Stack>
                </Stack>
            </Box>
        </Stack>
    </form>
  );
}
