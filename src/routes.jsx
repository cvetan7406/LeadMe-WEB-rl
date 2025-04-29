/*!

=========================================================
* Vision UI Free React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/vision-ui-free-react
* Copyright 2021 Creative Tim (https://www.creative-tim.com/)
* Licensed under MIT (https://github.com/creativetimofficial/vision-ui-free-react/blob/master LICENSE.md)

* Design and Coded by Simmmple & Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

/** 
  All of the routes for the Vision UI Dashboard React are added here,
  You can add a new route, customize the routes and delete the routes here.

  Once you add a new route on this file it will be visible automatically on
  the Sidenav.

  For adding a new route you can follow the existing routes in the routes array.
  1. The `type` key with the `collapse` value is used for a route.
  2. The `type` key with the `title` value is used for a title inside the Sidenav. 
  3. The `type` key with the `divider` value is used for a divider between Sidenav items.
  4. The `name` key is used for the name of the route on the Sidenav.
  5. The `key` key is used for the key of the route (It will help you with the key prop inside a loop).
  6. The `icon` key is used for the icon of the route on the Sidenav, you have to add a node.
  7. The `collapse` key is used for making a collapsible item on the Sidenav that has other routes
  inside (nested routes), you need to pass the nested routes inside an array as a value for the `collapse` key.
  8. The `route` key is used to store the route location which is used for the react router.
  9. The `href` key is used to store the external links location.
  10. The `title` key is only for the item with the type of `title` and its used for the title text on the Sidenav.
  10. The `component` key is used to store the component of its route.
*/

// Vision UI Dashboard React layouts
import Dashboard from "./layouts/dashboard/index.jsx";
import PendingCapaign from "./layouts/tables/PendingCapaign.jsx";
import CustomTables from "./layouts/tables/custom.jsx";
import Billing from "./layouts/billing/index.jsx";
import RTL from "./layouts/rtl/index.jsx";
import Profile from "./layouts/profile/index.jsx";
import SignUp from "./layouts/authentication/sign-up/index.jsx";
import FileUpload from "./layouts/lead-upload/index.jsx";
import ManageContacts from "./layouts/lead-upload/ManageContacts.jsx";
import LogsMonitoring from "./layouts/logs/index.jsx";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
// Material Icons
import CreateCampaign from "./layouts/campaign/compontents/create.jsx";

import HomeIcon from '@mui/icons-material/Home';
import TableChartIcon from '@mui/icons-material/TableChart';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SearchIcon from '@mui/icons-material/Search';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CallIcon from '@mui/icons-material/Call';
import { IoDocumentText } from 'react-icons/io5';
import BeenhereOutlinedIcon from '@mui/icons-material/BeenhereOutlined';
import AssessmentIcon from '@mui/icons-material/Assessment';
// Protected Route Component
import ProtectedRoute from "./components/ProtectedRoute/index.jsx";
import ScriptEditor from "./layouts/scripts/index.jsx";
import SignOut from "./components/SignOut";
import Homepage from "./examples/home/index.jsx";
import AboutUs from "./examples/aboutus/index.jsx";
const withProtection = (Component) => {
  return function ProtectedComponent(props) {
    return (
      <ProtectedRoute>
        <Component {...props} />
      </ProtectedRoute>
    );
  };
};

