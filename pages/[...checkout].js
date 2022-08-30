import { useEffect, useState } from "react";
import {
    Box,
    VStack,
    HStack,
    Center,
    Heading,
    Spinner,
    FormControl,
    FormLabel,
    Input,
    FormHelperText,
    Select,
    Flex,
    Spacer,
    Container,
    Button,
    Textarea,
    Radio,
    RadioGroup,
    IconButton,
    Text,
    Image,
    Stack,
    Alert,
    AlertIcon,
    AlertTitle,
    AlertDescription,
    Divider
} from "@chakra-ui/react"
import {
    DeleteIcon
} from "@chakra-ui/icons"
import { COUNTRIES, EU_COUNTRIES } from "../utils/countries";


export default function Checkout(props) {
    console.log('props', props)
    const [pack] = JSON.parse(props.package);
    const site = JSON.parse(props.site);
    const logo = JSON.parse(props.logo)
    const url = props.url;
    const [isEuCountry, setEuCountry] = useState(false);
    const [fromOtherSource, setOtherSource] = useState("")
    const [participants, setParticipants] = useState([]);
    const [isReview, setReview] = useState(false);
    const [order, setOrder] = useState({});
    // const [ discountError, setDiscountError ] = useState(false)
    const [discountDetails, setDiscount] = useState({})
    const [formErrors, setFormErrors] = useState([])
    const [ isLoading, setIsLoading ] = useState(false)

    // useEffect(() => {
    //     console.log(pack)
    // }, [])

    const handleChange = (e) => {
        console.log(e.target)
        if (e.target.id == "country") {
            if (EU_COUNTRIES.indexOf(e.target.value) > -1) {
                setEuCountry(true)
            } else {
                setEuCountry(false)
            }
        }

        // if (e.target.id == "other_source") {
        //     setOtherSource(e.target.value);
        // }

    }

    useEffect(() => {
        console.log('end', participants)
    }, [participants])

    useEffect(() => {
        console.log('Order', order)
    }, [order])


    const addParticipant = () => {
        console.log('begin', participants)
        let _participants = [...participants];
        let person = {}
        personFields.forEach((el) => {
            person[el.name] = document.getElementById(el.name).value;
        })
        console.log(person)
        _participants.push(person)
        setParticipants(_participants)
        personFields.forEach((el) => {
            document.getElementById(el.name).value = "";
        })
    }

    const removeParticipant = (e) => {
        console.log(e.target.id)
        let _participants = participants.filter((el) => {
            if (el.email != e.target.id) {
                return el
            }
        })
        console.log(_participants)
        setParticipants(_participants)
    }

    const validateForm = () => {
        let fields = [...invoiceDetailsFields, ...personFields];
        let _fields = []
        document.querySelectorAll('[required]').forEach(node => {
            if (node.value.length < 1) {
                console.log(node.id)
                let entry = fields.find(field => field.name == node.id.replace('primary_contact_', ''));
                _fields.push(entry)
                console.log(`Field ${entry.label} is required`)
            }
        })
        console.log(_fields)
        setFormErrors(_fields)
        return !Boolean(_fields.length)
    }

    const makeOrder = () => {

        const formIsValid = validateForm();
        if (!formIsValid) return

        let details = {}
        invoiceDetailsFields.forEach(el => {
            if(el.name == 'vat'){
                details[el.name] = isEuCountry && document.getElementById(el.name).value || "";
            } else {
            details[el.name] = document.getElementById(el.name).value;
            }
        })

        personFields.forEach(el => {
            details[el.name] = document.getElementById(`primary_contact_${el.name}`).value
        })
        details.participants = participants


        details.total = (participants.length + 1) * Number(pack.discounted_price);
        details.purchased_package_name = pack.title.rendered;
        details.purchased_package_slug = pack.slug;
        details.price = pack.price;
        details.notes = document.getElementById('notes').value;
        details.source = fromOtherSource;
        details.other_source = document.getElementById('other_source').value;
        details.discounted_price = pack.discounted_price;

        setOrder({
            details,
            url
        })
        setReview(true)
    }

    const processOrder = async () => {
        setIsLoading(true)
        const res = await fetch('/api/process-order', {
            method: 'POST',
            body: JSON.stringify(order)
        })
        console.log(res)
        if(res.ok){
            const response = await res.json();
            console.log(response)
            window.open(response.DirectLinkIs)
            
        }
        
        setIsLoading(false)
    }

    const verifyDiscountCode = async () => {
        console.log("verifying code", document.getElementById('discount_code').value);
        const discountCode = document.getElementById('discount_code').value.toLowerCase();
        const discount = await fetch(`https://${url}/wp-json/wp/v2/discount_code?slug=${discountCode}&_fields=discount_percent`)
        const discountDetails = await discount.json()
        let _order = { ...order }
        if (discountDetails.length > 0) {
            setDiscount(true)
            _order.details.discount_code = document.getElementById('discount_code').value;
            _order.details.total = _order.details.total - (_order.details.total * (Number(discountDetails[0].discount_percent) / 100))
            setDiscount({
                discount_code: discountCode,
                isValid: true
            })
            setOrder(_order)
            document.getElementById('discount_code').value = "";
            return
        }
        Reflect.deleteProperty(_order.details, 'discount_code')
        setDiscount({
            discount_code: discountCode,
            isValid: false
        })
        setOrder(_order)

    }

    const removeDiscountCode = () => {
        setDiscount({})
        let _order = { ...order }
        _order.details.total = (participants.length + 1) * Number(pack.discounted_price);
        setOrder(_order)
    }

    const invoiceDetailsFields = [
        { label: "Official Company Name", name: "official_company_name", type: "text", mandatory: true },
        { label: "Country", name: "country", type: "select", mandatory: true },
        { label: "Billing Address", name: "billing_address", type: "text", mandatory: true },
        { label: "Company Registration Number", name: "company_registration_number", type: "text", mandatory: true },
        { label: "VAT Registration Number", name: "vat" },
        { label: "Phone Number", name: "phone_number", type: "text", mandatory: true }
    ]

    const personFields = [
        { label: "First Name", name: "first_name", mandatory: true },
        { label: "Last Name", name: "last_name", mandatory: true },
        { label: "Position", name: "position", mandatory: true },
        { label: "Email", name: "email", mandatory: true }
    ]
    return (
        <Center>
            <Box w="60%">
                <VStack pb={10}>
                    <Box>
                        <Center>
                            <Image src={logo.source_url} alt={site.name} maxWidth={["100%","50%"]} bgColor={'brand.900'}/>
                        </Center>
                    </Box>
                    <Center><Text fontSize='3xl'>Selected package: {pack.title.rendered}</Text></Center>
                    <Center><Text fontSize='3xl'>Price: {pack.discounted_price} €</Text></Center>
                </VStack>
                <VStack align="left" w="100%">
                    <Heading>Billing details</Heading>
                    {
                        invoiceDetailsFields.map((field, i) => {
                            if (field.type == 'text') {
                                return (
                                    <FormControl key={i} isRequired={field.mandatory}>
                                        <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                                        <Input id={field.name} type='text' />
                                    </FormControl>
                                )
                            }

                            if (field.type == 'select') {
                                return (
                                    <FormControl key={i} isRequired={field.mandatory}>
                                        <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                                        <Select onChange={handleChange} id={field.name}>
                                            {
                                                COUNTRIES.map((country, i) => {
                                                    return (
                                                        <option key={i} value={country}>{country}</option>
                                                    )
                                                })
                                            }
                                        </Select>
                                    </FormControl>
                                )
                            }
                        })
                    }
                    {
                        isEuCountry ?
                            <FormControl isRequired={true}>
                                <FormLabel htmlFor="vat">VAT Registration Number (EU)</FormLabel>
                                <Input id='vat' type='text' />
                            </FormControl>
                            :
                            ""
                    }

                </VStack>
                <VStack pt={10} align="left" w="100%">
                    <Heading>Primary Contact</Heading>
                    {/* <Flex minWidth='100%' direction={['column', 'row']} > */}
                    {/* <VStack> */}
                    {
                        personFields.map((field, i) => {
                            return (
                                <>
                                        <FormControl key={i} isRequired={field.mandatory}>
                                            <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                                            <Input id={`primary_contact_${field.name}`} type='text' />
                                        </FormControl>
                                    {
                                        i + 1 < personFields.length ? <Spacer /> : ""
                                    }
                                </>
                            )
                        })
                    }
                    {/* </Flex> */}
                    {/* </VStack> */}
                </VStack>
                <Flex flexDirection={['column', 'row']} pt={10}>
                    <VStack align="left" w="50%">
                        <Heading>Participants</Heading>
                        {
                            personFields.map((field, i) => {
                                return (
                                    <>
                                        <Container key={i} p={0}>
                                            <FormControl>
                                                <FormLabel htmlFor={field.name}>{field.label}</FormLabel>
                                                <Input id={field.name} type='text' />
                                            </FormControl>
                                        </Container>
                                        {
                                            i + 1 < personFields.length ? <Spacer /> : ""
                                        }
                                    </>
                                )
                            })
                        }
                        <Container pl={0}>
                            <Button size="md" onClick={addParticipant}>Add Participant</Button>
                        </Container>
                    </VStack>
                    <VStack>
                        {/* <Heading>Test</Heading> */}
                        {
                            participants.map((el, i) => {
                                return (
                                    <Container key={i}>
                                        <HStack>
                                            <IconButton
                                                colorScheme='blue'
                                                aria-label='Delete Participants'
                                                icon={<DeleteIcon />}
                                                id={el.email}
                                                onClick={removeParticipant}
                                            />
                                            <Text>{el.first_name} {el.last_name} - {el.position} - {el.email}</Text>
                                        </HStack>
                                    </Container>
                                )
                            })
                        }
                    </VStack>
                </Flex>
                <VStack pt={10} align="left" w="100%">
                    <Heading>Notes</Heading>
                    <Textarea id="notes"/>
                </VStack>
                <VStack pt={10} align="left" w="100%">
                    <Heading>How did you hear about the event</Heading>
                    <RadioGroup id="other_source" onChange={setOtherSource}>
                        <VStack direction='row' align="left">
                            <Radio value='email'>Email</Radio>
                            <Radio value='colleague'>Colleague</Radio>
                            <Radio value='social-media'>Social Media</Radio>
                            <Radio value='other'>Other (please specify)</Radio>
                        </VStack>
                    </RadioGroup>
                    {
                        fromOtherSource == "other" ?
                            <FormControl>
                                <Input id='other_source' type='text' />
                            </FormControl>
                            :
                            ""
                    }
                </VStack>
                <Center pt={4}>
                    <VStack>
                        <Button onClick={makeOrder}>Review and submit</Button>
                        {
                            formErrors.length > 0 ?
                                <Alert status='error' flexDirection='column'>
                                    <AlertIcon />
                                    <AlertTitle>The following mandatory fields are not filled:</AlertTitle>
                                    <AlertDescription>
                                        {
                                            formErrors.map((error, i) => {
                                                return (
                                                    <Text as="span" key={i} pr={3}>
                                                        {error.label}, 
                                                    </Text>
                                                )

                                            })
                                        }
                                    </AlertDescription>
                                </Alert>
                                :
                                <></>
                        }
                    </VStack>
                </Center>
                {
                    isReview ?
                        <>
                            <VStack align={'left'}>
                                <Heading>Order Summary</Heading>
                                <Text>Event: {site.name}</Text>
                                <Text>Package: {pack.title.rendered}</Text>
                                <Divider />
                                <Text as="b">Primary Contact</Text>
                                <Text>{order.details.first_name} {order.details.last_name}</Text>
                                <Text>{order.details.email}</Text>
                                <Text as="b">Company</Text>
                                <Text>{order.details.official_company_name} - {order.details.billing_address} - {order.details.country} - {order.details.company_registration_number}</Text>
                                <Text as="b">Participants (other than the Primary Contact)</Text>
                                {
                                    participants.length == 0 ? <Text>No people added.</Text> : <></>
                                }
                                <>{
                                    participants.map((p, i) => {
                                        return (
                                            <Text key={i}>{p.first_name} {p.last_name} - {p.email}</Text>
                                        )
                                    })
                                }</>
                                <Divider />
                                <Text as="b">Notes</Text>
                                <Text>{order.details.notes}</Text>
                                <Divider />
                                <FormControl w={['100%', '50%']}>
                                    <FormLabel htmlFor="discount_code">Discount Code</FormLabel>
                                    <Input id="discount_code" type='text' />
                                </FormControl>
                                {
                                    Reflect.has(discountDetails, 'discount_code') && !discountDetails.isValid ?
                                        <Text color={"red"}>Discount code {discountDetails.discount_code} could not be verified. Check for any typo and try again</Text>
                                        :
                                        <></>
                                }
                                {
                                    Reflect.has(discountDetails, 'discount_code') && discountDetails.isValid ?
                                        <Text color={"green"}>Discount code <b>{discountDetails.discount_code}</b> applied.</Text>
                                        :
                                        <></>
                                }
                                <Container p={0}>
                                    {
                                        Reflect.has(discountDetails, 'discount_code') && discountDetails.isValid ?
                                            <Button onClick={removeDiscountCode}>Remove Code</Button>
                                            :
                                            <Button onClick={verifyDiscountCode}>Apply discount</Button>
                                    }
                                </Container>
                            </VStack>

                            <Center>
                                <VStack>
                                    <Text as="b">Total to pay: {Number(order.details.total).toFixed(2)} €</Text>
                                    <Button onClick={processOrder} isLoading={isLoading} loadingText='Submitting'>Submit</Button>
                                </VStack>
                            </Center>
                        </>
                        :
                        <></>
                }
            </Box >
        </Center >
    )
}

export async function getServerSideProps({ req }) {

    const [, url, _package] = req.url.split("/");
    console.log('Host: ', url);
    console.log('Package: ', _package)

    const site = await fetch(`https://${url}/wp-json/?_fields=name,description`);

    const siteDetails = await site.json();

    const logo = await fetch(`${siteDetails._links["wp:featuredmedia"][0].href}?_fields=source_url`);

    const logoUrl = await logo.json();

    const data = await fetch(`https://${url}/wp-json/wp/v2/package/?slug=${_package}`)

    const packageDetails = await data.json()

    console.log('details :', packageDetails)

    return {
        props: {
            url: url,
            site: JSON.stringify(siteDetails),
            logo: JSON.stringify(logoUrl),
            package: JSON.stringify(packageDetails)
        }, // will be passed to the page component as props
    }
}