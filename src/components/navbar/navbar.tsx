'use client';

import React from 'react';
import ThemeToggle from '../theme/theme';
import Image from 'next/image';
import logo from '../../../public/icons/logo.svg';
// import darkLogo from '../../../public/icons/dark-logo.svg';
import SearchComponent from '../search/search-component';
import defaUltAvatar from '../../../public/images/default-avatar.png';
import { Menu } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import Link from 'next/link';

const Navbar = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  // const [username, setUsername] = React.useState('John Doe');
  // const [avatar, setAvatar] = React.useState<any>(defaUltAvatar);
  const auth = useAuth();
  const username = auth?.user.name || 'John Doe';
  const avatar = auth?.user.avatarUrl || defaUltAvatar;

  React.useEffect(() => {
    const ls = localStorage.getItem('theme');
    const initial = ls
      ? ls === 'dark'
      : document.documentElement.classList.contains('dark');
    setIsDarkMode(initial);
  }, []); // ← run once

  console.log(isDarkMode);

  /*   if (localStorage.getItem('user')) {
    setAvatar(localStorage.getItem('user') || avatar);
  }
 */
  return (
    <div className="w-full h-20 bg-background py-[14px] md:py-[22px] px-4 md:px-30 flex justify-between items-center border-1 border-b-border">
      <div className="md:ml-10">
        <Link
          href="/homepage"
          className="flex items-center justify-between gap-2 "
        >
          <Image
            src={logo}
            alt="Logo"
            width={50}
            height={50}
            className="w-8 md:w-12 h-8 md:h-12 "
          />

          <div className="text-foreground"> Sociality </div>
        </Link>
      </div>
      <div className="hidden md:flex clamp-[30%,100px,40%]">
        {/* <SearchComponent /> */}
      </div>

      <div className="flex md:hidden items-center gap-4 mr-10">
        <div className="flex md:hidden ">
          <SearchComponent />
        </div>
        <Menu onClick={() => setIsMenuOpen(!isMenuOpen)} />
        {isMenuOpen && (
          <div className="absolute top-20 right-4 bg-background border border-border rounded-md shadow-lg p-4 flex flex-col items-start gap-4">
            <Link href="/profile" className="flex items-center gap-2">
              <Image
                src={avatar}
                alt="avatar"
                width={48}
                height={48}
                className="w-8 md:w-12 h-8 md:h-12 rounded-full"
              ></Image>{' '}
              <div className="text-foreground">{username}</div>
            </Link>
            <div className=" flex items-center">
              <ThemeToggle onChange={setIsDarkMode} />
            </div>
          </div>
        )}
      </div>
      <div className=" hidden md:flex  items-center gap-4 mr-10">
        <Link href="/profile" className="flex flex-row items-center gap-2">
          <Image
            src={avatar}
            alt="Logo"
            width={48}
            height={48}
            className="w-8 md:w-12 h-8 md:h-12 rounded-full"
          ></Image>{' '}
          <div>{username}</div>
        </Link>

        <div>
          <ThemeToggle onChange={setIsDarkMode} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
