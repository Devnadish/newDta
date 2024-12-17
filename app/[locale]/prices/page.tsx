import React from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";
import { cn } from "@/lib/utils";

const PricingPage = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center space-y-4 mb-12">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
          Simple, transparent pricing
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
          Choose the perfect plan for your needs. All plans include 14-day free trial.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
        {/* Basic Plan */}
        <Card className="relative group hover:shadow-xl transition-all duration-300 border-gray-200 flex justify-between flex-col">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Basic</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">$10</span>
              <span className="text-gray-500">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Up to 10 projects",
                "5GB storage",
                "Basic analytics",
                "24/7 support",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </CardFooter>
        </Card>

        {/* Standard Plan */}
        <Card className="relative flex justify-between flex-col group hover:shadow-xl transition-all duration-300 border-2 border-purple-500 transform hover:-translate-y-1">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2">
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-1">
              Most Popular
            </Badge>
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Standard</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">$20</span>
              <span className="text-gray-500">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Up to 50 projects",
                "20GB storage",
                "Advanced analytics",
                "Priority support",
                "Custom domains",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:opacity-90 text-white py-3 px-6 rounded-lg font-medium transition-all">
              Get Started
            </button>
          </CardFooter>
        </Card>

        {/* Premium Plan */}
        <Card className="relative flex justify-between flex-col group hover:shadow-xl transition-all duration-300 border-gray-200">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Premium</CardTitle>
            <CardDescription>
              <span className="text-3xl font-bold">$30</span>
              <span className="text-gray-500">/month</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                "Unlimited projects",
                "100GB storage",
                "Premium analytics",
                "24/7 priority support",
                "Custom domains",
                "API access",
                "Team collaboration",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-2">
                  <Check className="h-5 w-5 text-green-500" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter >
            <button className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 px-6 rounded-lg font-medium transition-colors">
              Get Started
            </button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default PricingPage;