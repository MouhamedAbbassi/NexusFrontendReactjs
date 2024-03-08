import {
  HomeIcon,
  UserCircleIcon,
  TableCellsIcon,
  InformationCircleIcon,
  ServerStackIcon,
  RectangleStackIcon,
} from "@heroicons/react/24/solid";
import { Home, Profile, Tables } from "@/pages/dashboard";
import { SignIn, SignUp } from "@/pages/auth";
import Backlogs from "./pages/dashboard/backlogList";
import AllMeetingsList from "./pages/dashboard/AllMeetingsList";
import SprintList from "./pages/dashboard/SprintList";

const icon = {
  className: "w-5 h-5 text-inherit",
};

export const routes = [
  {
    layout: "dashboard",
    pages: [
      {
        icon: <HomeIcon {...icon} />,
        name: "dashboard",
        path: "/home",
        element: <Home />,
      },
      {
        icon: <UserCircleIcon {...icon} />,
        name: "profile",
        path: "/profile",
        element: <Profile />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "backlog",
        path: "/backlog",
        element: <Backlogs />,
      },
      {
        icon: <TableCellsIcon {...icon} />,
        name: "tables",
        path: "/tables",
        element: <Tables />,
      }
      ,
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "meet",
        path: "/meet",
        element: <AllMeetingsList />,
      },
      {
        icon: <InformationCircleIcon {...icon} />,
        name: "sprint",
        path: "/sprint",
        element: <SprintList />,
      },
    ],
  },
  {
    title: "auth pages",
    layout: "auth",
    pages: [
      {
        icon: <ServerStackIcon {...icon} />,
        name: "sign in",
        path: "/sign-in",
        element: <SignIn />,
      },
      {
        icon: <RectangleStackIcon {...icon} />,
        name: "sign up",
        path: "/sign-up",
        element: <SignUp />,
      },
    ],
  },
];

export default routes;
