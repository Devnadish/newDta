"use client";
import React, { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { submitContact } from "@/actions/constactus/submitContact";
import { SendingToserver } from "./Loader";
import { NotifyMsg } from "./NotifyMsg";
import { motion, AnimatePresence } from "framer-motion";
import { Phone, User, Mail, MessageSquare, Send } from "lucide-react";
import { cn } from "@/lib/utils";

export default function FormContact({
  lang,
  user,
}: {
  lang: string;
  user: any;
}) {
  const t = useTranslations("contactus");
  const [state, formAction, isPending] = useActionState(submitContact, null);
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [name, setName] = useState("");
  const [open, setOpen] = useState(false);
  const [focused, setFocused] = useState<string | null>(null);
  
  const formSchema = z.object({
    mobile: z.string().regex(/^[0-9]{10}$/, t("mobileValidationError")),
    email: z.string().email(t("emailValidationError")),
    message: z.string().min(10, t("msgValidationError")),
  });

  const validateField = (name: string, value: string) => {
    try {
      if (name === 'mobile') formSchema.shape.mobile.parse(value);
      else if (name === 'email') formSchema.shape.email.parse(value);
      else if (name === 'message') formSchema.shape.message.parse(value);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl mx-auto p-4"
    >
      <motion.form
        action={formAction}
        className={cn(
          "backdrop-blur-md bg-background/5",
          "border border-orangeColor/30",
          "p-6 rounded-xl shadow-lg",
          "flex flex-col gap-6"
        )}
      >
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <InputContact
              name="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              placeholder="1234567890"
              className={cn(
                "text-base transition-all duration-200",
                focused === "mobile" ? "ring-2 ring-orangeColor" : "",
                !validateField("mobile", mobile) && mobile ? "border-red-500" : ""
              )}
              labelName={t("mobile")}
              icon={<Phone className="w-4 h-4 text-orangeColor/70" />}
              onFocus={() => setFocused("mobile")}
              onBlur={() => setFocused(null)}
            />
          </motion.div>

          <motion.div
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <InputContact
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={user.firstName}
              className={cn(
                "text-base transition-all duration-200",
                focused === "name" ? "ring-2 ring-orangeColor" : ""
              )}
              labelName={t("name")}
              icon={<User className="w-4 h-4 text-orangeColor/70" />}
              onFocus={() => setFocused("name")}
              onBlur={() => setFocused(null)}
            />
          </motion.div>

          <motion.div
            className="sm:col-span-2"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { opacity: 1, x: 0 }
            }}
          >
            <InputContact
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={user.email}
              className={cn(
                "text-base transition-all duration-200",
                focused === "email" ? "ring-2 ring-orangeColor" : "",
                !validateField("email", email) && email ? "border-red-500" : ""
              )}
              labelName={t("email")}
              icon={<Mail className="w-4 h-4 text-orangeColor/70" />}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
            />
          </motion.div>
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 }
          }}
          initial="hidden"
          animate="visible"
        >
          <label className="flex items-center gap-2 text-base text-orangeColor font-cairo mb-2">
            <MessageSquare className="w-4 h-4" />
            {t("msg")}
          </label>
          <Textarea
            name="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("msgplaceHolder")}
            className={cn(
              "min-h-[120px] text-base resize-none",
              "transition-all duration-200",
              focused === "message" ? "ring-2 ring-orangeColor" : "",
              !validateField("message", message) && message ? "border-red-500" : "",
              "text-foreground"
            )}
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
          />
          <motion.div
            className="h-1 bg-orangeColor/20 mt-2 rounded-full"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: message.length / 500 }}
            transition={{ duration: 0.2 }}
          />
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="submit"
            className={cn(
              "w-full text-base py-3",
              "bg-gradient-to-r from-orangeColor/80 to-orangeColor",
              "hover:from-orangeColor hover:to-orangeColor/90",
              "transition-all duration-300",
              "shadow-lg hover:shadow-xl"
            )}
            disabled={isPending}
          >
            <AnimatePresence mode="wait">
              {isPending ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <SendingToserver />
                </motion.div>
              ) : (
                <motion.div
                  key="send"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {t("sendBtn")}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        </motion.div>
      </motion.form>

      <AnimatePresence>
        {state && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <NotifyMsg
              title={t("Done")}
              msg={t("doneMsg")}
              open={isPending}
              onOpenChange={() => setOpen(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

const InputContact = ({
  name,
  value,
  onChange,
  placeholder,
  className,
  labelName,
  icon,
  onFocus,
  onBlur,
}: {
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  className: string;
  labelName: string;
  icon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-base text-orangeColor font-cairo">
        {icon}
        {labelName}
      </label>
      <Input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={className}
        onFocus={onFocus}
        onBlur={onBlur}
      />
    </div>
  );
};