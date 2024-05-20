import BasicPage from "../pages/BasicPage";
import DashboardPage from "../pages/dashboard-page/DashboardPage";
import {PageTitles} from "../utils/Constants";
import ProductPage from "../pages/product-page/ProductPage";
import ScanPage from "../pages/scan-page/ScanPage";
import UsersPage from "../pages/users-page/UsersPage";
import ProfilePage from "../pages/profile-page/ProfilePage";
import DocumentationPage from "../pages/documentation-page/DocumentationPage";
import React from "react";
import {Outlet, Route} from "react-router-dom";
import {isAdmin, isUser} from "../services/auth";
import OrdersPage from "../pages/orders-page/OrdersPage";
import OrderPage from "../pages/order-page/OrderPage";
import LogoutPage from "../pages/logout-page/LogoutPage";
import StoragePage from "../pages/storage-page/StoragePage";


export const privateRoutes = [
    {
        path: "app/orders",
        main: () => <BasicPage page={<OrdersPage/>}
                               title={PageTitles.ORDERS}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/new-order",
        main: () => <BasicPage page={<StoragePage/>}
                               title={PageTitles.NEW_ORDER}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/order/:id",
        main: () => <BasicPage page={<OrderPage/>}
                               title={PageTitles.ORDER}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/scan",
        main: () => <BasicPage page={<ScanPage/>}
                               title={PageTitles.SEARCH}
                               showSideBar={false}
                               isAuth={true}/>
    },
    {
        path: "app/dashboard",
        main: () => <BasicPage page={<DashboardPage/>}
                               title={PageTitles.DASHBOARD}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/storage",
        main: () => <BasicPage page={<StoragePage/>}
                               title={PageTitles.STORAGE}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/storage/product/:id",
        main: () => <BasicPage page={<ProductPage/>}
                               title={PageTitles.STORAGE}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/search",
        main: () => <BasicPage page={<ScanPage/>}
                               title={PageTitles.SEARCH}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/users",
        main: () => <BasicPage page={<UsersPage/>}
                               title={PageTitles.USERS}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "app/profile",
        main: () => <BasicPage page={<ProfilePage/>}
                               title={PageTitles.PROFILE}
                               showSideBar={true}
                               isAuth={true}/>
    },
    {
        path: "doc",
        main: () => <DocumentationPage/>
    },
    {
        path: "app/logout",
        main: () => <BasicPage page={<LogoutPage/>}
                               title={PageTitles.HOME}
                               showSideBar={false}
                               isAuth={true}/>
    }
];


function PrivateRoutes() {

    return (
        <Outlet>
            {privateRoutes.map((route, index) => {
                if ((isUser() && [
                        'app/profile',
                        'app/orders',
                        'app/order/:id',
                        'app/scan'].includes(route.path)) ||
                    isAdmin()) {
                    return (
                        <Route
                            key={index}
                            path={route.path}
                            element={route.main}
                        />
                    );
                }
                return null;
            })}
        </Outlet>
    )
}

export default PrivateRoutes