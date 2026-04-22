"use client";

import axiosInstance from "@/axios";
import LoadingScreen from "@/components/loadingScreen";
import Modal from "@/components/modal";
import { LOGIN_ENDPOINT } from "@/constants";
import { loginSchema } from "@/validations/authSchema";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Login() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isLoading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const formik = useFormik({
    initialValues: { username: "", password: "" },
    validationSchema: loginSchema,
    onSubmit: (values) => tryLogin(values.username, values.password),
  });

  const tryLogin = (username: string, password: string) => {
    setLoading(true);

    axiosInstance
      .post(LOGIN_ENDPOINT, {
        username: username,
        password: password,
      })
      .then((_response) => {
        router.push("/home");
      })
      .catch((err) => {
        setModalOpen(true);
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="w-full bg-slate-950 h-screen flex justify-center items-center">
      <Modal
        isOpen={modalOpen}
        title="Error"
        message="Invalid credentials"
        setModalOpen={setModalOpen}
      />

      {isLoading && <LoadingScreen />}
      <form
        className="bg-slate-900 p-10 rounded-xl shadow-lg shadow-black"
        onSubmit={formik.handleSubmit}
      >
        <div className="flex flex-col items-start justify-start space-y-2 relative pb-4">
          <label className="font-semibold">User</label>
          <input
            type="text"
            name="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            placeholder="Enter your username..."
            className="bg-transparent rounded-2xl border border-white p-2"
          />
          {formik.touched.username && formik.errors.username ? (
            <p className="text-red-700 text-sm absolute bottom-0 left-0">
              {formik.errors.username}
            </p>
          ) : null}
        </div>

        <div className="flex flex-col items-start justify-start space-y-2 relative pb-4">
          <label className="font-semibold">Password</label>
          <input
            name="password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            placeholder="Password@123"
            className="bg-transparent rounded-2xl border border-white p-2"
          />
          {formik.touched.password && formik.errors.password ? (
            <p className="text-red-700 text-sm absolute bottom-0 left-0">
              {formik.errors.password}
            </p>
          ) : null}
        </div>

        <div className="w-full flex justify-center mt-6">
          <button
            type="submit"
            className="border border-white w-full rounded-xl p-2 cursor-pointer hover:bg-slate-950 duration-200"
          >
            Login
          </button>
        </div>
      </form>
    </div>
  );
}
