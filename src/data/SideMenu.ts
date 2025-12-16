import { dash, report, logout } from '../assets';
import { FaPhoneAlt } from 'react-icons/fa'; // Import call icon

export const side_menu = [
    {
        icon: dash,
        label: 'Dashboard',
        href: '', // or 'dashboard' if you use a route
    },
    {
        icon: FaPhoneAlt, // Use the phone icon for Call Requests
        label: 'Call Requests',
        href: 'calls',
    },
    {
        icon: report, // you can replace this with a newsletter icon if you have one
        label: 'News',
        href: 'newsletter',
    },
    {
        icon: logout,
        label: 'Log out',
        href: 'logout',
        custom: true,   // Sidebar knows this is a special action
    }
];
