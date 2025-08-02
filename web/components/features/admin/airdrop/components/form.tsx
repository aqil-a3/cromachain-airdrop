import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { airdropSchema, AirdropSchemaType } from "../variables/schema";
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
import { Button } from "@/components/ui/button";
import { DatePicker } from "./DatePicker";
import { Switch } from "@/components/ui/switch";

const defaultValues: AirdropSchemaType = {
  is_active: false,
  time_left: new Date(),
  title: "",
  total_token: 0,
  token_claimed: 0,
  participants: 0,
  progress: 0,
  created_at: "",
  id: "",
};

interface AirdropFormProps {
  defaultData?: AirdropSchemaType;
  submitHandler: (values: AirdropSchemaType) => void | Promise<void>;
}

export default function AirdropForm({
  submitHandler,
  defaultData,
}: AirdropFormProps) {
  const form = useForm<AirdropSchemaType>({
    resolver: zodResolver(airdropSchema),
    defaultValues: defaultData ?? defaultValues,
  });

  const isSubmitting = form.formState.isSubmitting;

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-8">
          {/* Is Active */}
          <FormField
            control={form.control}
            name="is_active"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <div>
                    <FormLabel>Is Active</FormLabel>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Title */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airdrop Title</FormLabel>
                <FormControl>
                  <Input
                    disabled={isSubmitting}
                    placeholder="Airdrop 001..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Time Left */}
          <FormField
            control={form.control}
            name="time_left"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Airdrop Time Left</FormLabel>
                <FormControl>
                  <DatePicker onChange={field.onChange} value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Total Token */}
          <FormField
            control={form.control}
            name="total_token"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Total</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Token Claimed */}
          <FormField
            control={form.control}
            name="token_claimed"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Token Claimed</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Participants */}
          <FormField
            control={form.control}
            name="participants"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Participants</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Progress */}
          <FormField
            control={form.control}
            name="progress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Progress</FormLabel>
                <FormControl>
                  <Input disabled={isSubmitting} type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isSubmitting} type="submit" className="w-full">
            {isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
