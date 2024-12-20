import React, { ReactNode, useContext, useState } from 'react';
import {
    IconButton,
    Avatar,
    Box,
    CloseButton,
    Flex,
    HStack,
    VStack,
    Icon,
    useColorModeValue,
    Drawer,
    DrawerContent,
    Text,
    useDisclosure,
    BoxProps,
    FlexProps,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    InputGroup,
    Input,
    InputRightElement,
    Spinner
} from '@chakra-ui/react';
import Link from 'next/link'
import Image from 'next/image'
import {
    FiMenu,
    FiBell,
    FiChevronDown,
    FiSearch
} from 'react-icons/fi';
import { IconType } from 'react-icons';
import { ReactText } from 'react';
import {useUser} from '../libs/user';
import { useRouter } from 'next/router';
import { AuthContext } from '../libs/auth';
import { AppContext } from '../libs/app';
import { searchAudience, searchAudienceByProp } from '../libs/passion';
import SearchAutoComplete from './SearchAutoComplete'

export interface LinkItemProps {
    name: string;
    icon: IconType;
    href: string;
}

export default function LayoutDashboard({
    children,
    linkItems,
    hideSidebar
}: {
    children: ReactNode
    linkItems?: LinkItemProps[],
    hideSidebar?: boolean
}) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    return (
        <Box minH="100vh" bg={useColorModeValue('gray.100', 'gray.900')}>
            {hideSidebar != true &&
            <>
                <SidebarContent
                    linkItems={linkItems}
                    onClose={() => onClose}
                    display={{ base: 'none', md: 'block' }}
                />
                <Drawer
                    autoFocus={false}
                    isOpen={isOpen}
                    placement="left"
                    onClose={onClose}
                    returnFocusOnClose={false}
                    onOverlayClick={onClose}
                    size="full">
                    <DrawerContent>
                        <SidebarContent onClose={onClose} linkItems={linkItems} />
                    </DrawerContent>
                </Drawer>
            </>
            }
            {/* mobilenav */}
            <MobileNav onOpen={onOpen} hideSidebar={hideSidebar}/>
            <Box ml={{ base: 0, md: hideSidebar ? 0:60 }} p="4">
                {children}
            </Box>
        </Box>
    );
}

interface SidebarProps extends BoxProps {
    linkItems: LinkItemProps[]
    onClose: () => void;
}

const SidebarContent = ({ onClose, linkItems, ...rest }: SidebarProps) => {
    return (
        <Box
            transition="3s ease"
            bg={useColorModeValue('white', 'gray.900')}
            borderRight="1px"
            borderRightColor={useColorModeValue('gray.200', 'gray.700')}
            w={{ base: 'full', md: 60 }}
            pos="fixed"
            h="full"
            {...rest}>
            <Flex h="20" alignItems="center" mx="8" mb="5" justifyContent="space-between">
                <Text fontSize="2xl" fontFamily="monospace" fontWeight="bold">
                    <br/>
                    <Image src="/logo.png" width="160" height="82" />
        </Text>
                <CloseButton display={{ base: 'flex', md: 'none' }} onClick={onClose} />
            </Flex>
            {linkItems.map((link) => (
                <NavItem key={link.name} icon={link.icon} href={link.href} >
                    {link.name}
                </NavItem>
            ))}
        </Box>
    );
};

interface NavItemProps extends FlexProps {
    icon: IconType;
    children: ReactText;
    href: string
}
const NavItem = ({ icon, children, href, ...rest }: NavItemProps) => {
    const router = useRouter()
    return (
        <Link href={href}>
            <Flex
                align="center"
                p="4"
                mx="4"
                borderRadius="lg"
                role="group"
                cursor="pointer"
                bgColor={router.pathname === href ? 'cyan.600' : ''}
                color={router.pathname === href ? 'white': 'inherit'}
                textDecoration={'none'}
                _focus={{ boxShadow: 'none' }}
                _hover={{
                    bg: 'cyan.500',
                    color: 'white',
                }}
                {...rest}>
                {icon && (
                    <Icon
                        mr="4"
                        fontSize="16"
                        _groupHover={{
                            color: 'white',
                        }}
                        as={icon}
                    />
                )}
                {children}
            </Flex>
        </Link>
    );
};

