import { Label, Error } from "./Typography";
import { Textarea } from "./Textarea";
import { useField } from "remix-validated-form";

type Props = {
  label: string;
  id: string;
  name: string;
};

export const FormTextarea = ({ label, name }: Props) => {
  const { error, getInputProps } = useField(name);
  return (
    <>
      <Label htmlFor={name}>{label}</Label>
      <Textarea {...getInputProps({ id: name })} />
      {error && <Error>{error}</Error>}
    </>
  );
};
