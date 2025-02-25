import { Checkbox } from "~/components/Checkbox";
import { useField } from "remix-validated-form";
import { Error } from "~/components/Typography";

type Props = {
  items: { id: string; name: string }[];
  name: string;
  checkedTags: string[];
  onChange: (tagId: string) => void;
};

export const FormCheckboxGroup = ({
  items,
  name,
  checkedTags,
  onChange,
}: Props) => {
  const { error, getInputProps } = useField(name);
  return (
    <div className="w-full flex flex-col gap-2">
      <div className="w-full flex flex-wrap gap-2">
        {items.map((item) => (
          <Checkbox
            key={item.id}
            {...getInputProps({
              id: item.id,
              checked: checkedTags.includes(item.id),
              label: item.name,
              value: item.id,
            })}
            name={name}
            onChange={() => onChange(item.id)}
          />
        ))}
      </div>
      {error && <Error>{error}</Error>}
    </div>
  );
};
