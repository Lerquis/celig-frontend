import { useState } from "react";
import { Menu } from "../../icons/Menu";
import { X } from "../../icons/X";
import { Button } from "../../ui/button";
import { SideBarPanelCMS } from "../../molecules/CMS/SideBarPanelCMS";

export const SideBarCMS = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="fixed right-4 top-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        <span className="sr-only">Toggle Menu</span>
      </Button>

      <SideBarPanelCMS isOpen={isOpen} />
    </>
  );
};
