"use client";

import React, { useState } from "react";
import classes from "./ContactForm.module.css";
import { Button, Group, Textarea, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { action } from "@/utils/contact-form-actions";
import validator from "validator";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

export interface Values {
  name: string;
  email: string;
  phone: string;
  comment: string;
}

const ContactForm = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [submitted, setSubmitted] = useState<boolean>(false);

  // Mantine Docs
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      name: "",
      email: "",
      phone: "",
      comment: "",
    },

    validate: {
      email: (value) =>
        validator.isEmail(value) ? null : "Please enter an email address",
    },
  });

  const handleSubmit = async (values: Values) => {
    if (loading) return;
    setLoading(true);

    try {
      await action({ values });
      setSubmitted(true);
      form.reset();
    } catch (e) {
      console.error("Could not submit contact form", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      className={"flex flex-col gap-4 px-2 lg:px-0"}
      onSubmit={form.onSubmit(handleSubmit)}
      onReset={form.onReset}
    >
      <TextInput
        label="Name"
        placeholder="Name"
        key={form.key("name")}
        {...form.getInputProps("name")}
      />

      <TextInput
        classNames={classes}
        withAsterisk
        label="Email"
        placeholder="Email *"
        key={form.key("email")}
        {...form.getInputProps("email")}
      />

      <TextInput
        label="Phone Number"
        placeholder="Phone number"
        key={form.key("phone")}
        {...form.getInputProps("phone")}
      />

      <Textarea
        minRows={4}
        resize={"vertical"}
        label="Comment"
        placeholder="Comment"
        key={form.key("comment")}
        {...form.getInputProps("comment")}
      />

      {submitted && (
        <div className={"flex"}>
          <CheckCircleIcon className={"text-green-700 size-6 shrink-0"} />
          <p className={"text-gray-800"}>
            Thanks for contacting us. We&#39;ll get back to you as soon as
            possible.
          </p>
        </div>
      )}

      <Group justify="flex-start" mt="md">
        <Button disabled={loading} type="submit" color={"rgba(77, 77, 77, 1)"}>
          {loading ? "Sending..." : "Send"}
        </Button>
      </Group>
    </form>
  );
};

export default ContactForm;
