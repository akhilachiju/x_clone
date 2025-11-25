"use client";

import { useCallback, useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "react-hot-toast";
import Input from "../ui/Input";
import useLoginModal from "@/hooks/useLoginModal";
import useRegisterModal from "@/hooks/useRegisterModal";
import Modal from "./Model";

const LoginModal = () => {
  const loginModal = useLoginModal();
  const registerModal = useRegisterModal();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const onToggle = useCallback(() => {
    if (isLoading) {
      return;
    }
    loginModal.onClose();
    registerModal.onOpen();
  }, [isLoading, registerModal, loginModal]);

  const onSubmit = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        toast.error('Invalid credentials');
      } else {
        toast.success('Logged in');
        loginModal.onClose();
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }, [email, password, loginModal]);

  const bodyContent = (
    <div className="flex flex-col gap-4">
      <Input
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
        disabled={isLoading}
      />
      <Input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
        disabled={isLoading}
      />
    </div>
  );

  const footerContent = (
    <div className="text-neutral-400 text-center mt-4">
      <p>
        First time user?
        <span
        onClick={onToggle}
          className="
        text-white
        cursor-pointer
        hover:underline
      "
        > Create an account
        </span>
      </p>
    </div>
  );

  return (
    <div>
      <Modal
      disabled={isLoading}
        isOpen={loginModal.isOpen}
        title="Login"
        actionLabel="Sign in"
        onClose={loginModal.onClose}
        onSubmit={onSubmit}
        body={bodyContent}
        footer={footerContent}
      />
    </div>
  );
};

export default LoginModal;
