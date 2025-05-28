import { SidebarLinkCMS } from "@/components/atoms/CMS/SidebarLinkCMS";
import { FileText } from "../../icons/FileText";
import { Headphones } from "../../icons/Headphones";
import { Images } from "../../icons/Images";
import { LayoutDashboard } from "../../icons/LayoutDashboard";
import { Mail } from "../../icons/Mail";
import { MessageSquareQuote } from "../../icons/MessageSquareQuote";
import { Button } from "../../ui/button";

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
  const getPathName = () => window.location.pathname;

  const handleLogout = async () => {
    const response = await fetch("/api/logout");
    if (response.ok) {
      window.location.href = "/admin/login"; // Redirigir al login después de cerrar sesión
    } else {
      console.error("Error al cerrar sesión");
    }
  };

  return (
    <div
      className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-background transition-transform h-screen top-0
        duration-200 ease-in-out
         md:translate-x-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
    >
      <div className="flex h-screen flex-col justify-between ">
        <div>
          <div className="flex h-16 items-center border-b px-6">
            <h1 className="text-xl font-bold">CELIG Admin</h1>
          </div>
          <nav className="space-y-1 px-2 py-4">
            {navItems.map((item, index) => (
              <SidebarLinkCMS
                key={item.name + index}
                href={item.href}
                selected={getPathName() === item.href}
                icon={item.icon}
                name={item.name}
              />
            ))}
          </nav>
        </div>

        {/* Bottom section: Cerrar sesión */}
        <div className="p-4 border-t">
          <Button
            variant={"ghost"}
            onClick={handleLogout}
            className="w-full text-sm font-medium text-red-600 hover:text-white hover:!bg-red-600 transition-colors"
          >
            Cerrar sesión
          </Button>
        </div>
      </div>
    </div>
  );
};
