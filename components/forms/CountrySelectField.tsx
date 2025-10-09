import { Label } from "@/components/ui/label";
import { Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { COUNTRIES } from "@/lib/constants";

const CountrySelectField = ({
  name,
  label,
  control,
  error,
  required = false,
}: CountrySelectProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={name} className="form-label">
        {label}
      </Label>

      <Controller
        name={name}
        control={control}
        rules={{
          required: required ? `Please select ${label.toLowerCase()}` : false,
        }}
        render={({ field }) => (
          //  Based from shadCN/UI select Docs
          <Select value={field.value} onValueChange={field.onChange}>
            {/* country dropdown */}
            <SelectTrigger className="select-trigger">
              <SelectValue placeholder="选择您所在的国家" />
            </SelectTrigger>
            <SelectContent>
              {COUNTRIES.map((country, index) => (
                <SelectItem key={index} value={country}>
                  {country}
                </SelectItem>
              ))}
            </SelectContent>
            {error && <p className="text-sm text-red-500">{error.message}</p>}
          </Select>
        )}
      />
    </div>
  );
};
export default CountrySelectField;
