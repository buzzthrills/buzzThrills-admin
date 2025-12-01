import { dash, report, logout } from '../assets';

export const side_menu = [
    {
        icon: dash,
        label: 'Dashboard',
        href: '', // or 'dashboard' if you use a route
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
