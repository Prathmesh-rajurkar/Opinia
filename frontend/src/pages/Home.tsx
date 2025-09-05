import React from "react";
import { Navbar } from "../components/Navbar";

export const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center bg-white dark:bg-black px-20">
            <Navbar />
        </div>
    );
};
