import { SidebarLinkCMS } from "../atoms/SidebarLinkCMS";
import { FileText } from "../icons/FileText";
import { Headphones } from "../icons/Headphones";
import { Images } from "../icons/Images";
import { LayoutDashboard } from "../icons/LayoutDashboard";
import { Mail } from "../icons/Mail";
import { MessageSquareQuote } from "../icons/MessageSquareQuote";

const iconClassName = "mr-3 h-5 w-5";

const navItems = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <LayoutDashboard className={iconClassName} />,
  },
  {
    name: "Blogs",
    href: "/admin/dashboard/blogs",
    icon: <FileText className={iconClassName} />,
  },
  {
    name: "Testimonios",
    href: "/admin/dashboard/testimonios",
    icon: <MessageSquareQuote className={iconClassName} />,
  },
  {
    name: "Podcasts",
    href: "/admin/dashboard/podcasts",
    icon: <Headphones className={iconClassName} />,
  },
  {
    name: "Suscriptores",
    href: "/admin/dashboard/suscriptores",
    icon: <Mail className={iconClassName} />,
  },
  {
    name: "Imágenes",
    href: "/admin/dashboard/imagenes",
    icon: <Images className={iconClassName} />,
  },
];

export const SideBarPanelCMS = ({ isOpen }) => {
  const getPathName = () => {
    return window.location.pathname;
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-background transition-transform
      duration-200 ease-in-out
      md:relative md:translate-x-0
      ${isOpen ? "translate-x-0" : "-translate-x-full"}
  `}
    >
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-xl font-bold">CELIG Admin</h1>
      </div>
      <nav className="space-y-1 px-2 py-4">
        {navItems.map((item, index) => {
          return (
            <SidebarLinkCMS
              key={item.name + index}
              href={item.href}
              selected={getPathName() === item.href}
              icon={item.icon}
              name={item.name}
            />
          );
        })}
      </nav>
    </div>
  );
};
