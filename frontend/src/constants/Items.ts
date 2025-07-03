import { MdArchive } from "react-icons/md";
import {
    IoHomeOutline, IoFlameOutline, IoDocumentTextOutline, IoBookmarkOutline, IoSettingsOutline, IoPersonOutline, IoAddCircleOutline, IoNotificationsOutline, IoHelpCircleOutline, IoLogOutOutline, IoBusinessOutline, IoPeopleOutline, IoCalendarOutline, IoMenuSharp
} from 'react-icons/io5';

const navSections = [
    {
        title: 'Navigation',
        items: [
            { name: 'Home', path: '/', icon: IoHomeOutline },
            { name: 'Popular', path: '/popular', icon: IoFlameOutline },
            { name: 'My Posts', path: `/user-posts?user=${localStorage.getItem("uid")}`, icon: IoDocumentTextOutline },
            { name: 'My Upvotes', path: `/upvotes?user=${localStorage.getItem("uid")}`, icon: IoBookmarkOutline },
            { name: 'Saved Issues', path: `/saved-posts?user=${localStorage.getItem("username")}`, icon: IoBookmarkOutline },
            { name: 'Archieved Posts', path: `/archieved-posts?user=${localStorage.getItem("username")}`, icon: MdArchive },
        ],
    },
    {
        title: 'NGO',
        items: [
            { name: "NGO'S", path: '/ngos', icon: IoBusinessOutline },
            { name: "Register NGO", path: '/register-ngo', icon: IoBusinessOutline },
        ],
    },
    {
        title: 'Community',
        items: [
            { name: 'Communities', path: '/communities', icon: IoPeopleOutline },
            { name: 'New Community', path: '/new-community', icon: IoPeopleOutline },
            { name: 'My Communities', path: '/my-communities', icon: IoPeopleOutline },
            { name: 'Leaders', path: '/leaders', icon: IoPersonOutline },
            { name: 'Events', path: '/events', icon: IoCalendarOutline },
        ],
    },
    {
        title: 'Utilities',
        items: [
            { name: 'Raise Issue', path: '/raise-issue', icon: IoAddCircleOutline },
            { name: 'Notifications', path: '/notifications', icon: IoNotificationsOutline },
            { name: 'Settings', path: '/settings', icon: IoSettingsOutline },
            { name: 'Profile', path: '/profile', icon: IoPersonOutline },
            { name: 'Help', path: '/help', icon: IoHelpCircleOutline },
        ],
    },
];

export {navSections}