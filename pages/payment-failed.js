import {
    Center,
    Heading,
    Text,
    VStack
} from '@chakra-ui/react'
import { useEffect } from 'react';

export default function ThankYou(){


    return (
        <Center minH='70vh'>
            <VStack>
            <Heading id="confetti">Oh snap! The payment failed!</Heading>
            <Text fontSize='xl'>Please try again or contact us at info@future-bridge.eu.</Text>
            </VStack>
        </Center>
    )
}