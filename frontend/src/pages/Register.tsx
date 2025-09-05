import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

type UserSignUpForm = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
};

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSignUpForm>();
    const { theme, setTheme } = useTheme();
    const onSubmit = (data: UserSignUpForm) => {
        setIsLoading(true);
        try {
            const res = fetch("http://localhost:5000/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(data),
            });
            if (!res) {
                throw new Error("Failed to register");
            }

            navigate("/");

            // console.log("Registration Data:", res);
        } catch (error) {
            console.error("Error during registration:", error);
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white dark:bg-black">
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-black dark:text-white absolute top-3 right-5"
            >
                <span>
                    {theme === "dark" ? (
                        <Sun className="w-6 h-6 text-dark p-0.5 border-2 rounded-full" />
                    ) : (
                        <Moon className="w-6 h-6 text-theme box-border p-0.5 border-2 rounded-full " />
                    )}
                </span>
            </button>
            <div className="bg-neutral-300 dark:bg-neutral-800 max-w-md w-full p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6 justify-center gap-3">
                    {/* <img src="logo.svg" alt="" className="size-10 " /> */}
                    <div className="w-20 h-20 bg-theme dark:bg-dark [mask-image:url(/logo.png)] [mask-repeat:no-repeat] [mask-position:center] [mask-size:contain]" />

                    <h3 className="text-3xl dark:text-dark text-theme font-semibold ">
                        Opinia
                    </h3>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
                    Create New Account
                </h2>
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 w-full"
                >
                    <div className="flex flex-col">
                        <label className="text-md dark:text-white text-black">
                            Email
                        </label>
                        <input
                            type="email"
                            {...register("email", {
                                required: "Email is required",
                            })}
                            placeholder="your@gmail.com"
                            className="p-2 rounded-md dark:bg-black bg-white text-black dark:text-white"
                        />
                        {errors.email && (
                            <p className="text-red-500">
                                {errors.email.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-md dark:text-white text-black">
                            Username
                        </label>
                        <input
                            type="text"
                            {...register("username", {
                                required: "Username is required",
                            })}
                            placeholder="your_username"
                            className="p-2 rounded-md dark:bg-black bg-white text-black dark:text-white"
                        />
                        {errors.username && (
                            <p className="text-red-500">
                                {errors.username.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-md dark:text-white text-black">
                            Password
                        </label>
                        <input
                            type="password"
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Min 6 characters",
                                },
                            })}
                            placeholder="********"
                            className="p-2 rounded-md dark:bg-black bg-white text-black dark:text-white"
                        />
                        {errors.password && (
                            <p className="text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>
                    <div className="flex flex-col">
                        <label className="text-md dark:text-white text-black">
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            {...register("confirmPassword", {})}
                            placeholder="********"
                            className="p-2 rounded-md dark:bg-black bg-white text-black dark:text-white"
                        />
                        {errors.password && (
                            <p className="text-red-500">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="text-md dark:text-white text-black p-2 dark:bg-dark bg-theme rounded-md w-full hover:bg-[#d9771b] "
                    >
                        {" "}
                        {isLoading ? "Registering..." : "Register"}
                    </button>
                </form>
                <h3 className="text-center text-md dark:text-white text-black mt-4">
                    Already have an account?{" "}
                    <a href="/login" className="text-theme dark:text-dark">
                        Login
                    </a>
                </h3>
            </div>
        </div>
    );
};

export default Register;
