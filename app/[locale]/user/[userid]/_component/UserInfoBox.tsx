"use client"
import { cn } from "@/lib/utils";
import React, { useState, useEffect } from "react";
import {
  CircumMobile1,
  ClarityEmailLine,
  FaBalanceScale,
  IcOutlineAccountBalanceWallet,
  IxJoin,
  PhBasketLight,
} from "@/components/icons/EmailIcon";
import { PersonStanding, Pencil, Check, User } from "lucide-react";
import MotionDiv from "@/components/MotionDiv";
import { updateUserProfile, sendPhoneVerification, verifyPhone } from "@/actions/user/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface InfoItemProps {
  icon: React.ReactNode;
  info: string;
  label?: string;
}

interface UserHistoryType {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
  mobile: string | null;
  emailVerified: Date | null;
  subscriptionType: string | null;
  initailBalance: number | null;
  usedBalance: number | null;
  mobileVerified: boolean;
}

interface UserInfoBoxProps {
  userHistory: UserHistoryType;
  currentBalance: number;
}

interface EditableInfoItemProps extends InfoItemProps {
  onEdit?: () => void;
  isEditing?: boolean;
  onSave?: (value: string) => void;
  editValue?: string;
  onEditValueChange?: (value: string) => void;
  isVerified?: boolean;
  onVerify?: () => void;
}