interface MobileProps extends FlexProps {
    onOpen: () => void;
    hideSidebar: boolean
}
const MobileNav = ({ onOpen, hideSidebar, ...rest }: MobileProps) => {
    const router = useRouter()
    const {user} = useUser()

    const [nik, setNik] = useState('');
    const [phone, setPhone] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const { setPassionData } = React.useContext(AppContext);
    const Swal = require('sweetalert2');
    const {signOut} = useContext(AuthContext)

    function handleClickSignOut() {
        signOut()
    }

    const formatAndSetPhone = (phoneNumber) => {
        console.log(phoneNumber);
        phoneNumber = phoneNumber.replace(/^\+62/, '0').replace(/[^0-9]/g, '');
        setPhone(phoneNumber);
    }

    const handleFormSubmit = (e) => {
        e.preventDefault();

        if(phone.length == 0 && nik.length == 0 && name.length == 0){
            return;
        }

        setLoading(true);

        if (nik.length > 0) {
            getAudienceDetail(nik);
        } else if (phone.length > 0) {
            searchAudienceByProp('phone', phone)
                .then(response => {
                    if (response.hasOwnProperty('error')) {
                        Swal.fire({
                            title: "Not found",
                            text: "Nasabah tidak ditemukan",
                            icon: "error"
                        });

                        setLoading(false);
                    } else {
                        if (response.audiences.length > 0) {
                            getAudienceDetail(response.audiences[0].identifier);
                        }
                    }
                });
        } else if (name.length > 0) {
            searchAudienceByProp('name', name)
                .then(response => {
                    if (response.hasOwnProperty('error')) {
                        Swal.fire({
                            title: "Not found",
                            text: "Nasabah tidak ditemukan",
                            icon: "error"
                        });

                        setLoading(false);
                    } else {
                        if (response.audiences.length > 0) {
                            getAudienceDetail(response.audiences[0].identifier);
                        }
                    }
                });
        }
    }

    const getAudienceDetail = (_nik) => {
        searchAudience(_nik)
            .then(response => {
                setLoading(false);

                if (response.hasOwnProperty('error')) {
                    Swal.fire({
                        title: "Not found",
                        text: "Nasabah tidak ditemukan",
                        icon: "error"
                    });
                } else {
                    setPassionData(response);
                    router.push(window.location.pathname);
                }
            });
    }
    
    return (
        <Flex
            ml={{ base: 0, md: hideSidebar ? 0:60 }}
            px={{ base: 4, md: 4 }}
            height="20"
            alignItems="center"
            bg={useColorModeValue('white', 'gray.900')}
            borderBottomWidth="1px"
            borderBottomColor={useColorModeValue('gray.200', 'gray.700')}
            justifyContent={{ base: 'space-between', md: 'flex-end' }}
            {...rest}>
            <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onOpen}
                variant="outline"
                aria-label="open menu"
                icon={<FiMenu />}
            />

            <Text
                display={{ base: 'flex', md: 'none' }}
                fontSize="2xl"
                fontFamily="monospace"
                fontWeight="bold">
                Logo
            </Text>

            <form onSubmit={handleFormSubmit}>
                {loading &&
                <div style={{float:'left', marginRight: 10, marginTop: 10}}>
                    <Spinner />
                </div>
                }
                <HStack display={hideSidebar ? 'none':'flex'}>
                    <InputGroup>
                        <Input type="text" placeholder="Cari NIK" onChange={e => setNik(e.target.value)} />
                        <InputRightElement>
                            <FiSearch />
                        </InputRightElement>
                    </InputGroup>
                    <InputGroup>
                        <Input type="text"
                            placeholder="Cari No. HP"
                            value={phone}
                            onChange={e => formatAndSetPhone(e.target.value)} />
                        <InputRightElement>
                            <FiSearch />
                        </InputRightElement>
                    </InputGroup>
                    <InputGroup>
                        {/* <Input type="text" placeholder="Cari Nama Lengkap" onChange={e => setName(e.target.value)} /> */}
                        <SearchAutoComplete onSelectResult={(id) => { setLoading(true); getAudienceDetail(id) }} onEnter={(id) => { setLoading(true); getAudienceDetail(id) }} />
                        <InputRightElement>
                            <FiSearch />
                        </InputRightElement>
                    </InputGroup>
                    <button type="submit" style={{display:'none'}}>
                        <Text>Cari</Text>
                    </button>
                </HStack>
            </form>

            <HStack spacing={{ base: '0', md: '6' }}>

                <IconButton
                    size="lg"
                    variant="ghost"
                    aria-label="open menu"
                    icon={<FiBell />}
                />
                <Flex alignItems={'center'}>
                    <Menu>
                        <MenuButton
                            py={2}
                            transition="all 0.3s"
                            _focus={{ boxShadow: 'none' }}>
                            <HStack>
                                <Avatar
                                    size={'sm'}
                                    src={
                                        'https://images.unsplash.com/photo-1619946794135-5bc917a27793?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9'
                                    }
                                />
                                <VStack
                                    display={{ base: 'none', md: 'flex' }}
                                    alignItems="flex-start"
                                    spacing="1px"
                                    ml="2">
                                    <Text fontSize="sm">{user?.email}</Text>
                                    <Text fontSize="xs" color="gray.600">
                                        {user?.role?.displayField}
                                    </Text>
                                </VStack>
                                <Box display={{ base: 'none', md: 'flex' }}>
                                    <FiChevronDown />
                                </Box>
                            </HStack>
                        </MenuButton>
                        <MenuList
                            bg={useColorModeValue('white', 'gray.900')}
                            borderColor={useColorModeValue('gray.200', 'gray.700')}>
                            {/* <MenuItem>Profile</MenuItem>
                            <MenuDivider /> */}
                            <MenuItem onClick={handleClickSignOut}>Sign out</MenuItem>
                        </MenuList>
                    </Menu>
                </Flex>
            </HStack>
        </Flex>
    );
};
