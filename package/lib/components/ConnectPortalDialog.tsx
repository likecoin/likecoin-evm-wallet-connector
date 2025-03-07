import * as React from "react";
import {
  Description,
  DialogTitle,
  Field,
  Input,
  Label,
} from "@headlessui/react";
import { clsx } from "clsx/lite";

import { PlainDialog } from "./PlainDialog";

export interface ConnectPortalDialogProps {
  providers?: { id: string; name: string }[];
  isOpen?: boolean;
  onConnect?: (id: string, payload?: { email: string }) => void;
  onClose?: () => void;
}

export const ConnectPortalDialog: React.FC<ConnectPortalDialogProps> = (
  props
) => {
  const [email, setEmail] = React.useState("");

  function handleClose() {
    props.onClose?.();
    setEmail("");
  }

  function connectWith(id: string) {
    if (id === "email" && !email) {
      return;
    }
    props.onConnect?.(id, { email });
  }

  return (
    <PlainDialog isOpen={props.isOpen} onClose={handleClose}>
      <DialogTitle
        as="h3"
        className="lk-text-base/7 lk-text-lg lk-font-bold lk-text-black"
      >
        Connect Portal
      </DialogTitle>

      <div>
        <Field className="mt-4">
          <Label className="lk-text-sm/6 lk-font-medium lk-text-black">
            Email
          </Label>
          <Input
            className="lk-mt-1 lk-block lk-w-full lk-rounded-lg lk-border-none lk-bg-black/5 lk-py-1.5 lk-px-3 lk-text-sm/6 lk-text-black lk-focus:outline-none lk-data-[focus]:outline-2 lk-data-[focus]:-outline-offset-2 lk-data-[focus]:outline-black/25"
            value={email}
            type="email"
            placeholder="john@example.com"
            onChange={(e) => setEmail(e.target.value)}
          />
        </Field>

        <button
          className={clsx(
            "lk-mt-2 lk-w-full lk-text-gray-300 lk-bg-gray-500 lk-rounded-md lk-px-3 lk-py-2 lk-text-sm lk-font-medium",
            !!email && "lk-hover:bg-gray-700 lk-hover:text-white"
          )}
          disabled={!email}
          onClick={() => connectWith("email")}
        >
          Continue with Email
        </button>
      </div>

      {props.providers?.length && (
        <div className="lk-mt-4">
          <Description
            as="p"
            className="lk-text-sm/6 lk-text-center lk-text-gray-500"
          >
            or
          </Description>
          <ul className="lk-flex lk-items-center lk-flex-col lk-gap-2 lk-mt-4 lk-w-full">
            {props.providers?.map(({ id, name }) => (
              <li key={id} className="lk-w-full">
                <button
                  className="lk-w-full lk-text-gray-300 lk-bg-gray-500 lk-hover:bg-gray-700 lk-hover:text-white lk-rounded-md lk-px-3 lk-py-2 lk-text-sm lk-font-medium"
                  onClick={() => connectWith(id)}
                >
                  {name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </PlainDialog>
  );
};
