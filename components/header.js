import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  HStack,
  Stack,
  IconButton,
  useBreakpointValue,
  useColorModeValue,
  Text,
} from '@chakra-ui/react'
import * as React from 'react'
import { FiMenu } from 'react-icons/fi'
import logo from '../public/logo.png'
import provideCertainty from '../public/we-provide-certainty.png'
import Image from 'next/image'
//   import { Logo } from './Logo'

export const Header = () => {
  const isDesktop = useBreakpointValue({
    base: false,
    lg: true,
  })
  return (
    <Box
      as="section"
      bg={'brand.900'}
    >
      <Box p={3} boxShadow={useColorModeValue('sm', 'sm-dark')}>
        <Stack spacing="10" justify="space-between" w="100%" direction={['column', 'row']} align='center'>
          {/* <Logo /> */}
          <Box>
            <Image src={logo} alt="Future Bridge" />
          </Box>
          <Box>
            <Image src={provideCertainty} alt="Future Bridge" />
          </Box>

        </Stack>
      </Box>
    </Box>
  )
}