import '../styles/globals.css'
import {
  ChakraProvider,
  Container,
  Stack,
  ButtonGroup,
  Text,
  IconButton, extendTheme, Center
} from '@chakra-ui/react'
import "@fontsource/montserrat";
import { Header } from '../components/header'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const theme = extendTheme({
  colors: {
    brand: {
      900: "#14B4A1"
    },
  },
  fonts: {
    body: 'Montserrat',
    heading: 'Montserrat'
  },
  components: {
    Input: {
      defaultProps: {
        variant: "flushed"
      }
    },
    Select: {
      defaultProps: {
        variant: "flushed"
      }
    }
  }
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <Header />
      <Component {...pageProps} />
      <Container
        as="footer"
        role="contentinfo"
        py={{
          base: '12',
          md: '16',
        }}
        w="100%"
      >
        <Center>
          <Text fontSize="sm" color="subtle">
            &copy; {new Date().getFullYear()} Future Bridge s.r.o. - All rights reserved.
          </Text>
        </Center>
      </Container>
    </ChakraProvider>
  )
}

export default MyApp
