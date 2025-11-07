"use client";

import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuItem,
  NavbarMenuToggle,
  Skeleton,
} from "@heroui/react";
import NextLink from "next/link";

import { Logo } from "@/config/logoSite";
import { siteConfig } from "@/config/site";
import {
  isUserAdmin,
  isUserSubscribe,
  shouldShowSubscribeButton,
} from "@/helper/auth";
import { Button, Link, User } from "@heroui/react";
import { Icon } from "@iconify/react";
import { signOut, useSession } from "next-auth/react";
import React from "react";
import HeaderUser from "./HeaderUser";
import { ThemeSwitcher } from "./ThemeSwitcher";

const Navbar = () => {
  const { data } = useSession();
  const user = data?.user;
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const showSubscribeButton = shouldShowSubscribeButton(user);
  const isAdmin = isUserAdmin(user);
  const isSubscribed = isUserSubscribe(user);

  return (
    <HeroUINavbar
      maxWidth="xl"
      position="sticky"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
    >
      <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
        <NavbarBrand as="li" className="gap-3 max-w-fit">
          <NextLink className="flex justify-start items-center gap-1" href="/">
            <Logo />
            <p className="font-bold text-inherit">{siteConfig.name}</p>
          </NextLink>
        </NavbarBrand>
      </NavbarContent>

      <NavbarContent
        className="hidden sm:flex basis-1/5 sm:basis-full"
        justify="end"
      >
        <NavbarItem className="hidden sm:flex gap-2">
          <ThemeSwitcher />
        </NavbarItem>
        {data?.user ? (
          <>
            {showSubscribeButton ? (
              <NavbarItem className="hidden sm:flex">
                <Button
                  className="bg-foreground font-medium text-background px-5"
                  color="secondary"
                  radius="full"
                  variant="flat"
                  as={Link}
                  href="/subscribe"
                >
                  Subscribe for $9.99
                </Button>
              </NavbarItem>
            ) : null}
            <NavbarItem className="hidden sm:flex">
              <HeaderUser user={user} />
            </NavbarItem>
          </>
        ) : (
          <>
            {data === undefined ? (
              <div className="max-w-[200px] w-full flex items-center gap-3">
                <div>
                  <Skeleton className="flex rounded-full w-12 h-12" />
                </div>
                <div className="w-full flex flex-col gap-2">
                  <Skeleton className="h-3 w-3/5 rounded-lg" />
                  <Skeleton className="h-3 w-4/5 rounded-lg" />
                </div>
              </div>
            ) : null}
            {data === null ? (
              <Button
                className="bg-foreground font-medium text-background px-5"
                color="secondary"
                radius="full"
                variant="flat"
                as={Link}
                href="/login"
                endContent={<Icon icon="akar-icons:arrow-right" />}
              >
                Login
              </Button>
            ) : null}
          </>
        )}
      </NavbarContent>

      <NavbarContent className="sm:hidden basis-1 pl-4" justify="end">
        <ThemeSwitcher />

        {data?.user ? (
          <NavbarMenuToggle aria-label="Open menu" />
        ) : data === null ? (
          <NavbarItem>
            <Button
              className="bg-foreground font-medium text-background px-5"
              color="secondary"
              radius="full"
              variant="flat"
              as={Link}
              href="/login"
            >
              Login
            </Button>
          </NavbarItem>
        ) : null}
      </NavbarContent>

      <NavbarMenu className="pt-16 mt-1">
        <User
          as="button"
          avatarProps={{
            isBordered: true,
            src: user?.profilePicture?.url
              ? user.profilePicture?.url
              : "/images/default_user.png",
          }}
          className="transition-transform mb-1"
          description={user?.email}
          name={user?.name}
        />

        {isAdmin ? (
          <NavbarMenuItem>
            <Link
              color="foreground"
              href="/admin/dashboard"
              size="lg"
              className="flex gap-1"
              onPress={() => setIsMenuOpen(false)}
            >
              <Icon icon="tabler:user-cog" /> Admin Dashboard
            </Link>
          </NavbarMenuItem>
        ) : null}

        <NavbarMenuItem>
          <Link
            color="foreground"
            href="/app/dashboard"
            size="lg"
            className="flex gap-1"
            onPress={() => setIsMenuOpen(false)}
          >
            <Icon icon="hugeicons:ai-brain-02" /> App Dashboard
          </Link>
        </NavbarMenuItem>

        {showSubscribeButton ? (
          <NavbarMenuItem>
            <Link
              color="secondary"
              href="/subscribe"
              size="lg"
              className="flex gap-1"
              onPress={() => setIsMenuOpen(false)}
            >
              <Icon icon="solar:card-send-bold" /> Subscribe
            </Link>
          </NavbarMenuItem>
        ) : null}

        {isSubscribed && !isAdmin ? (
          <NavbarMenuItem>
            <Link
              color="secondary"
              href="/app/unsubscribe"
              size="lg"
              className="flex gap-1"
              onPress={() => setIsMenuOpen(false)}
            >
              <Icon icon="solar:card-recive-bold" /> Manage Subscription
            </Link>
          </NavbarMenuItem>
        ) : null}

        <NavbarMenuItem>
          <Link
            color="danger"
            size="lg"
            className="flex gap-1 cursor-pointer"
            onPress={() => signOut()}
          >
            <Icon icon="tabler:logout-2" /> Logout
          </Link>
        </NavbarMenuItem>
      </NavbarMenu>
    </HeroUINavbar>
  );
};

export default Navbar;
