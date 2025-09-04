import { useTheme } from "next-themes";
import { useForm } from "react-hook-form";

type UserSignUpForm = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
};

const Register = () => {
  const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UserSignUpForm>();
    const { theme, setTheme } = useTheme();
    const onSubmit = (data: UserSignUpForm) => {
        console.log("Sign In Data:", data);
        // send data to API here
    };
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2 bg-white dark:bg-black">
      
    </div>
  )
}

export default Register