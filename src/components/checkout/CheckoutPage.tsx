"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useState, useEffect, useCallback } from "react";
import {
  Form,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormField,
} from "@/components/trainer-dashboard/ui/form";
import { Input } from "@/components/trainer-dashboard/ui/input";
import { Button } from "@/components/trainer-dashboard/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
} from "@/components/trainer-dashboard/ui/select";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/trainer-dashboard/ui/dialog";
import { Textarea } from "@/components/trainer-dashboard/ui/textarea";
import { useSelector } from "react-redux";
import { RootState } from "@/lib/store/store";
import { useRouter } from 'next/navigation';

function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  const listingId = id;
  const memberId = searchParams.get("memberId");
  const userId = localStorage.getItem("userId");
  const [orderId, setOrderId] = useState(null);

  const [listingData, setListingData] = useState({
    "title": "",
    "priceMode": "",
    "price": "",
  });
  const [memberData, setMemberData] = useState({"name": ""});
  const [userData, setUserData] = useState(null);

  const countries = ["USA", "Canada", "UK", "Australia", "India"];
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const checkoutSchema = z.object({
    firstName: z.string().min(1, "Full Name is required"),
    lastName: z.string().min(1, "Full Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(1, "Phone Number is required"),
    address: z.string().min(1, "Address is required"),
    city: z.string().min(1, "City is required"),
    postalCode: z.string().min(1, "Zip Code is required"),
    country: z.string().min(1, "Country is required"),
    paymentMethod: z.string(),
    orderNotes: z.string().optional(),
    listingId: z.string(),
    memberId: z.string(),
  });

  const form = useForm<z.infer<typeof checkoutSchema>>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      postalCode: "",
      city: "",
      country: "",
      paymentMethod: "Credit Card",
      orderNotes: "",
      listingId: listingId || "",
      memberId: memberId || "",
    },
  });

  const [formValues, setFormValues] = useState<z.infer<typeof checkoutSchema>>(
    form.getValues()
  );

  const onSubmit = async (values: z.infer<typeof checkoutSchema>) => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/order/checkout`,
        values,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error posting data:", error);
    }
  };

  const handleSubmit = () => {
    form.handleSubmit(onSubmit)();
    router.push(`/userflow/orders/${userId}`);
  };

  const handleReviewClick = () => {
    setFormValues(form.getValues());
    setIsDialogOpen(true);
  };

  const fillDefaultValues = useCallback ((userData: any) => {
    form.setValue("firstName", userData.firstName || "");
    form.setValue("lastName", userData.lastName || "");
    form.setValue("email", userData.email || "");
}, [form]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/getUserById/${userId}`,
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        setUserData(response.data.user);
        fillDefaultValues(response.data.user);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (userId) {
      fetchUserData();
    }
  }, [userId, fillDefaultValues]);



  // Fetch listing data
  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/listing/listing/${listingId}`
        );
        setListingData(response.data.listing);
      } catch (error) {
        console.error("Error fetching listing data:", error);
      }
    };

    if (listingId) {
      fetchListing();
    }
  }, [listingId]);

  // Fetch member data
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}/user/members/${memberId}`,
          {
            headers: {
              Authorization: "Bearer " + window.localStorage.getItem("token"),
            },
          }
        );
        setMemberData(response.data.member);
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };

    if (memberId) {
      fetchMemberData();
    }
  }, [memberId]);

  return (
    <div className="flex justify-between p-4">
      {/* LeftSide - Billing Details */}
      <div className="flex-1 m-2 p-4">
        <div className="m-4 flex justify-center">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="w-full max-w-lw py-4 space-y-4 p-6 shadow-md rounded-md "
            >
              <div className="text-xl font-bold mb-3">Billing details</div>

              {/* First Name Field */}
              <FormField
                name="firstName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your first name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Last Name Field */}
              <FormField
                name="lastName"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your last name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email Field */}
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="Enter your Email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Phone Field */}
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your phone number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Address Field */}
              <FormField
                name="address"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Zip Code Field */}
              <FormField
                name="postalCode"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Postal Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your postal code" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* City Field */}
              <FormField
                name="city"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter your city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Country Field */}
              <FormField
                name="country"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your country" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Countries</SelectLabel>
                            {countries.map((country) => (
                              <SelectItem key={country} value={country}>
                                {country}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Payment Method Field */}
              <FormField
                name="paymentMethod"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={(value) => field.onChange(value)}
                        value={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select payment method" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Payment Methods</SelectLabel>
                            <SelectItem value="Credit Card">
                              Credit Card
                            </SelectItem>
                            <SelectItem value="PayPal">PayPal</SelectItem>
                            <SelectItem value="Bank Transfer">
                              Bank Transfer
                            </SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* orderNotes Field */}
              <FormField
                name="orderNotes"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Additional details for your order"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Review Button */}
              <Button
                type="button"
                variant="default"
                onClick={handleReviewClick}
              >
                Review and Submit
              </Button>
            </form>
          </Form>
        </div>
      </div>

      {/* RightSide - Order payment details */}
      <div className="flex-1 m-2 p-4 text-center">
        <div className="max-w-md mx-auto bg-white shadow-md rounded-md p-6">
          <h2 className="text-xl font-bold mb-3">Your order</h2>
          <div className="border-t border-gray-200">
            <div className="flex justify-between py-2">
              <span className="font-medium">Product</span>
            </div>
            <div className="flex justify-between py-2">
              <div>
                <span>{listingData?.title || "Product Name"}</span>{" "}
                {/* Listing title */}
                <br />
                <span className="text-gray-500">
                  Learner: {memberData?.name}
                </span>
              </div>
              <span>${listingData?.price || "0.00"}</span> {/* Listing price */}
            </div>
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between py-2">
              <span>Subtotal</span>
              <span>${listingData?.price || "0.00"}</span>
            </div>
            {/* Additional order details */}
            <div className="border-t border-gray-200 my-2"></div>
            <div className="flex justify-between py-2 font-bold">
              <span>Total</span>
              <span>${listingData?.price || "0.00"}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dialog for review */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review your order</DialogTitle>
            <DialogDescription>
              Please review your order before submitting.
            </DialogDescription>
          </DialogHeader>

          {/* Display form details */}
          <div className="space-y-2">
            <div>
              <strong>Name:</strong> {formValues.firstName}{" "}
              {formValues.lastName}
            </div>
            <div>
              <strong>Email:</strong> {formValues.email}
            </div>
            <div>
              <strong>Phone:</strong> {formValues.phone}
            </div>
            <div>
              <strong>Address:</strong> {formValues.address}, {formValues.city},{" "}
              {formValues.country}
            </div>
            <div>
              <strong>Postal Code:</strong> {formValues.postalCode}
            </div>
            <div>
              <strong>Payment Method:</strong> {formValues.paymentMethod}
            </div>
            {formValues.orderNotes && (
              <div>
                <strong>Order Notes:</strong> {formValues.orderNotes}
              </div>
            )}
          </div>

          {/* Submit Order Button */}
          <div className="flex justify-end mt-4">
            <Button onClick={handleSubmit}>Submit Order</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default CheckoutPage;
