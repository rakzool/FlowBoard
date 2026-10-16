import { useState } from "react";
import Button from "../DesignComponents/Button";
import Input from "../DesignComponents/Input";
import Modal from "../DesignComponents/Modal";
import MultiInput, {
  type TMultiInputOption,
} from "../DesignComponents/MultiInput";
import Select from "../DesignComponents/Select";
import type {
  TContainerAccessDetails,
  TVisibility,
} from "../../store/types/common.types";

type TContainerDetailsModalProps = {
  title: string;
  name: string;
  visibility?: TVisibility;
  allowedUserIds?: string[];
  deniedUserIds?: string[];
  userOptions?: TMultiInputOption[];
  canManageAccess?: boolean;
  onSubmit: (name: string, accessDetails?: TContainerAccessDetails) => void;
  onClose: () => void;
};

export default function ContainerDetailsModal({
  title,
  name: initialName,
  visibility: initialVisibility = "private",
  allowedUserIds = [],
  deniedUserIds = [],
  userOptions = [],
  canManageAccess = false,
  onSubmit,
  onClose,
}: TContainerDetailsModalProps) {
  const [name, setName] = useState(initialName);
  const [visibility, setVisibility] = useState<TVisibility>(initialVisibility);
  const [allowedUsers, setAllowedUsers] = useState(allowedUserIds);
  const [deniedUsers, setDeniedUsers] = useState(deniedUserIds);
  const hasAccessSettings = canManageAccess && userOptions.length > 0;
  return (
    <Modal open title={title} onClose={onClose}>
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          if (name.trim())
            onSubmit(
              name.trim(),
              hasAccessSettings
                ? {
                    visibility,
                    allowedUserIds:
                      visibility === "private" ? allowedUsers : [],
                    deniedUserIds: deniedUsers,
                  }
                : undefined,
            );
        }}
      >
        <Input
          autoFocus
          placeholder="Name"
          value={name}
          changeHandler={(event) => setName(event.target.value)}
        />
        {hasAccessSettings && (
          <>
            <Select
              label="Visibility"
              value={visibility}
              options={[
                { value: "private", label: "Private" },
                { value: "public", label: "Public" },
              ]}
              onChange={(value) => setVisibility(value as TVisibility)}
            />
            {visibility === "private" && (
              <MultiInput
                label="Allowed users"
                placeholder="Add a user"
                value={allowedUsers}
                options={userOptions.filter(
                  (option) => !deniedUsers.includes(option.value),
                )}
                onChange={setAllowedUsers}
              />
            )}
            <MultiInput
              label="Denied users"
              placeholder="Add a user"
              value={deniedUsers}
              options={userOptions.filter(
                (option) => !allowedUsers.includes(option.value),
              )}
              onChange={setDeniedUsers}
            />
          </>
        )}
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            className="px-3 py-2 text-sm"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            disabled={!name.trim()}
            className="px-3 py-2 text-sm"
          >
            Save
          </Button>
        </div>
      </form>
    </Modal>
  );
}
