import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";

export const Navbar = () => {
    const [currentUser, setCurrentUser] = React.useState(null);
    useEffect(() => {
        const res = fetch("http://localhost:5000/api/auth/currentuser",{
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            },
            credentials:"include"
        });
        res.then(async(response)=>{
            if(!response.ok){
                throw new Error("Failed to fetch current user")
            }
            const data = await response.json();
            setCurrentUser(data);
            console.log(data);
        }).catch((error)=>{
            console.error("Error fetching current user:",error);
        })

    },[])
    const { theme, setTheme } = useTheme();
    return (
        <div className="flex items-center justify-between w-full py-3">
            <div className="flex items-center justify-center gap-1 py-4">
                <div className="w-5 h-5 bg-theme dark:bg-dark [mask-image:url(/logo.png)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />

                <h3 className="text-2xl dark:text-dark text-theme font-semibold ">
                    Opinia
                </h3>
            </div>
            <div>
                <button
                    onClick={() =>
                        setTheme(theme === "dark" ? "light" : "dark")
                    }
                    className="text-black dark:text-white"
                >
                    <span>
                        {theme === "dark" ? (
                            <Sun className="w-6 h-6 text-dark p-0.5 border-2 rounded-full" />
                        ) : (
                            <Moon className="w-6 h-6 text-theme box-border p-0.5 border-2 rounded-full " />
                        )}
                    </span>
                </button>
                <div>
                    {currentUser ? (
                        <span className="text-black dark:text-white ml-4">
                            {/* {currentUser.username} */} username
                        </span>
                    ) : (
                        <a
                            href="/login"
                            className="text-black dark:text-white ml-4"
                        >
                            Login
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
};
