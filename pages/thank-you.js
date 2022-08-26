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
            <Heading id="confetti">Thank you for your purchase!</Heading>
            <Text fontSize='xl'> We have sent you a recap email!</Text>
            <Text fontSize='sm'>TIP! Check the spam folder if you cannot find it in your inbox!!</Text>
            </VStack>
        </Center>
    )
}