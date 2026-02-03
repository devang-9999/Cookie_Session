
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import "./register.css";

import {
  Button,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  OutlinedInput,
  InputAdornment,
  IconButton,
  FormHelperText,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { registerUserThunk, resetAuthState } from "../../redux/authSlice";

const RegisterUserSchema = z.object({
  username: z.string().min(4, "Username should be of minimum 4 characters"),
  useremail: z.string().email("Invalid email"),
  userPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .refine((val) => !val.includes(" "), {
      message: "Password must not contain spaces",
    }),
});

type RegisterFormData = z.infer<typeof RegisterUserSchema>;

export default function Register() {
  const dispatch = useAppDispatch();
  const { loading, success, error, message } = useAppSelector(
    (state) => state.auth
  );

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] =
    useState<"success" | "error">("success");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(RegisterUserSchema),
  });

  const handleRegister = (data: RegisterFormData) => {
    dispatch(
      registerUserThunk({
        username: data.username,
        useremail: data.useremail,
        userPassword: data.userPassword,
      })
    );
  };


  useEffect(() => {
    if (error) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSnackbarMessage(error);
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }

    if (success) {
      setSnackbarMessage(message || "Registration successful");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      reset();
      setTimeout(() => {
        router.push("/login");
      }, 800);
    }

    return () => {
      dispatch(resetAuthState());
    };
  }, [success, error, message, dispatch, reset, router]);

  return (
    <>
      <div className="Container">
        <div className="Sidebar">
          <h1>Register</h1>
        </div>

        <div className="Design">
          <form onSubmit={handleSubmit(handleRegister)}>
            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Name"
              {...register("username")}
              error={!!errors.username}
              helperText={errors.username?.message}
            />

            <TextField
              sx={{ mb: 2 }}
              fullWidth
              label="Email Address"
              {...register("useremail")}
              error={!!errors.useremail}
              helperText={errors.useremail?.message}
            />

            <FormControl fullWidth error={!!errors.userPassword}>
              <InputLabel>Password</InputLabel>
              <OutlinedInput
                sx={{ mb: 2 }}
                type={showPassword ? "text" : "password"}
                {...register("userPassword")}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
              />
              <FormHelperText>{errors.userPassword?.message}</FormHelperText>
            </FormControl>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </Button>

            <Typography
              align="center"
              sx={{
                mt: 2,
                color: "rgba(40, 116, 240)",
                fontWeight: "bold",
              }}
            >
              Existing User ?{" "}
              <Link
                href="/login"
                style={{
                  textDecoration: "none",
                  color: "rgba(40, 116, 240)",
                }}
              >
                Login
              </Link>
            </Typography>
          </form>
        </div>

        <Snackbar
          open={snackbarOpen}
          autoHideDuration={5000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={() => setSnackbarOpen(false)}
            severity={snackbarSeverity}
            sx={{ width: "100%" }}
          >
            {snackbarMessage}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
}