import { Task } from "@/@types/tasks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { TaskFormSchema, taskSchema } from "../../../../../schemas/taskSchema";
import { taskDefaultValues } from "../variables/values";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { lucideIconNames } from "@/lib/variables";
import React, { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";

export interface TaskFormContext {
  defaultValues?: Task;
  submitHandler: (values: TaskFormSchema) => void | Promise<void>;
}

interface TaskFormProps {
  context: TaskFormContext;
}

export default function TaskForm({ context }: TaskFormProps) {
  const { submitHandler, defaultValues } = context;
  const [IconPreview, setIconPreview] = useState<LucideIcons.LucideIcon | null>(
    null
  );
  const form = useForm<TaskFormSchema>({
    resolver: zodResolver(taskSchema),
    defaultValues: defaultValues ?? taskDefaultValues,
  });

  const [rawRequirements, setRawRequirements] = useState<string>("");

  useEffect(() => {
    setRawRequirements(form.getValues("requirements")?.join(", ") ?? "");
  }, [form]);

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(submitHandler)} className="space-y-6">
        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Task Id"
                  readOnly
                  type="hidden"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="Task title"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  placeholder="Task description..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="social">Social</SelectItem>
                  <SelectItem value="onchain">On-chain</SelectItem>
                  <SelectItem value="community">Community</SelectItem>
                  <SelectItem value="bonus">Bonus</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="platform"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Platform</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. Twitter, Discord"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reward"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward (CROMA)</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  type="number"
                  min={0}
                  value={field.value}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="rewardType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Reward Type</FormLabel>
              <FormControl>
                <Input disabled={isSubmitting} type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="difficulty"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Difficulty</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select difficulty" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Easy">Easy</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Hard">Hard</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="timeEstimate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Time Estimate</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. ~5 minutes"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select
                disabled={isSubmitting}
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="not-started">Not Started</SelectItem>
                  <SelectItem value="pending-verification">
                    Pending Verification
                  </SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="locked"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>Locked</FormLabel>
                <FormDescription>
                  Toggle if this task should be locked until requirements are
                  met.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  disabled={isSubmitting}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="iconName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Icon Name</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. Twitter, Discord"
                  list="lucide-icons"
                  {...field}
                  onBlur={(e) => {
                    field.onBlur();
                    const value = e.target.value;
                    if (lucideIconNames.includes(value)) {
                      const IconComp = LucideIcons[
                        value as keyof typeof LucideIcons
                      ] as LucideIcons.LucideIcon;
                      setIconPreview(() => IconComp);
                    } else {
                      setIconPreview(null);
                    }
                  }}
                />
              </FormControl>
              <datalist id="lucide-icons">
                {lucideIconNames.map((name) => (
                  <option key={name} value={name} />
                ))}
              </datalist>
              {IconPreview ? (
                <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                  <span>Preview:</span>
                  <IconPreview className="w-4 h-4" />
                </div>
              ) : (
                field.value && (
                  <p className="text-sm text-destructive mt-1">
                    Icon "{field.value}" not found.
                  </p>
                )
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="action"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Action</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="e.g. Follow, Retweet"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="link"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input
                  disabled={isSubmitting}
                  placeholder="https://..."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="requirements"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Requirements</FormLabel>
              <FormControl>
                <Textarea
                  disabled={isSubmitting}
                  placeholder="Separate multiple requirements with commas"
                  value={rawRequirements}
                  onChange={(e) => {
                    setRawRequirements(e.target.value);
                  }}
                  onBlur={() => {
                    const parsed = rawRequirements
                      .split(",")
                      .map((s) => s.trim())
                      .filter((s) => s.length > 0);
                    field.onChange(parsed);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing..." : "Save Tasks"}
        </Button>
      </form>
    </Form>
  );
}
