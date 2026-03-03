import { Menubar } from "primereact/menubar";
import { useNavigate } from "react-router-dom";
import logo from "../assets/takeoff logo.png";

export default function NavBar() {
  const navigate = useNavigate();

  const start = (
    <div
      className="flex items-center cursor-pointer"
      onClick={() => navigate("/")}
    >
      <img src={logo} alt="Logo" className="h-16 w-auto" />
    </div>
  );

  const items = [
    { label: "Home", icon: "pi pi-home", command: () => navigate("/") },
    {
      label: "About",
      icon: "pi pi-info-circle",
      command: () => navigate("/about"),
    },
    {
      label: "Menu",
      icon: "pi pi-th-large",
      className: "menu-hover-only",
      items: [
        {
          label: "Plans Page",
          icon: "pi pi-file",
          command: () => navigate("/plans"),
        },
        {
          label: "Duct Page",
          icon: "pi pi-sliders-h",
          command: () => navigate("/duct"),
        },
      ],
    },

    {
      label: "Contact",
      icon: "pi pi-envelope",
      command: () => navigate("/contact"),
    },
  ];

  return (
    <Menubar
      model={items}
      start={start}
      className="fixed top-0 left-0 w-full z-9999"
      pt={{
        root: {
          className:
            "bg-gray-200 border-none px-8 h-16 flex items-center justify-between backdrop-blur-md",
        },
        menuitem: {
          className:
            "text-gray-800 font-medium hover:text-indigo-600 transition-colors",
        },
        submenu: {
          className: "bg-white shadow-lg border border-gray-200 rounded-md",
        },
      }}
    />
  );
}
