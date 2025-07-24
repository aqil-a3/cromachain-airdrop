"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { userSchema, UserSchemaType } from "../variables/schema";
import { userDefaultValues } from "../variables/values";
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

export interface UserSchemaContext {
  defaultValue?: UserProfile;
  onSubmit: (data: UserSchemaType) => Promise<void> | void;
}

interface UserSchemaProps {
  context: UserSchemaContext;
}

export default function UserForm({ context }: UserSchemaProps) {
  const { defaultValue: values, onSubmit } = context;

  const form = useForm<UserSchemaType>({
    resolver: zodResolver(userSchema),
    defaultValues: values ?? userDefaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 max-w-2xl"
      >
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
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

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input
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

        <FormField
          control={form.control}
          name="telegramUsername"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Telegram Username</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="@username"
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
                  disabled={isSubmitting}
                  placeholder="@discordUser"
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
                  disabled={isSubmitting}
                  placeholder="@twitterUser"
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
                <Input disabled={isSubmitting} placeholder="0x..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <Input
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

        <Button disabled={isSubmitting} type="submit" className="w-full">
          {isSubmitting ? "Processing..." : "Save User"}
        </Button>
      </form>
    </Form>
  );
}
