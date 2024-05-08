interface RadioGroupProp {
  label: string | JSX.Element;
  name: string;
  direction: "flex-row" | "flex-col";
  items: { label: string }[];
  value?: string;
  fullWidth?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const RadioGroup = (props: RadioGroupProp) => {
  return (
    <div
      className={`flex flex-col gap-2 ${
        props.fullWidth ? "w-full" : "max-w-lg"
      } `}
    >
      {props.label}
      <div
        className={`flex ${props.direction} gap-4 flex-wrap max-sm:flex-col`}
      >
        {props.items.map((i, index) => {
          const isChecked = props.value === i.label;
          return (
            <div
              key={props.name + index}
              className={`form-control py-2 px-1  flex-1 ${
                isChecked
                  ? "border-primary border-[1px] rounded-md border-opacity-80"
                  : "border-primary border-b-[1px] border-opacity-10"
              }`}
            >
              <label className="label cursor-pointer gap-4">
                <span
                  className={`label-text ${isChecked ? "text-primary" : ""}`}
                >
                  {i.label}
                </span>
                <input
                  type="radio"
                  name={`${props.name}:${i.label}`}
                  className={`radio checked:bg-primary checkbox-primary`}
                  checked={isChecked}
                  onChange={props?.onChange}
                  disabled={props.disabled}
                />
              </label>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RadioGroup;