const EditableInfoItem: React.FC<EditableInfoItemProps> = ({
  icon,
  info,
  label,
  onEdit,
  isEditing,
  onSave,
  editValue,
  onEditValueChange,
  isVerified,
  onVerify,
}) => {
  return (
    <MotionDiv
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "flex items-center gap-3 p-3",
        "bg-background/60 backdrop-blur-md",
        "rounded-xl border border-border/50",
        "transition-all duration-300",
        "hover:shadow-lg hover:border-border/80",
        "hover:bg-background/80",
        "group"
      )}
    >
      <div className="text-2xl text-muted-foreground/60 group-hover:text-muted-foreground/80">
        {icon}
      </div>
      <div className="flex-grow">
        {label && (
          <div className="text-sm font-medium text-muted-foreground/60">
            {label}
          </div>
        )}
        <div className="flex items-center gap-2">
          {isEditing ? (
            <div className="flex items-center gap-2 w-full">
              <Input
                value={editValue}
                onChange={(e) => onEditValueChange?.(e.target.value)}
                className="h-8"
              />
              <Button
                size="sm"
                onClick={() => onSave?.(editValue || "")}
                className="h-8"
              >
                Save
              </Button>
            </div>
          ) : (
            <>
              <div className="text-base font-medium">{info}</div>
              {isVerified && (
                <Check className="h-4 w-4 text-green-500" />
              )}
              {onVerify && !isVerified && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={onVerify}
                  className="h-6 text-xs"
                >
                  Verify
                </Button>
              )}
              {onEdit && (
                <button
                  onClick={onEdit}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Pencil className="h-4 w-4 text-muted-foreground/60" />
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </MotionDiv>
  );
};

const UserInfoBox: React.FC<UserInfoBoxProps> = ({
  userHistory,
  currentBalance,
}) => {
  const [editingField, setEditingField] = useState<"name" | "mobile" | null>(null);
  const [editValue, setEditValue] = useState("");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [verificationStep, setVerificationStep] = useState<"phone" | "otp">("phone");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState("+966"); // Default to Saudi Arabia
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Detect user's country from IP
    fetch('https://ipapi.co/json/')
      .then(res => res.json())
      .then(data => {
        if (data.country_calling_code) {
          setCountryCode(data.country_calling_code);
        }
      })
      .catch(() => {
        // Fallback to Saudi Arabia if detection fails
        setCountryCode("+966");
      });
  }, []);

  // Format date function
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleEdit = (field: "name" | "mobile", value: string) => {
    setEditingField(field);
    setEditValue(value || "");
  };

  const handleSave = async (field: "name" | "mobile", value: string) => {
    if (value.trim()) {
      await updateUserProfile(userHistory.id, { [field]: value });
    }
    setEditingField(null);
    setEditValue("");
  };

  const handleVerifyPhone = () => {
    setShowVerificationDialog(true);
    setVerificationStep("phone");
    setPhoneNumber("");
    setOtp("");
  };

  const handleSendOTP = async () => {
    try {
      setIsLoading(true);
      const fullPhone = `${countryCode}${phoneNumber}`;
      await sendPhoneVerification(fullPhone);
      setVerificationStep("otp");
      toast({
        title: "Success",
        description: "OTP sent successfully!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    try {
      setIsLoading(true);
      const fullPhone = `${countryCode}${phoneNumber}`;
      await verifyPhone(fullPhone, otp);
      await updateUserProfile(userHistory.id, { 
        mobile: fullPhone,
        isVerified: true 
      });
      toast({
        title: "Success",
        description: "Phone number verified successfully!",
      });
      setShowVerificationDialog(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Invalid OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MotionDiv className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EditableInfoItem
          icon={<User />}
          info={userHistory.name ?? "Add name"}
          label="Name"
          onEdit={() => handleEdit("name", userHistory.name || "")}
          isEditing={editingField === "name"}
          onSave={(value) => handleSave("name", value)}
          editValue={editValue}
          onEditValueChange={setEditValue}
        />
        <EditableInfoItem
          icon={<CircumMobile1 />}
          info={userHistory.mobile ?? "Add mobile"}
          label="Mobile"
          onEdit={() => handleEdit("mobile", userHistory.mobile || "")}
          isEditing={editingField === "mobile"}
          onSave={(value) => handleSave("mobile", value)}
          editValue={editValue}
          onEditValueChange={setEditValue}
          isVerified={userHistory.mobileVerified}
          onVerify={handleVerifyPhone}
        />
        <EditableInfoItem
          icon={<ClarityEmailLine />}
          info={userHistory.email ?? "No email"}
          label="Email"
        />
        <EditableInfoItem
          icon={<IxJoin />}
          info={formatDate(userHistory.createdAt)}
          label="Joined"
        />
        <EditableInfoItem
          icon={<PersonStanding />}
          info={userHistory.subscriptionType ?? "Free"}
          label="Subscription"
        />
        <EditableInfoItem
          icon={<IcOutlineAccountBalanceWallet />}
          info={`${userHistory.initailBalance ?? 0} SAR`}
          label="Initial Balance"
        />
        <EditableInfoItem
          icon={<PhBasketLight />}
          info={`${userHistory.usedBalance ?? 0} SAR`}
          label="Used Balance"
        />
        <EditableInfoItem
          icon={<FaBalanceScale />}
          info={`${currentBalance} SAR`}
          label="Current Balance"
        />
      </MotionDiv>

      <Dialog open={showVerificationDialog} onOpenChange={setShowVerificationDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {verificationStep === "phone" ? "Verify Phone Number" : "Enter OTP"}
            </DialogTitle>
            <DialogDescription>
              {verificationStep === "phone"
                ? "Enter your phone number to receive a verification code"
                : "Enter the verification code sent to your phone"}
            </DialogDescription>
          </DialogHeader>

          {verificationStep === "phone" ? (
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="w-24"
                  placeholder="+966"
                />
                <Input
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="555555555"
                />
              </div>
              <Button 
                onClick={handleSendOTP} 
                disabled={!phoneNumber || isLoading}
                className="w-full"
              >
                {isLoading ? "Sending..." : "Send Verification Code"}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="otp">Verification Code</Label>
                <Input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                />
              </div>
              <Button 
                onClick={handleVerifyOTP} 
                disabled={otp.length !== 6 || isLoading}
                className="w-full"
              >
                {isLoading ? "Verifying..." : "Verify"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default UserInfoBox;