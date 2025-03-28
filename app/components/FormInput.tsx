import { Label, Error } from "./Typography";
import { Input } from "./Input";
import { useField } from "remix-validated-form";

type Props = {
  label: string;
  id: string;
  name: string;
  type: string;
  required?: boolean;
  placeholder?: string;
};

export const FormInput = ({
  label,
  name,
  type,
  required,
  placeholder,
}: Props) => {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Input
        {...getInputProps({ id: name, type })}
        required={required}
        placeholder={placeholder}
      />
      {error && <Error>{error}</Error>}
    </>
  );
};
