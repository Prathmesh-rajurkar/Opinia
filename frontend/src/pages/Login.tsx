import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

type SignInForm = {
    email: string;
    password: string;
};
export const Login = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SignInForm>();
    const { theme, setTheme } = useTheme();
    const onSubmit = (data: SignInForm) => {
        console.log("Sign In Data:", data);
        // send data to API here
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white dark:bg-black">
            <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="text-black dark:text-white absolute top-3 right-5"
            >
                <span>
                    {theme === "dark" ? (
                        <Moon className="w-6 h-6 text-theme box-border p-0.5 border-2 rounded-full " />
                    ) : (
                        <Sun className="w-6 h-6 text-blue-600 p-0.5 border-2 rounded-full" />
                    )}
                </span>
            </button>
            <div className="bg-neutral-300 dark:bg-neutral-800 max-w-md w-full p-8 rounded-lg shadow-md">
                <div className="flex items-center mb-6 justify-center gap-3">
                    <img src="logo.svg" alt="" className="size-10" />
                    <h3 className="text-3xl dark:text-dark text-theme font-semibold ">
                        Opinia
                    </h3>
                </div>
                <h2 className="text-2xl font-bold mb-6 text-center text-black dark:text-white">
                    Login to Your Account
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

                    <button
                        type="submit"
                        className="text-md dark:text-white text-black p-2 dark:bg-dark bg-theme rounded-md w-full hover:bg-[#d9771b] "
                    >
                        Sign In
                    </button>

                    <h4 className="text-center text-sm text-white dark:text-black">
                        <a href="">Forget Password?</a>
                    </h4>
                </form>
            </div>
        </div>
    );
};
