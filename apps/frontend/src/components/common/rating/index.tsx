interface RatingProp {
  name: string;
  count: number;
  value: number;
  label?: string;
  valueLabel?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const Rating = (props: RatingProp) => {
  return (
    <div className="flex flex-row gap-8 max-sm:flex-col max-md:gap-2 py-2 border-primary border-b-[1px] border-opacity-10">
      {props.label && (
        <span className="label label-text font-semibold min-w-[10rem]">
          {props.label}
        </span>
      )}

      <span
        className={`label text-sm min-w-[10rem] flex-1 ${
          props.valueLabel ? "text-info" : "text-gray-300"
        }`}
      >
        {props.valueLabel ? props.valueLabel : "Select rating"}
      </span>
      <div className="rating gap-4 justify-center items-center max-md:justify-start">
        {Array.from({ length: Number(props.count) }, (_, i) => i + 1).map(
          (i) => {
            const isChecked = props.value === i;
            const hasValue = props.value > 0;
            return (
              <input
                key={props.name + i}
                type="radio"
                name={`${props.name}:${i}`}
                checked={isChecked}
                onChange={props.onChange}
                className={`mask mask-star-2 ${
                  hasValue ? "bg-primary" : "bg-primary bg-opacity-20"
                } `}
                disabled={props.disabled}
              />
            );
          }
        )}
      </div>
    </div>
  );
};

export default Rating;
