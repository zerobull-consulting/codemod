import Icon from "@/components/shared/Icon";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { motion } from "framer-motion";
import { Languages } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import HoverArrow from "../HoverArrow";
import { NavigationDropdown } from "./NavigationDropdown";

type DropdownProps = {
  animationVariants?: Record<string, any>;
};
export default function SolutionButtonWithDropdown({
  animationVariants,
}: DropdownProps) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    router.prefetch("/");
  }, [pathname]);

  return (
    <NavigationDropdown
      align="center"
      trigger={(open: boolean) => (
        <div className="cursor-pointer">
          <div className="lg:flex hidden items-center gap-2">
            <span className="font-medium body-s-medium">{"Solution"}</span>
            <Icon
              name="chevron-down"
              className={`w-3 transform transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </div>

          {/* Mobile */}
          <motion.div
            variants={animationVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="lg:hidden flex justify-between items-center bg-primary-dark rounded-[8px] p-s dark:bg-primary-light transition-colors hover:bg-primary-light/5 dark:hover:bg-primary-dark/5"
          >
            <span className="font-medium body-s-medium">{"Solution"}</span>
            <Icon
              name="chevron-down"
              className={`w-4 transform transition-transform duration-200 ${
                open ? "rotate-180" : "rotate-0"
              }`}
            />
          </motion.div>
        </div>
      )}
    >
      <DropdownMenu.Group className="flex flex-col space-y-4">
        <DropdownMenu.Item asChild>
          <Link
            href="/i18n"
            prefetch
            className="body-s-medium flex items-center gap-3 group rounded-[8px] font-medium text-primary-light focus:outline-none dark:text-primary-dark"
          >
            <div className="p-2 transition-colors group-hover:bg-accent border border-border-light dark:border-border-dark rounded-[6px]">
              <Languages className="size-5 transition-colors group-hover:text-black" />
            </div>
            <div className="group flex flex-col">
              <span className="font-medium">
                Localization
                <HoverArrow className="ml-2" />
              </span>

              <span className="body-xs opacity-50 group-hover:opacity-100 transition-opacity">
                Replace hard-coded strings with i18n keys
              </span>
            </div>
          </Link>
        </DropdownMenu.Item>
      </DropdownMenu.Group>
    </NavigationDropdown>
  );
}
