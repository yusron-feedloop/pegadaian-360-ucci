import '../styles/globals.css'
import { ChakraProvider } from '@chakra-ui/react'
import AuthProvider from '../components/AuthProvider'
import AppProvider from '../components/AppProvider'

function MyApp({ Component, pageProps }) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)

    return (
        <ChakraProvider>
            <AuthProvider>
                <AppProvider>
                    {getLayout(<Component {...pageProps} />)}
                </AppProvider>
            </AuthProvider>
        </ChakraProvider>
    )
}

export default MyApp
