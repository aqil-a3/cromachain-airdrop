"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, UserSchemaType } from "../../../schemas/userSchema";
import { userDefaultValues } from "../../features/admin/user/variables/values";
import { UserProfile } from "@/@types/user";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Eye, EyeClosed } from "lucide-react";

interface UserSchemaProps {
  defaultValue?: UserProfile;
  onSubmit: (data: UserSchemaType) => Promise<void> | void;
}

export default function UserForm({ onSubmit, defaultValue }: UserSchemaProps) {
  const pathname = usePathname();
  const [hidePassword, setHidePassword] = useState<boolean>(true);
  const [hideConfirmPassword, setHideConfirmPassword] = useState<boolean>(true);

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: defaultValue ?? userDefaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;
  const isAdmin = pathname.includes("/admin");

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  className="text-black"
                  type="hidden"
                  disabled={isSubmitting}
                  placeholder="e.g. John Dave"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    className="text-black w-full"
                    disabled={isSubmitting}
                    placeholder="e.g. John Dave"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    className="text-black w-full"
                    disabled={isSubmitting}
                    type="email"
                    placeholder="example@email.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Button
                      type="button"
                      variant={"ghost"}
                      size={"icon"}
                      className="absolute top-0 left-0 text-black"
                      onClick={() => setHidePassword(!hidePassword)}
                    >
                      {hidePassword ? <Eye /> : <EyeClosed /> }
                    </Button>
                    <Input
                      type={hidePassword ? "password" : "text"}
                      className="text-black w-full px-10"
                      disabled={isSubmitting}
                      placeholder="e.g. *******"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Button
                      type="button"
                      variant={"ghost"}
                      size={"icon"}
                      className="absolute top-0 left-0 text-black"
                      onClick={() => setHideConfirmPassword(!hideConfirmPassword)}
                    >
                      {hideConfirmPassword ? <Eye /> : <EyeClosed /> }
                    </Button>
                    <Input
                      type={hideConfirmPassword ? "password" : "text"}
                      className="text-black w-full px-10"
                      disabled={isSubmitting}
                      placeholder="e.g. *******"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="telegramUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Username</FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  disabled={isSubmitting}
                  placeholder="username"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="discordUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discord Username</FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  disabled={isSubmitting}
                  placeholder="discordUser"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="twitterUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Twitter Username</FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  disabled={isSubmitting}
                  placeholder="twitterUser"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ethAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ethereum Address</FormLabel>
              <FormControl>
                <Input
                  className="text-black"
                  disabled={isSubmitting}
                  placeholder="0x..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {isAdmin && (
          <FormField
            control={form.control}
            name="role"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Role</FormLabel>
                <FormControl>
                  <Input
                    className="text-black"
                    disabled={isSubmitting}
                    placeholder="user / admin"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Optional : If empty, it will set as "user"
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? "Processing..." : "Save User"}
        </Button>
      </form>
    </Form>
  );
}
