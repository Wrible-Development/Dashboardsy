// CHOC UI

import {
    Avatar,
    Box,
    Drawer,
    DrawerContent,
    DrawerOverlay,
    Flex,
    Icon,
    IconButton,
    Input,
    Text,
    Select,
    useColorModeValue,
    useDisclosure,
    SimpleGrid,
    Image,
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    NumberInput,
    NumberInputField,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    FormControl,
    FormLabel,
    Button,
    Collapse,
    Divider
} from "@chakra-ui/react";
import { FaMemory } from "react-icons/fa";
import { BsFillCpuFill } from "react-icons/bs";
import { FiMenu, FiServer } from "react-icons/fi";
import { MdKeyboardArrowRight, MdOutlineShoppingCart, MdOutlineLeaderboard } from "react-icons/md";
import { RiUDiskFill, RiLockPasswordLine } from 'react-icons/ri'
import { GoServer } from 'react-icons/go'
import { IoHomeOutline, IoLogOutOutline, IoGameControllerOutline } from 'react-icons/io5'
import { HiOutlineUser } from 'react-icons/hi'
import React from "react";
import config from '../config.json'
import GoogleAd from './GoogleAd';


export default function Swibc(prps) {
    const sidebar = useDisclosure();
    let sname, mem, cpu, disk, egg, loc;
    const integrations = useDisclosure();
    const { username, avatar, children, createServerFunc, buyItemFunc, regenPass, uinfo, notify, coinsleaderboard } = prps;
    const { isOpen: isOpenCS, onOpen: onOpenCS, onClose: onCloseCS } = useDisclosure()
    const finalRefCS = React.useRef()
    const handleChangeServerName = (event) => sname = event.target.value
    const handleChangeMem = (event) => mem = event
    const handleChangeDisk = (event) => disk = event
    const handleChangeCpu = (event) => cpu = event
    const handleChangeEgg = (event) => egg = event.target.value
    const handleChangeLoc = (event) => loc = event.target.value
    function openPanel() {
        window.open(
            'https://' + config.panel_url,
            '_blank'
        );
    }
    const [isOpenAlertCoinsLeaderboard, setIsOpenAlertCoinsLeaderboard] = React.useState(false)
    const onAlertCoinsLeaderboard = () => {
        setIsOpenAlertCoinsLeaderboard(false)
    }
    const cancelRefAlertCoinsLeaderboard = React.useRef()

    const [isOpenAlertCpu, setIsOpenAlertCpu] = React.useState(false)
    const onCloseAlertCpu = () => {
        buyItemFunc("no", "cpu", 1)
        setIsOpenAlertCpu(false)
    }
    const cancelRefAlertCpu = React.useRef()

    const [isOpenAlertCredentials, setIsOpenAlertCredentials] = React.useState(false)
    const onCloseAlertCredentials = () => {
        openPanel()
        setIsOpenAlertCredentials(false)
    }
    const cancelRefAlertCredentials = React.useRef()

    const [isOpenAlertMem, setIsOpenAlertMem] = React.useState(false)
    const onCloseAlertMem = () => {
        buyItemFunc("no", "memory", 1)
        setIsOpenAlertMem(false)
    }
    const cancelRefAlertMem = React.useRef()

    const [isOpenAlertDisk, setIsOpenAlertDisk] = React.useState(false)
    const onCloseAlertDisk = () => {
        buyItemFunc("no", "disk", 1)
        setIsOpenAlertDisk(false)
    }
    const cancelRefAlertDisk = React.useRef()

    const [isOpenAlertServersExtra, setIsOpenAlertServersExtra] = React.useState(false)
    const onCloseAlertServersExtra = () => {
        buyItemFunc("no", "serverlimit", 1)
        setIsOpenAlertServersExtra(false)
    }
    const cancelRefAlertServersExtra = React.useRef()
    const NavItem = (props) => {
        const { icon, children, ...rest } = props;
        return (
            <Flex
                align="center"
                px="4"
                pl="4"
                py="3"
                cursor="pointer"
                color={useColorModeValue("inherit", "gray.400")}
                _hover={{
                    bg: useColorModeValue("gray.100", "gray.900"),
                    color: useColorModeValue("gray.900", "gray.200"),
                }}
                role="group"
                fontWeight="semibold"
                transition=".30s ease"
                {...rest}
            >
                {icon && (
                    <Icon
                        mx="2"
                        boxSize="5"
                        _groupHover={{
                            color: useColorModeValue("gray.600", "gray.300"),
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        );
    };

    const SidebarContent = (props) => (
        <Box
            as="nav"
            pos="fixed"
            top="0"
            left="0"
            zIndex="sticky"
            h="full"
            pb="10"
            overflowX="hidden"
            overflowY="auto"
            bg={useColorModeValue("white", "gray.800")}
            borderColor={useColorModeValue("inherit", "gray.700")}
            w="60"
            {...props}
        >
            <Flex px="4" py="5" align="center">
                <Image src="/favicon.png" borderRadius='full' boxSize="60px" />
                <Text
                    fontSize="2xl"
                    ml="2"
                    color={useColorModeValue("brand.500", "white")}
                    fontWeight="semibold"
                >
                    {config.hostname}
                </Text>
            </Flex>
            <Flex
                direction="column"
                as="nav"
                fontSize="sm"
                color="gray.600"
                aria-label="Main Navigation"
            >
                <NavItem icon={IoHomeOutline}>Home</NavItem>
                <NavItem icon={FiServer} onClick={onOpenCS}>Create Server</NavItem>
                <NavItem icon={MdOutlineShoppingCart} onClick={integrations.onToggle}>Shop
                    <Icon
                        as={MdKeyboardArrowRight}
                        ml="auto"
                        transform={integrations.isOpen && "rotate(90deg)"}
                    />
                </NavItem>
                <Collapse in={integrations.isOpen}>
                    <NavItem icon={BsFillCpuFill} pl="12" py="2" onClick={() => setIsOpenAlertCpu(true)}>
                        CPU
                    </NavItem>
                    <NavItem icon={FaMemory} pl="12" py="2" onClick={() => setIsOpenAlertMem(true)}>
                        Memory
                    </NavItem>
                    <NavItem icon={RiUDiskFill} pl="12" py="2" onClick={() => setIsOpenAlertDisk(true)}>
                        Disk
                    </NavItem>
                    <NavItem icon={GoServer} pl="12" py="2" onClick={() => setIsOpenAlertServersExtra(true)}>
                        Extra Servers
                    </NavItem>
                </Collapse>
                <NavItem icon={RiLockPasswordLine} onClick={() => regenPass()}>Regenerate Password</NavItem>
                <NavItem icon={MdOutlineLeaderboard} onClick={() => setIsOpenAlertCoinsLeaderboard(true)}>Coins Leaderboard</NavItem>
                <NavItem icon={HiOutlineUser} onClick={() => setIsOpenAlertCredentials(true)}>Credentials</NavItem>
                <NavItem icon={IoGameControllerOutline} onClick={openPanel}>Panel</NavItem>
                <NavItem w="100%" position="absolute" bottom={0} icon={IoLogOutOutline} onClick={() => window.location.href = "/api/auth/signout"} mb={5}>Sign Out</NavItem>
            </Flex>
            <AlertDialog isOpen={isOpenAlertCredentials} leastDestructiveRef={cancelRefAlertCredentials} onClose={() => setIsOpenAlertCredentials(false)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Panel Credentials
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            {config.earningmethods.mining.enabled && <Text fontSize='lg' fontWeight='bold'>Panel Credentials:</Text>}
                            <Text fontSize='lg'>
                                Username: {uinfo.userid}
                            </Text>
                            <Text fontSize='lg'>
                                Password: {"Please regenerate your password using the button on the sidebar."}
                            </Text>
                            {config.earningmethods.mining.enabled && <>
                                <Divider my={4} />
                                <Text fontSize='lg' fontWeight='bold'>
                                    Mining Credentials:
                                </Text>
                                <Text fontSize='lg' >
                                    Username: {uinfo.pterodactyluid}
                                </Text>
                                <Text fontSize='lg' >
                                    Address: {config.earningmethods.mining.nicehashAddress}
                                </Text>
                            </>}

                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRefAlertCpu} onClick={() => setIsOpenAlertCredentials(false)}>
                                Close
                            </Button>
                            <Button colorScheme='blue' onClick={onCloseAlertCredentials} ml={3}>
                                Panel
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

            <AlertDialog isOpen={isOpenAlertCpu} leastDestructiveRef={cancelRefAlertCpu} onClose={() => setIsOpenAlertCpu(false)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Buy Extra CPU
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure that you want to buy 100% CPU for {config.shop.prices.cpu} coins?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRefAlertCpu} onClick={() => setIsOpenAlertCpu(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={onCloseAlertCpu} ml={3}>
                                Buy
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <AlertDialog isOpen={isOpenAlertMem} leastDestructiveRef={cancelRefAlertMem} onClose={() => setIsOpenAlertMem(false)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Buy Extra Memory
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure that you want to buy 100 MB of Memory for {config.shop.prices.memory} coins?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRefAlertMem} onClick={() => setIsOpenAlertMem(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={onCloseAlertMem} ml={3}>
                                Buy
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <AlertDialog isOpen={isOpenAlertDisk} leastDestructiveRef={cancelRefAlertDisk} onClose={() => setIsOpenAlertDisk(false)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Buy Extra Disk
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure that you want to buy 100 MB of Disk for {config.shop.prices.disk} coins?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRefAlertCpu} onClick={() => setIsOpenAlertDisk(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={onCloseAlertDisk} ml={3}>
                                Buy
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <AlertDialog isOpen={isOpenAlertServersExtra} leastDestructiveRef={cancelRefAlertServersExtra} onClose={() => setIsOpenAlertServersExtra(false)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Buy Extra Server
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            Are you sure that you want to buy 1 Extra Server for {config.shop.prices.serverlimit} coins?
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRefAlertServersExtra} onClick={() => setIsOpenAlertServersExtra(false)}>
                                Cancel
                            </Button>
                            <Button colorScheme='blue' onClick={onCloseAlertServersExtra} ml={3}>
                                Buy
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>
            <Modal
                isCentered
                onClose={onCloseCS}
                isOpen={isOpenCS}
                motionPreset='slideInBottom'
            >
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>Create Server</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormControl isRequired >
                            <FormLabel htmlFor="servername">Name of the server:</FormLabel>
                            <Input placeholder='Server Name' size='md' name="servername" id="servername" onChange={handleChangeServerName} />
                        </FormControl>
                        <FormControl isRequired >
                            <FormLabel htmlFor="memoryinput">Amount of Memory:</FormLabel>
                            <NumberInput step={100} min={1} max={uinfo.unused.memory} id="memoryinput" onChange={handleChangeMem}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>

                        </FormControl>
                        <FormControl isRequired >
                            <FormLabel htmlFor="cpuinput">Amount of CPU:</FormLabel>
                            <NumberInput step={5} min={1} max={uinfo.unused.cpu} id="cpuinput" onChange={handleChangeCpu}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>

                        </FormControl>
                        <FormControl isRequired >
                            <FormLabel htmlFor="diskinput">Amount of Disk:</FormLabel>
                            <NumberInput step={100} min={1} max={uinfo.unused.disk} id="diskinput" onChange={handleChangeDisk}>
                                <NumberInputField />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>

                        </FormControl>
                        <FormControl isRequired >
                            <FormLabel htmlFor="egginput">Select the egg:</FormLabel>
                            <Select id="egginput" name="egginput" onChange={handleChangeEgg} placeholder="Select the egg">
                                {config.eggs.map(egg => <option value={egg.key} key={egg.key}>{egg.name}</option>)}
                            </Select>

                        </FormControl>
                        <FormControl isRequired >
                            <FormLabel htmlFor="locinput">Select the location:</FormLabel>
                            <Select id="locinput" name="locinput" onChange={handleChangeLoc} placeholder="Select the location">
                                {config.locations.map(location => <option key={location.key} value={location.key}>{location.name}</option>)}
                            </Select>

                        </FormControl>
                    </ModalBody>
                    <ModalFooter>
                        <Button mr={3} onClick={onCloseCS}>
                            Close
                        </Button>
                        <Button colorScheme='blue' onClick={async () => {
                            const isErrorSname = sname == '' || !sname
                            const isErrorMem = mem == '' || !mem
                            const isErrorDisk = disk == '' || !disk
                            const isErrorCpu = cpu == '' || !cpu
                            const isErrorEgg = egg == '' || !egg
                            const isErrorLoc = loc == '' || !loc
                            const isError = isErrorSname || isErrorMem || isErrorDisk || isErrorCpu || isErrorEgg || isErrorLoc
                            if (isError) {
                                return notify("Please fill all the fields correctly", true)
                            }
                            createServerFunc(sname, egg, loc, disk, mem, cpu)
                            onCloseCS()
                        }}>Create</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
            <AlertDialog isOpen={isOpenAlertCoinsLeaderboard} leastDestructiveRef={cancelRefAlertCoinsLeaderboard} onClose={() => setIsOpenAlertCoinsLeaderboard(false)}>
                <AlertDialogOverlay>
                    <AlertDialogContent>
                        <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                            Coins Leaderboard
                        </AlertDialogHeader>
                        <AlertDialogBody>
                            <Flex justifyContent='space-between' mx={10}>
                                <span>Position</span>
                                <span>User ID</span>
                                <span>Coins</span>
                            </Flex>
                            <Divider my={2} />
                            {coinsleaderboard && coinsleaderboard.length > 0 ? coinsleaderboard.map((user, index) => {
                                return (
                                    <Box key={index}>
                                        <Flex key={index} justifyContent='space-between' mx={10}>
                                            <span>#{index + 1}</span>
                                            <span>{user.uid}</span>
                                            <span>{user.coins}</span>
                                        </Flex>
                                        {coinsleaderboard.length - 1 != index ? <Divider my={2} /> : null}
                                    </Box>
                                )
                            }
                            ) : "No users yet"}
                        </AlertDialogBody>
                        <AlertDialogFooter>
                            <Button ref={cancelRefAlertMem} onClick={() => setIsOpenAlertCoinsLeaderboard(false)}>
                                Okay!
                            </Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialogOverlay>
            </AlertDialog>

        </Box>
    );
    return (
        <>
            <Box
                as="section"
                bg={useColorModeValue("gray.50", "gray.700")}
                minH="100vh"
            >
                <SidebarContent display={{ base: "none", md: "unset" }} />
                <Drawer
                    isOpen={sidebar.isOpen}
                    onClose={sidebar.onClose}
                    placement="left"
                >
                    <DrawerOverlay />
                    <DrawerContent>
                        <SidebarContent w="full" borderRight="none" />
                    </DrawerContent>
                </Drawer>
                <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
                    <Flex
                        as="header"
                        align="center"
                        justify="space-between"
                        w="full"
                        px="4"
                        bg={useColorModeValue("white", "gray.800")}
                        borderBottomWidth="1px"
                        borderColor={useColorModeValue("inherit", "gray.700")}
                        h="14"
                    >
                        <IconButton
                            aria-label="Menu"
                            display={{ base: "inline-flex" }}
                            visibility={{ base: "visible", md: "hidden" }}
                            onClick={sidebar.onOpen}
                            icon={<FiMenu />}
                            size="sm"
                        />

                        <Flex align="center">
                            <Text fontSize='md'>{uinfo.coins} Coins</Text>
                            <Avatar
                                ml="4"
                                size="sm"
                                name={username}
                                src={avatar}
                            />
                        </Flex>
                    </Flex>

                    <Box as="main" p="4" rounded="md" h="full">
                        {children}
                    </Box>
                    {config.ads.adsense.enabled && <GoogleAd />}
                </Box>
            </Box>
        </>
    );
}