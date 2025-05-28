export const SidebarLinkCMS = ({ href, selected, icon, name }) => {
  return (
    <a
      href={href}
      className={`flex items-center rounded-md px-3 py-2 text-sm font-medium
      transition-colors
      ${selected ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
      onClick={() => {}}
    >
      {icon}
      {name}
    </a>
  );
};
