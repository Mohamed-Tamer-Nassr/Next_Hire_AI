import { isUserAdmin, isUserSubscribe } from "@/helper/auth";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownSection,
  DropdownTrigger,
  User,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import { signOut } from "next-auth/react";

// ✅ FIXED: Accept any type since session user structure is different
const HeaderUser = ({ user }: { user: any }) => {
  const isSubscribed = isUserSubscribe(user);
  const isAdmin = isUserAdmin(user);

  // console.log("=== HEADER USER DEBUG ===");
  // console.log("User:", user);
  // console.log("isSubscribed:", isSubscribed);
  // console.log("isAdmin:", isAdmin);
  // console.log("========================");

  return (
    <div className="flex items-center gap-4">
      <Dropdown placement="bottom-start">
        <DropdownTrigger>
          <User
            as="button"
            avatarProps={{
              isBordered: true,
              src: user?.profilePicture?.url
                ? user?.profilePicture?.url
                : "/images/default_user.png",
            }}
            className="transition-transform"
            description={user?.email}
            name={user?.name}
          />
        </DropdownTrigger>
        <DropdownMenu aria-label="User Actions" variant="flat">
          <DropdownSection showDivider>
            <DropdownItem
              key="profile"
              className="h-14 gap-2"
              textValue="Profile"
            >
              <p className="font-bold">Signed in as</p>
              <p className="font-bold">{user?.email}</p>
            </DropdownItem>
          </DropdownSection>

          <DropdownSection showDivider>
            {/* ✅ Show Admin Dashboard only for admins */}
            {isAdmin ? (
              <DropdownItem
                key="admin_dashboard"
                href="/admin/dashboard"
                startContent={<Icon icon="tabler:user-cog" />}
                textValue="Admin Dashboard"
              >
                Admin Dashboard
              </DropdownItem>
            ) : null}

            {/* ✅ Show App Dashboard for subscribed users or admins */}
            {isSubscribed || isAdmin ? (
              <DropdownItem
                key="app_dashboard"
                href="/app/dashboard"
                startContent={<Icon icon="hugeicons:ai-brain-02" />}
                textValue="App Dashboard"
              >
                App Dashboard
              </DropdownItem>
            ) : null}

            {/* ✅ Show Subscribe option if not subscribed and not admin */}
            {!isSubscribed && !isAdmin ? (
              <DropdownItem
                key="subscribe"
                href="/subscribe"
                startContent={<Icon icon="solar:card-send-bold" />}
                color="secondary"
                textValue="Subscribe"
              >
                Subscribe Now
              </DropdownItem>
            ) : null}

            {/* ✅ Show Unsubscribe option if subscribed */}
            {isSubscribed && !isAdmin ? (
              <DropdownItem
                key="unsubscribe"
                href="/app/unsubscribe"
                startContent={<Icon icon="solar:card-recive-bold" />}
                color="warning"
                textValue="Unsubscribe"
              >
                Manage Subscription
              </DropdownItem>
            ) : null}
          </DropdownSection>

          <DropdownSection>
            <DropdownItem
              key="logout"
              color="danger"
              startContent={<Icon icon="tabler:logout-2" />}
              onPress={() => signOut()}
              textValue="Logout"
            >
              Logout
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default HeaderUser;