const routes = [
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile-section",
  //   icon: <PersonIcon sx={{ fontSize: "15px" }} />,
  //   collapse: [
  //     {
  //       name: "View Profile",
  //       key: "profile",
  //       route: "/profile",
  //       component: withProtection(Profile),
  //     },
  //     {
  //       name: "Edit Profile",
  //       key: "edit-profile",
  //       route: "/profile/edit",
  //       component: withProtection(Profile),
  //     },
  //   ],
  //   collapseIcon: <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />,
  // },
  {
    type: "collapse",
    name: "Homepage",
    key: "homepage",
    route: "/home",
    icon: <HomeIcon sx={{ fontSize: "15px" }} />,
    component: Homepage,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "About Us",
    key: "about-us",
    route: "/aboutus",
    icon: <BeenhereOutlinedIcon sx={{ fontSize: "15px" }} />,
    component: AboutUs,
    noCollapse: true,
  },
  {
    type: "collapse",
    name: "Dashboard",
    key: "dashboard",
    route: "/dashboard",
    icon: <HomeIcon sx={{ fontSize: "15px" }} />,
    component: withProtection(Dashboard),
    noCollapse: true,
  },
  
  
  {
    type: "collapse",
    name: "Campaign Center",
    key: "campaign-center",
    icon: <CallIcon sx={{ fontSize: "15px" }} />,
    collapse: [
      // {
      //   type: "collapse",
      //   name: "Campaigns",
      //   key: "campaigns",
      //   icon: <TableChartIcon sx={{ fontSize: "15px" }} />,
      //   collapse: [
      //     {
      //       name: "Pending Campaigns",
      //       key: "regular-tables",
      //       route: "/campaigns/pending",
      //       component: withProtection(PendingCapaign),
      //     },
      //     {
      //       name: "Completed Campaigns",
      //       key: "completed-campaigns",
      //       route: "/campaigns/completed",
      //       component: withProtection(CustomTables),
      //     },
      //   ],
      //   collapseIcon: <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />,
      // },
      {
        name: "Campaign Scripts",
        key: "campaign-scripts",
        route: "/campaigns/scripts",
        component: withProtection(ScriptEditor),
      },
      {
        name: "Completed Campaigns",
        key: "completed-campaigns",
        route: "/campaigns/completed",
        component: withProtection(CustomTables),
      },
      {
        name: "Pending Campaigns",
        key: "regular-tables",
        route: "/campaigns/pending",
        component: withProtection(PendingCapaign),
      },
      {
        name: "Create Campaign",
        key: "create-campaign",
        route: "/create/campaign",
         
        component: withProtection(CreateCampaign),
      },
      {
        name: "Upload Contacts",
        
        key: "upload-contacts",
        route: "/file-upload",
         
        component: withProtection(FileUpload),
      },
      {
        name: "Manage Contacts",
        
        key: "manage-contacts",
        route: "/manage/contacts",
         
        component: withProtection(ManageContacts),
      },
    ],
    collapseIcon: <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />,
  },
  {
    type: "collapse",
    name: "System Logs",
    key: "logs",
    route: "/logs",
    icon: <AssessmentIcon sx={{ fontSize: "15px" }} />,
    component: withProtection(LogsMonitoring),
    noCollapse: true,
  },
  // {
  //   type: "collapse",
  //   name: "Finance",
  //   key: "finance",
  //   icon: <CreditCardIcon sx={{ fontSize: "15px" }} />,
  //   collapse: [
  //     {
  //       name: "Billing",
  //       key: "billing",
  //       route: "/billing",
  //       component: withProtection(Billing),
  //     },
  //   ],
  //   collapseIcon: <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />,
  // },
  
  // {
  //   type: "collapse",
  //   name: "Documents",
  //   key: "documents",
  //   icon: <IoDocumentText size="15px" color="inherit" />,
  //   collapse: [
  //     {
  //       name: "Document Library",
  //       key: "document-library",
  //       route: "/documents",
  //       component: withProtection(Tables),
  //     },
  //   ],
  //   collapseIcon: <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />,
  // },
  // { type: "title", title: "Account Pages", key: "account-pages" },
  // {
  //   type: "collapse",
  //   name: "Profile",
  //   key: "profile-section",
  //   icon: <PersonIcon sx={{ fontSize: "15px" }} />,
  //   collapse: [
  //     {
  //       name: "View Profile",
  //       key: "profile",
  //       route: "/profile",
  //       component: withProtection(Profile),
  //     },
  //     {
  //       name: "Edit Profile",
  //       key: "edit-profile",
  //       route: "/profile/edit",
  //       component: withProtection(Profile),
  //     },
  //   ],
  //   collapseIcon: <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />,
  // },
  // {
  //   type: "collapse",
  //   name: "Authentication",
  //   key: "authentication",
  //   icon: <PersonAddIcon sx={{ fontSize: "15px" }} />,
  //   collapse: [
  //     {
  //       name: "Sign Up",
  //       key: "sign-up",
  //       route: "/authentication/sign-up",
  //       component: SignUp,
  //     },
  //     {
  //       name: "Sign Out",
  //       key: "sign-out",
  //       route: "/authentication/sign-out",
  //       component: SignOut,
  //     },
  //   ],
  //   collapseIcon: <KeyboardArrowDownIcon sx={{ fontSize: "15px" }} />,
  // },
  {
    type: "collapse",
    name: "Sign Out",
    key: "sign-out",
    route: "/authentication/sign-out",
    icon: <LogoutIcon sx={{ fontSize: "15px" }} />,
    component: SignOut,
    noCollapse: true,
  },
  
];

export default routes;

